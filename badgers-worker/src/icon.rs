use base64::Engine;
use worker::{Fetch, Request};

pub struct Icon<'a> {
    url: &'a str,
}

impl<'a> Icon<'a> {
    pub fn new(url: &'a impl AsRef<str>) -> Self {
        Self { url: url.as_ref() }
    }

    pub async fn fetch_as_data(&self) -> Option<String> {
        let req = Request::new(self.url, worker::Method::Get).ok()?;
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
