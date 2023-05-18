use std::borrow::Cow;

use crate::{Badge, ColorPalette};

/// [Badge] builder.
pub struct BadgeBuilder {
    color_palette: Cow<'static, ColorPalette>,
    status: Option<Cow<'static, str>>,
    label: Option<Cow<'static, str>>,
    color: Option<Cow<'static, str>>,
    label_color: Option<Cow<'static, str>>,
    icon: Option<Cow<'static, str>>,
    icon_width: Option<u32>,
    scale: f32,
}

impl BadgeBuilder {
    /// Construct a new [BadgeBuilder] with default values.
    pub fn new() -> Self {
        let color_palette = Cow::Borrowed(&crate::color_palettes::BADGEN);
        let scale = 1.0;
        Self {
            color_palette,
            status: None,
            label: None,
            color: None,
            label_color: None,
            icon: None,
            icon_width: None,
            scale,
        }
    }

    /// Set the [ColorPalette].
    pub fn color_palette(mut self, color_palette: impl Into<Cow<'static, ColorPalette>>) -> Self {
        self.color_palette = color_palette.into();
        self
    }

    /// Set the label text.
    pub fn label(mut self, label: impl Into<Cow<'static, str>>) -> Self {
        self.label = Some(label.into());
        self
    }

    /// Set an optional label text.
    pub fn label_option(mut self, label: Option<impl Into<Cow<'static, str>>>) -> Self {
        self.label = label.map(Into::into);
        self
    }

    /// Set the status text.
    pub fn status(mut self, status: impl Into<Cow<'static, str>>) -> Self {
        self.status = Some(status.into());
        self
    }

    /// Set an optional status text.
    pub fn status_option(mut self, status: Option<impl Into<Cow<'static, str>>>) -> Self {
        self.status = status.map(Into::into);
        self
    }

    /// Set the color.
    pub fn color(mut self, color: impl Into<Cow<'static, str>>) -> Self {
        self.color = Some(color.into());
        self
    }

    /// Set an optional color.
    pub fn color_option(mut self, color: Option<impl Into<Cow<'static, str>>>) -> Self {
        self.color = color.map(Into::into);
        self
    }

    /// Set the label color.
    pub fn label_color(mut self, label_color: impl Into<Cow<'static, str>>) -> Self {
        self.label_color = Some(label_color.into());
        self
    }

    /// Set an optional label color.
    pub fn label_color_option(mut self, label_color: Option<impl Into<Cow<'static, str>>>) -> Self {
        self.label_color = label_color.map(Into::into);
        self
    }

    /// Set the badge scale.
    pub fn scale(mut self, scale: f32) -> Self {
        self.scale = scale;
        self
    }

    /// Set the icon.
    pub fn icon(mut self, icon: impl Into<Cow<'static, str>>) -> Self {
        self.icon = Some(icon.into());
        self
    }

    /// Set an optional icon.
    pub fn icon_option(mut self, icon: Option<impl Into<Cow<'static, str>>>) -> Self {
        self.icon = icon.map(Into::into);
        self
    }

    /// Set the icon width.
    pub fn icon_width(mut self, icon_width: u32) -> Self {
        self.icon_width = Some(icon_width);
        self
    }

    /// Set an optional icon width.
    pub fn icon_width_option(mut self, icon_width: Option<u32>) -> Self {
        self.icon_width = icon_width;
        self
    }

    /// Build the [Badge].
    pub fn build(self) -> Badge {
        Badge {
            color_palette: self.color_palette,
            status: self.status.unwrap_or_default(),
            label: self.label,
            color: self.color,
            label_color: self.label_color,
            icon: self.icon,
            icon_width: self.icon_width,
            scale: self.scale,
        }
    }
}
