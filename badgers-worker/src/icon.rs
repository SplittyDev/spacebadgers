use base64::Engine;
use worker::{Fetch, Request};

pub struct Icon<'a> {
    value: &'a str,
}

impl<'a> Icon<'a> {
    pub fn new(value: &'a impl AsRef<str>) -> Self {
        Self {
            value: value.as_ref(),
        }
    }

    /// Turn the icon into a data URI.
    ///
    /// **Note on URL handling**
    ///
    /// In the case of external URLs, the icon will be downloaded first, and then
    /// converted to a data URI. This will introduce additional latency,
    /// so it's not generally recommended.
    pub async fn get_data(&self) -> Option<String> {
        match self.value {
            // Handle URLs
            v if v.starts_with("http:") || v.starts_with("https:") => self.fetch_as_data().await,

            // Handle data URIs
            v if v.starts_with("data:") => Some(v.to_string()),

            // Handle everything else
            v => {
                // Try to find the icon in the built-in set of named icons
                let named_icon = spacebadgers::icons::get_icon_svg(v).map(|svg| {
                    let engine = base64::engine::general_purpose::STANDARD;
                    let data = engine.encode(svg);
                    format!("data:image/svg+xml;base64,{data}")
                });

                // Otherwise, try to download the icon.
                // The `value` might be a website without the protocol prefix.
                if named_icon.is_none() {
                    return self.fetch_as_data().await;
                }

                named_icon
            }
        }
    }

    /// Download the icon using a `Fetch` request, and convert it to a data URI.
    async fn fetch_as_data(&self) -> Option<String> {
        let req = Request::new(self.value, worker::Method::Get).ok()?;
        let mut res = Fetch::Request(req).send().await.ok()?;
        let mime_type = res
            .headers()
            .get("Content-Type")
            .ok()?
            .filter(|v| v.starts_with("image"))?;
        let raw_data = res.bytes().await.ok()?;
        let engine = base64::engine::general_purpose::STANDARD;
        let data = engine.encode(raw_data);
        Some(format!("data:{mime_type};base64,{data}"))
    }
}
