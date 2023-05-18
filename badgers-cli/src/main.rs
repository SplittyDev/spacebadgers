use std::{borrow::Cow, fs::File, io::Write, path::PathBuf};

use badgers::{color_palettes, BadgeBuilder};
use clap::Parser;

#[derive(Debug, Parser)]
#[command(author, version, about, long_about = None)]
struct App {
    #[clap(long = "label")]
    label: Option<String>,
    #[clap(long = "status")]
    status: Option<String>,
    #[clap(long = "theme", default_value = "badgen")]
    theme: String,
    #[clap(long = "color")]
    color: Option<String>,
    #[clap(long = "label-color")]
    label_color: Option<String>,
    #[clap(long = "scale", default_value = "1.0")]
    scale: f32,
    #[clap(long = "out")]
    output_file: Option<PathBuf>,
    #[clap(long = "icon")]
    icon: Option<String>,
    #[clap(long = "icon-width")]
    icon_width: Option<u32>,
}

fn main() {
    let app = App::parse();

    if app.label.is_none() && app.icon.is_none() {
        eprintln!("Either --label or --icon must be specified");
        std::process::exit(1);
    }

    let color_palette = match app.theme.as_ref() {
        "tailwind" => color_palettes::TAILWIND,
        _ => color_palettes::BADGEN,
    };

    let svg = BadgeBuilder::new()
        .label_option(app.label.map(Cow::Owned))
        .status_option(app.status.map(Cow::Owned))
        .color_palette(Cow::Owned(color_palette))
        .color_option(app.color.map(Cow::Owned))
        .label_color_option(app.label_color.map(Cow::Owned))
        .scale(app.scale)
        .icon_option(app.icon)
        .icon_width_option(app.icon_width)
        .build()
        .svg();

    if let Some(path) = app.output_file {
        let mut file = File::options()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&path)
            .expect("Unable to open output file");
        file.write_all(&svg.into_bytes())
            .expect("Unable to write to output file");
    } else {
        println!("{svg}");
    }
}
