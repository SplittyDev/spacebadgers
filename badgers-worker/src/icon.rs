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

    pub async fn get_data(&self) -> Option<String> {
        match self.value {
            // Handle URLs
            v if v.starts_with("http") => self.fetch_as_data().await,

            // Handle data URIs
            v if v.starts_with("data:") => Some(v.to_string()),

            // Handle named icons
            v => spacebadgers::icons::ALL_ICON_SETS
                .iter()
                .find_map(|icon_set| {
                    icon_set.get(v).map(|svg| {
                        let engine = base64::engine::general_purpose::STANDARD;
                        let data = engine.encode(svg);
                        format!("data:image/svg+xml;base64,{data}")
                    })
                }),
        }
    }

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
