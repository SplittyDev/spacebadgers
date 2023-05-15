mod width;
mod badge;
mod badge_builder;
mod color_palette;
mod util;

pub use badge::Badge;
pub use badge_builder::BadgeBuilder;
pub use color_palette::ColorPalette;

pub mod color_palettes {
    pub use crate::color_palette::palettes::*;
}
