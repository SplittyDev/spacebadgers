use indoc::formatdoc;
use std::borrow::Cow;

/// Badge color palette.
#[derive(Debug, Clone)]
pub struct ColorPalette {
    name: &'static str,
    default_label: &'static str,
    default_status: &'static str,
    black: &'static str,
    white: &'static str,
    gray: &'static str,
    red: &'static str,
    yellow: &'static str,
    orange: &'static str,
    green: &'static str,
    cyan: &'static str,
    blue: &'static str,
    pink: &'static str,
    purple: &'static str,
}

impl ColorPalette {
    /// Get the name of the color palette.
    pub fn name(&self) -> &'static str {
        self.name
    }

    /// Get the default status background color.
    pub fn default_color(&self) -> &'static str {
        self.default_status
    }

    /// Get the default label background color.
    pub fn default_label_color(&self) -> &'static str {
        self.default_label
    }

    /// Resolve a color string to a color value. Supports named colors and hex colors.
    pub fn resolve_color_string(&self, color: &str) -> Option<Cow<'static, str>> {
        match color {
            // Handle supported color names
            "black" => Some(self.black.into()),
            "white" => Some(self.white.into()),
            "gray" | "grey" => Some(self.gray.into()),
            "red" => Some(self.red.into()),
            "yellow" => Some(self.yellow.into()),
            "orange" => Some(self.orange.into()),
            "green" => Some(self.green.into()),
            "cyan" => Some(self.cyan.into()),
            "blue" => Some(self.blue.into()),
            "pink" => Some(self.pink.into()),
            "purple" => Some(self.purple.into()),
            // Handle supported hex colors
            c if c.chars().all(|c| c.is_ascii_hexdigit()) => Some(format!("#{c}").into()),
            // Handle unsupported color names
            _ => None,
        }
    }

    /// Get a [ColorPalette] by name.
    ///
    /// If the desired palette is not found, the default palette is returned.
    pub fn from_name(name: &str) -> &'static ColorPalette {
        palettes::ALL
            .iter()
            .find(|p| p.name == name)
            .unwrap_or_else(|| {
                eprintln!("Warning: color palette '{name}' not found, using default");
                &palettes::DEFAULT
            })
    }

    pub fn colors(&self) -> Vec<&'static str> {
        vec![
            self.black,
            self.default_label,
            self.gray,
            self.red,
            self.orange,
            self.yellow,
            self.green,
            self.cyan,
            self.blue,
            self.pink,
            self.purple,
        ]
    }

    pub fn svg(&self, rounded: bool, bordered: bool) -> String {
        let name = self.name;
        let colors = self.colors();
        let rect_width = 200;
        let rect_height = 200;
        let corner_radius = if rounded { 50 } else { 0 };
        let full_width = rect_width * colors.len();
        let mut segments = Vec::new();
        for (i, color) in colors.iter().enumerate() {
            let rect_offset = i * rect_width;
            let rect_svg = format!(
                r#"<rect x="{rect_offset}" y="0" width="{rect_width}" height="{rect_height}" fill="{color}" />"#,
            );
            segments.push(rect_svg);
        }
        let segments_svg = segments.join("");
        let viewbox = format!("0 0 {full_width} {rect_height}",);
        let output_width = full_width / 10;
        let output_height = rect_height / 10;
        let mask_svg = format!(
            r##"<defs><mask id="rounded"><rect rx="{corner_radius}" ry="{corner_radius}" width="{full_width}" height="{rect_height}" fill="#fff" /></mask></defs>"##,
        );
        let border_svg = format!(
            r##"<rect rx="{corner_radius}" ry="{corner_radius}" width="{full_width}" height="{rect_height}" fill="none" stroke="#666" stroke-width="10" stroke-linecap="round" />"##
        );
        formatdoc! {r##"
            <svg width="{output_width}" height="{output_height}" viewBox="{viewbox}" xmlns="http://www.w3.org/2000/svg" role="img">
            <title>{name}</title>{mask}
            <g{mask_addon}>
            {segments_svg}{border}
            </g>
            </svg>
            "##,
            mask = if rounded { mask_svg.as_ref() } else { "" },
            mask_addon = if rounded { r##" mask="url(#rounded)""## } else { "" },
            border = if bordered { border_svg.as_ref() } else { "" },
        }.trim().replace('\n', "")
    }
}

pub mod palettes {
    use super::ColorPalette;

    pub const DEFAULT: &ColorPalette = &HONEYPUNK;

    /// All available color palettes.
    pub const ALL: &[&ColorPalette] = &[&HONEYPUNK, &TAILWIND, &BADGEN];

    /// The same color palette used by [badgen.net](https://badgen.net).
    pub const BADGEN: ColorPalette = ColorPalette {
        name: "badgen",
        default_label: "#555",  // dark gray
        default_status: "#08c", // blue
        black: "#2a2a2a",
        white: "#fff",
        gray: "#999",
        red: "#e43",
        yellow: "#db1",
        orange: "#f73",
        green: "#3c1",
        cyan: "#1bc",
        blue: "#08c",
        pink: "#e5b",
        purple: "#94e",
    };

    /// A color palette based on [Tailwind CSS](https://tailwindcss.com) colors.
    pub const TAILWIND: ColorPalette = ColorPalette {
        name: "tailwind",
        default_label: "#334155",
        default_status: "#f97316",
        black: "#030712",
        white: "#f9fafb",
        gray: "#9ca3af",
        red: "#ef4444",
        yellow: "#eab308",
        orange: "#f97316",
        green: "#22c55e",
        cyan: "#06b6d4",
        blue: "#3b82f6",
        pink: "#ec4899",
        purple: "#a855f7",
    };

    /// Spacebadger's own hand-picked color palette.
    pub const HONEYPUNK: ColorPalette = ColorPalette {
        name: "honeypunk",
        default_label: "#4a414e",
        default_status: "#3373cc",
        black: "#030712",
        white: "#f9f6f7",
        gray: "#8f8494",
        red: "#dd3c4f",
        yellow: "#dfb920",
        orange: "#ee6f2b",
        green: "#1bbb40",
        cyan: "#12b4bf",
        blue: "#3373cc",
        pink: "#c39",
        purple: "#943ae9",
    };
}
