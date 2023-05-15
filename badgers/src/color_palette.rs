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

    pub fn resolve_color_string(&self, color: &str) -> Option<&'static str> {
        match color {
            "black" => Some(self.black),
            "white" => Some(self.white),
            "gray" | "grey" => Some(self.gray),
            "red" => Some(self.red),
            "yellow" => Some(self.yellow),
            "orange" => Some(self.orange),
            "green" => Some(self.green),
            "cyan" => Some(self.cyan),
            "blue" => Some(self.blue),
            "pink" => Some(self.pink),
            "purple" => Some(self.purple),
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
