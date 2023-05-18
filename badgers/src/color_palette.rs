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
    pub fn from_name(name: &str) -> Cow<'static, ColorPalette> {
        palettes::ALL
            .iter()
            .find(|p| p.name == name)
            .map(|palette| Cow::Borrowed(*palette))
            .unwrap_or_else(|| {
                eprintln!("Warning: color palette '{}' not found, using default", name);
                Cow::Borrowed(&palettes::BADGEN)
            })
    }
}

pub mod palettes {
    use super::ColorPalette;

    /// All available color palettes.
    pub const ALL: &[&ColorPalette] = &[&BADGEN, &TAILWIND];

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
}
