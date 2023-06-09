use indoc::formatdoc;
use spacebadgers_utils::minify::minify_svg;
use std::borrow::Cow;

use crate::{util::calculate_width, ColorPalette};

/// Badge generator.
pub struct Badge {
    pub(crate) color_palette: Cow<'static, ColorPalette>,
    pub(crate) status: Cow<'static, str>,
    pub(crate) label: Option<Cow<'static, str>>,
    pub(crate) color: Option<Cow<'static, str>>,
    pub(crate) label_color: Option<Cow<'static, str>>,
    pub(crate) icon: Option<Cow<'static, str>>,
    pub(crate) icon_width: Option<u32>,
    pub(crate) corner_radius: Option<u32>,
    pub(crate) scale: f32,
}

impl Badge {
    fn accessible_text(&self) -> String {
        let prefix = self
            .label
            .as_ref()
            .map(|label| format!("{label}: "))
            .unwrap_or_default();
        format!("{prefix}{status}", status = self.status)
    }

    /// Generate an SVG badge.
    pub fn svg(&self) -> String {
        let label_padding: f32 = 50.0;
        let status_padding: f32 = 50.0;
        let text_shadow_offset: f32 = 10.0;
        let icon_gap: f32 = 50.0;

        // Calculate corner radius
        let corner_radius = self.corner_radius.map(|r| r as f32 * 10.0);

        // Space between icon and text
        let actual_icon_gap = {
            let label_is_empty = self
                .label
                .as_ref()
                .map(|s| s.chars().count())
                .unwrap_or_default()
                .eq(&0);
            (self.icon.is_some() && !label_is_empty)
                .then_some(icon_gap)
                .unwrap_or_default()
        };

        // Calculate icon and text widths
        let icon_width = self.icon_width.unwrap_or(13) * 10;
        let actual_icon_width = self
            .icon
            .is_some()
            .then_some(icon_width)
            .unwrap_or_default();
        let label_text_width = self.label.as_ref().map(calculate_width).unwrap_or_default();
        let status_text_width = calculate_width(self.status.as_ref());
        let label_full_width = label_text_width + actual_icon_width as f32 + actual_icon_gap;

        // Calculate SVG background offsets and widths
        let label_rect_width = label_full_width + label_padding * 2.0;
        let status_rect_start = label_rect_width;
        let status_rect_width = status_text_width + status_padding * 2.0;

        // Calculate SVG text offsets and widths
        let icon_start = label_padding;
        let label_text_start = actual_icon_width as f32 + actual_icon_gap + label_padding;
        let label_text_shadow_start = label_text_start + text_shadow_offset;
        let status_text_start = label_rect_width + status_padding;
        let status_text_shadow_start = status_text_start + text_shadow_offset;

        // Calculate viewbox and scaled dimensions
        let badge_viewbox_width: f32 = label_rect_width + status_rect_width;
        let badge_viewbox_height: f32 = 200.0;
        let badge_scaled_width: f32 = self.scale * badge_viewbox_width / 10.0;
        let badge_scaled_height: f32 = self.scale * badge_viewbox_height / 10.0;

        // Evaluate badge parameters
        let color = self
            .color
            .as_ref()
            .and_then(|color| self.color_palette.resolve_color_string(color.as_ref()))
            .or_else(|| self.color.clone())
            .unwrap_or_else(|| self.color_palette.default_color().into());
        let label_color = self
            .label_color
            .as_ref()
            .and_then(|color| self.color_palette.resolve_color_string(color.as_ref()))
            .or_else(|| self.label_color.clone())
            .unwrap_or_else(|| self.color_palette.default_label_color().into());
        let label = self
            .label
            .as_ref()
            .map(|str| htmlize::escape_text(str.as_ref()))
            .unwrap_or_default();
        let status = htmlize::escape_text(self.status.as_ref());
        let accessible_text = self.accessible_text();

        // Build rounded corner mask
        let mask_svg = corner_radius.map(|corner_radius| {
            format!(r##"<defs><mask id="rounded"><rect rx="{corner_radius}" ry="{corner_radius}" width="{badge_viewbox_width}" height="{badge_viewbox_height}" fill="#fff" /></mask></defs>"##)
        }).unwrap_or_default();

        // Build icon xlink
        let xlink = self
            .icon
            .is_some()
            .then_some(r#" xmlns:xlink="http://www.w3.org/1999/xlink""#)
            .unwrap_or_default();

        // Build icon markup
        let icon_markup = self.icon.as_ref().map(|icon| {
            format!(r#"<image x="{icon_start}" y="35" width="{icon_width}" height="132" xlink:href="{icon}" />"#)
        }).unwrap_or_default();

        // Build final svg
        minify_svg(formatdoc!(
            r##"
            <svg width="{badge_scaled_width}" height="{badge_scaled_height}" viewBox="0 0 {badge_viewbox_width} {badge_viewbox_height}" xmlns="http://www.w3.org/2000/svg"{xlink} role="img">
            <title>{accessible_text}</title>
            {mask_svg}
            <g{mask_addon}>
            <rect fill="{label_color}" width="{label_rect_width}" height="{badge_viewbox_height}" />
            <rect fill="{color}" x="{status_rect_start}" width="{status_rect_width}" height="{badge_viewbox_height}" />
            </g>
            <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
            <text x="{label_text_shadow_start}" y="148" textLength="{label_text_width}" fill="#000" opacity="0.1">{label}</text>
            <text x="{label_text_start}" y="138" textLength="{label_text_width}">{label}</text>
            <text x="{status_text_shadow_start}" y="148" textLength="{status_text_width}" fill="#000" opacity="0.1">{status}</text>
            <text x="{status_text_start}" y="138" textLength="{status_text_width}">{status}</text>
            </g>
            {icon_markup}
            </svg>
            "##,
            mask_addon = corner_radius
                .is_some()
                .then_some(r##" mask="url(#rounded)""##)
                .unwrap_or_default(),
        ))
    }
}

#[cfg(test)]
mod tests {
    use std::borrow::Cow;

    use super::Badge;
    use crate::color_palettes;

    #[test]
    fn test_default_badge() {
        insta::assert_debug_snapshot!(Badge {
            color_palette: Cow::Borrowed(&color_palettes::DEFAULT),
            status: "foo".into(),
            label: Some("bar".into()),
            color: None,
            label_color: None,
            icon: None,
            icon_width: None,
            corner_radius: None,
            scale: 1.0,
        }
        .svg());
    }

    #[test]
    fn test_colored_badge() {
        insta::assert_debug_snapshot!(Badge {
            color_palette: Cow::Borrowed(&color_palettes::DEFAULT),
            status: "passing".into(),
            label: Some("checks".into()),
            color: Some("green".into()),
            label_color: Some("gray".into()),
            icon: None,
            icon_width: None,
            corner_radius: None,
            scale: 1.0,
        }
        .svg());
    }

    #[test]
    fn test_default_scaled_badge() {
        insta::assert_debug_snapshot!(Badge {
            color_palette: Cow::Borrowed(&color_palettes::DEFAULT),
            status: "foo".into(),
            label: Some("bar".into()),
            color: None,
            label_color: None,
            icon: None,
            icon_width: None,
            corner_radius: None,
            scale: 5.0,
        }
        .svg());
    }

    #[test]
    fn test_colored_scaled_badge() {
        insta::assert_debug_snapshot!(Badge {
            color_palette: Cow::Borrowed(&color_palettes::DEFAULT),
            status: "passing".into(),
            label: Some("checks".into()),
            color: Some("green".into()),
            label_color: Some("gray".into()),
            icon: None,
            icon_width: None,
            corner_radius: None,
            scale: 5.0,
        }
        .svg());
    }

    #[test]
    fn test_icon_badge() {
        insta::assert_debug_snapshot!(Badge {
            color_palette: Cow::Borrowed(&color_palettes::DEFAULT),
            status: "Quintschaf".into(),
            label: None,
            color: None,
            label_color: None,
            icon: Some("https://quintschaf.com/favicon.ico".into()),
            icon_width: None,
            corner_radius: None,
            scale: 1.0,
        }
        .svg());
    }

    #[test]
    fn test_rounded_badge() {
        insta::assert_debug_snapshot!(Badge {
            color_palette: Cow::Borrowed(&color_palettes::DEFAULT),
            status: "foo".into(),
            label: Some("bar".into()),
            color: None,
            label_color: None,
            icon: None,
            icon_width: None,
            corner_radius: Some(30),
            scale: 1.0,
        }
        .svg());
    }
}
