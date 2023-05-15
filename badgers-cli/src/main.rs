use badgers::{Badge, BadgeBuilder};

fn main() {
    let svg = BadgeBuilder::new()
        .label("CI")
        .status("Passing")
        .build()
        .svg();
    println!("{svg}");
}
