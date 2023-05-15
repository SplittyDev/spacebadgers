use crate::width::VERDANA_110;

pub fn calculate_width(text: impl AsRef<str>) -> f32 {
    let text = text.as_ref();
    let fallback_width = VERDANA_110[64];
    text.chars().fold(0f32, |acc, c| {
        acc + VERDANA_110.get(c as usize).unwrap_or(&fallback_width)
    })
}
