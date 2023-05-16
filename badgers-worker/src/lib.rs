use std::borrow::Cow;

use worker::*;
use badgers::{BadgeBuilder, ColorPalette, color_palettes};

mod utils;

const DEFAULT_CACHE_DURATION: u32 = 3600; // 1 hour
const ERROR_CACHE_DURATION: u32 = 300; // 5 minutes

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    utils::set_panic_hook();

    fn get_error_svg() -> String {
        BadgeBuilder::new()
            .label("badgers")
            .status("error")
            .color("gray")
            .build()
            .svg()
    }

    fn get_svg_headers(cache_duration: u32) -> Option<Headers> {
        let mut headers = Headers::new();
        headers.set("Encoding", "UTF-8").ok()?;
        headers.set("Content-Type", "image/svg+xml").ok()?;
        headers.set("Cache-Control", &format!("public, max-age={cache_duration}, immutable")).ok()?;
        Some(headers)
    }

    fn handle_badge_route(req: Request, ctx: RouteContext<()>) -> worker::Result<Response> {
        // Get path params
        let mut label = ctx.param("label").cloned();
        let mut color = ctx.param("color").cloned();
        let status = ctx.param("status").cloned();

        // Initialize query params
        let mut label_color: Option<String> = None;
        let mut scale: Option<f32> = None;
        let mut theme: &'static ColorPalette = &color_palettes::BADGEN;
        let mut cache = DEFAULT_CACHE_DURATION;

        // Parse query params
        if let Ok(options) = req.url().as_ref().map(|url| url.query_pairs()) {
            for (key, value) in options {
                match key.as_ref() {
                    "label" => label = Some(value.into_owned()),
                    "label_color" => label_color = Some(value.into_owned()),
                    "color" => color = Some(value.into_owned()),
                    "scale" => scale = value.parse().ok(),
                    "cache" => cache = value.parse().unwrap_or(cache),
                    "theme" => {
                        theme = match value.as_ref() {
                            "badgen" => &color_palettes::BADGEN,
                            "tailwind" => &color_palettes::TAILWIND,
                            _ => theme,
                        }
                    },
                    _ => (),
                }
            }
        }

        // Url-decode label
        let label = match label {
            Some(label) => urlencoding::decode(&label)
                .unwrap_or_else(|_| label.to_owned().into())
                .into_owned(),
            None => return Response::error("Missing label in url path.", 400),
        };

        // Url-decode status
        let status = match status {
            Some(status) => urlencoding::decode(&status)
                .unwrap_or(status.to_owned().into())
                .into_owned(),
            None => return Response::error("Missing status in url path.", 400),
        };

        // Build badge svg
        let badge = BadgeBuilder::new()
            .label(label)
            .label_color_option(label_color)
            .status(status)
            .color_option(color)
            .scale(scale.unwrap_or(1.0))
            .color_palette(Cow::Borrowed(theme))
            .build()
            .svg();

        // Send response
        if let Ok(response) = Response::from_bytes(badge.into_bytes()) {
            Ok(response.with_headers(get_svg_headers(cache).unwrap()))
        } else if let Ok(response) = Response::from_bytes(get_error_svg().into_bytes()) {
            Ok(response.with_headers(get_svg_headers(ERROR_CACHE_DURATION).unwrap()))
        } else {
            Response::error("Failed to build badge.", 500)
        }
    }

    Router::new()
        .get("/badge/:label/:status/:color", handle_badge_route)
        .get("/badge/:label/:status", handle_badge_route)
        .run(req, env)
        .await
}
