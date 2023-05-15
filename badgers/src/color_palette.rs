use std::borrow::Cow;

#[derive(Debug, Clone)]
pub struct ColorPalette {
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
    pub fn default_color(&self) -> &'static str {
        self.blue
    }

    pub fn default_label_color(&self) -> &'static str {
        self.black
    }

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
}

pub mod palettes {
    use super::ColorPalette;

    pub const BADGEN: ColorPalette = ColorPalette {
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
}
