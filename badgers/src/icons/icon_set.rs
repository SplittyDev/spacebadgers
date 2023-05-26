use phf::Map;

pub struct IconSet {
    pub name: &'static str,
    pub icons: Map<&'static str, &'static str>,
}

impl IconSet {
    pub fn get(&self, name: &str) -> Option<&'static str> {
        self.icons.get(name).copied()
    }
}
