use std::{borrow::Cow, fs::File, io::Write, path::PathBuf};

use clap::{CommandFactory, Parser, Subcommand};
use spacebadgers::{color_palettes, BadgeBuilder, ColorPalette};

#[derive(Debug, Subcommand)]
enum Command {
    #[clap(name = "badge", about = "Generate a badge")]
    Generate {
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
        #[clap(long = "corner-radius")]
        corner_radius: Option<u32>,
    },
}

#[derive(Debug, Parser)]
#[command(author, version, about, long_about = None)]
struct App {
    #[clap(subcommand)]
    command: Command,
}

fn main() {
    let app = App::parse();

    match app.command {
        Command::Generate {
            label,
            status,
            theme,
            color,
            label_color,
            scale,
            output_file,
            icon,
            icon_width,
            corner_radius,
        } => {
            // Validate that either label or icon is specified
            if label.is_none() && icon.is_none() {
                println!("{}", App::command().render_long_help());
                eprintln!("Either --label or --icon must be specified.");
                std::process::exit(1);
            }

            // Get the color palette
            let Some(color_palette) = ColorPalette::from_name(&theme) else {
                let themes = color_palettes::ALL
                    .iter()
                    .map(|p| p.name())
                    .collect::<Vec<_>>()
                    .join(", ");
                println!("{}", App::command().render_long_help());
                eprintln!("Invalid theme: {}", theme);
                eprintln!("Supported themes: {themes}");
                std::process::exit(1);
            };

            // Build the badge
            let svg = BadgeBuilder::new()
                .optional_label(label.map(Cow::Owned))
                .optional_status(status.map(Cow::Owned))
                .color_palette(Cow::Borrowed(color_palette))
                .optional_color(color.map(Cow::Owned))
                .optional_label_color(label_color.map(Cow::Owned))
                .optional_icon(icon)
                .optional_icon_width(icon_width)
                .optional_corner_radius(corner_radius)
                .scale(scale)
                .build()
                .svg();

            if let Some(path) = output_file {
                let mut file = File::options()
                    .write(true)
                    .create(true)
                    .truncate(true)
                    .open(path)
                    .expect("Unable to open output file");
                file.write_all(&svg.into_bytes())
                    .expect("Unable to write to output file");
            } else {
                println!("{svg}");
            }
        }
    }
}
