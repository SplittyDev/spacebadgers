use std::borrow::Cow;

use worker::*;
use badgers::{BadgeBuilder, ColorPalette, color_palettes};

mod utils;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    utils::set_panic_hook();

    fn get_svg_headers() -> Option<Headers> {
        let mut headers = Headers::new();
        headers.set("Encoding", "UTF-8").ok()?;
        headers.set("Content-Type", "image/svg+xml").ok()?;
        headers.set("Cache-Control", "public, max-age=300, immutable").ok()?;
        Some(headers)
    }

    fn handle_badge_route(req: Request, ctx: RouteContext<()>) -> worker::Result<Response> {
        let mut label = ctx.param("label").cloned();
        let mut color = ctx.param("color").cloned();
        let status = ctx.param("status").cloned();
        let mut label_color: Option<String> = None;
        let mut scale: Option<f32> = None;
        let mut theme: &'static ColorPalette = &color_palettes::BADGEN;

        if let Ok(options) = req.url().as_ref().map(|url| url.query_pairs()) {
            for (key, value) in options {
                match key.as_ref() {
                    "label" => label = Some(value.into_owned()),
                    "label_color" => label_color = Some(value.into_owned()),
                    "color" => color = Some(value.into_owned()),
                    "scale" => scale = value.parse().ok(),
                    "theme" => {
                        theme = match value.as_ref() {
                            "badgen" => &color_palettes::BADGEN,
                            _ => theme,
                        }
                    }
                    _ => (),
                }
            }
        }

        let label = match label {
            Some(label) => urlencoding::decode(&label)
                .unwrap_or_else(|_| label.to_owned().into())
                .into_owned(),
            None => return Response::error("Missing label in url path.", 400),
        };

        let status = match status {
            Some(status) => urlencoding::decode(&status)
                .unwrap_or(status.to_owned().into())
                .into_owned(),
            None => return Response::error("Missing status in url path.", 400),
        };

        println!("Label: {label}; Status: {status}");

        let badge = BadgeBuilder::new()
            .label(label)
            .label_color_option(label_color)
            .status(status)
            .color_option(color)
            .scale(scale.unwrap_or(1.0))
            .color_palette(Cow::Borrowed(theme))
            .build()
            .svg();

        if let Ok(response) = Response::from_bytes(badge.into_bytes()) {
            Ok(response.with_headers(get_svg_headers().unwrap()))
        } else {
            Response::error("Error while generating badge.", 500)
        }
    }

    Router::new()
        .get("/badge/:label/:status/:color", handle_badge_route)
        .get("/badge/:label/:status", handle_badge_route)
        .run(req, env)
        .await
}
