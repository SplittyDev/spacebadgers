//! SpaceBadgers is a library for generating SVG badges. It powers [badgers.space](https://badgers.space).
//!
//! # Examples
//! ```rust
//! use spacebadgers::BadgeBuilder;
//!
//! // Generate a badge with the default color palette
//! let badge_svg = BadgeBuilder::new()
//!     .label("release")
//!     .status("1.0")
//!     .build()
//!     .svg();
//!
//! // Print the SVG code to stdout
//! println!("{}", badge_svg);
//! ```

mod badge;
mod badge_builder;
mod color_palette;
pub mod icons;
pub mod minify;
mod util;
mod width;

pub use badge::Badge;
pub use badge_builder::BadgeBuilder;
pub use color_palette::ColorPalette;

pub mod color_palettes {
    //! A collection of color palettes.

    // Reexport all color palettes
    pub use crate::color_palette::palettes::*;
}
