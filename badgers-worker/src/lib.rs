use std::borrow::Cow;

use spacebadgers::{color_palettes, BadgeBuilder, ColorPalette};
use worker::*;

mod icon;
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
        headers
            .set(
                "Cache-Control",
                &format!("public, max-age={cache_duration}, immutable"),
            )
            .ok()?;
        Some(headers)
    }

    async fn handle_badge_route(req: Request, ctx: RouteContext<()>) -> worker::Result<Response> {
        // Get path params
        let mut label = ctx.param("label").cloned();
        let mut color = ctx.param("color").cloned();
        let status = ctx.param("status").cloned();

        // Initialize query params
        let mut label_color: Option<String> = None;
        let mut scale: Option<f32> = None;
        let mut theme: ColorPalette = color_palettes::BADGEN;
        let mut cache = DEFAULT_CACHE_DURATION;
        let mut icon: Option<String> = None;
        let mut icon_width: Option<u32> = None;

        // Parse query params
        if let Ok(options) = req.url().as_ref().map(|url| url.query_pairs()) {
            for (key, value) in options {
                match key.as_ref() {
                    "label" => label = Some(value.into_owned()),
                    "label_color" => label_color = Some(value.into_owned()),
                    "color" => color = Some(value.into_owned()),
                    "scale" => scale = value.parse().ok(),
                    "cache" => cache = value.parse().unwrap_or(cache),
                    "icon" => icon = Some(value.into_owned()),
                    "icon_width" => icon_width = value.parse().ok(),
                    "theme" => theme = ColorPalette::from_name(&value).into_owned(),
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

        // Fetch icon as base64
        let fetched_icon = if let Some(icon) = icon {
            icon::Icon::new(&icon).fetch_as_data().await
        } else {
            None
        };

        // Build badge svg
        let badge = BadgeBuilder::new()
            .label(label)
            .optional_label_color(label_color)
            .status(status)
            .optional_color(color)
            .scale(scale.unwrap_or(1.0))
            .color_palette(Cow::Owned(theme))
            .optional_icon(fetched_icon)
            .optional_icon_width(icon_width)
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
        .get_async("/badge/:label/:status/:color", handle_badge_route)
        .get_async("/badge/:label/:status", handle_badge_route)
        .run(req, env)
        .await
}
