use std::borrow::Cow;

use crate::{
    ColorPalette,
    util::{calculate_width, html_escape},
};

pub struct Badge {
    pub(crate) color_palette: Cow<'static, ColorPalette>,
    pub(crate) status: Cow<'static, str>,
    pub(crate) label: Option<Cow<'static, str>>,
    pub(crate) color: Option<Cow<'static, str>>,
    pub(crate) label_color: Option<Cow<'static, str>>,
    pub(crate) icon: Option<Cow<'static, str>>,
    pub(crate) icon_width: Option<u32>,
    pub(crate) scale: f32,
}

impl Badge {
    fn accessible_text(&self) -> String {
       let prefix = self.label.as_ref()
        .map(|label| format!("{label}: "))
        .unwrap_or_default();
       return format!("{prefix}{status}", status = self.status);
    }

    pub fn svg(&self) -> String {
        // Calculate badge sizes
        let icon_width = self.icon_width.unwrap_or(13) * 10;
        let icon_span_width = self.icon.as_ref().map(|_| {
            let label_not_empty = self.label.as_ref()
                .map(|label| label.chars().count())
                .unwrap_or(0) > 0;
            icon_width.saturating_add(if label_not_empty { 30 } else { 18 })
        }).unwrap_or(0) as f32;
        let sb_text_start = icon_span_width + 50.0;
        let sb_text_width = self.label.as_ref()
            .map(|label| calculate_width(label))
            .unwrap_or_default();
        let st_text_width = calculate_width(self.status.as_ref());
        let sb_rect_width = sb_text_width + 100f32 + icon_span_width;
        let st_rect_width = st_text_width + 100f32;
        let width = sb_rect_width + st_rect_width;

        // Evaluate badge parameters
        let color = self.color.as_ref()
            .and_then(|color| self.color_palette.resolve_color_string(color.as_ref()))
            .or_else(|| self.color.as_ref().map(|s| s.as_ref()))
            .unwrap_or_else(|| self.color_palette.default_color());
        let label_color = self.label_color.as_ref()
            .and_then(|color| self.color_palette.resolve_color_string(color.as_ref()))
            .or_else(|| self.label_color.as_ref().map(|s| s.as_ref()))
            .unwrap_or_else(|| self.color_palette.default_label_color());
        let label = self.label.as_ref().map(html_escape).unwrap_or_default();
        let status = html_escape(self.status.as_ref());
        let accessible_text = self.accessible_text();

        // Build additional svg
        let xlink = self.icon.is_some()
            .then(|| "xmlns:xlink=\"http://www.w3.org/1999/xlink\"")
            .unwrap_or_default();
        let icon_markup = self.icon.as_ref().map(|icon| {
            format!(r#"<image x="40" y="35" width="{icon_width}" height="132" xlink:href="{icon}" />"#)
        }).unwrap_or_default();

        // Build final svg
        return format!(
            r##"<svg
    width="{svg_width}"
    height="{svg_height}"
    viewBox="0 0 {width} 200"
    xmlns="http://www.w3.org/2000/svg" {xlink}
    role="img">
    <title>{accessible_text}</title>
    <g>
        <rect fill="{label_color}" width="{sb_rect_width}" height="200" />
        <rect fill="{color}" x="{sb_rect_width}" width="{st_rect_width}" height="200" />
    </g>
    <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
        <text x="{sb_text_start_2}" y="148" textLength="{sb_text_width}" fill="#000" opacity="0.1">{label}</text>
        <text x="{sb_text_start}" y="138" textLength="{sb_text_width}">{label}</text>
        <text x="{sb_rect_width_2}" y="148" textLength="{st_text_width}" fill="#000" opacity="0.1">{status}</text>
        <text x="{sb_rect_width_3}" y="138" textLength="{st_text_width}">{status}</text>
    </g>{icon_markup}
</svg>"##,
            svg_width = self.scale * width / 10.0,
            svg_height = self.scale * 20.0,
            sb_text_start_2 = sb_text_start + 10.0,
            sb_rect_width_2 = sb_rect_width + 55.0,
            sb_rect_width_3 = sb_rect_width + 45.0,
        );
    }
}
