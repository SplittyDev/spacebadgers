# Spacebadgers
> Library for generating SVG badges. It powers [badgers.space](https://badgers.space).

## Examples
```rust
use spacebadgers::BadgeBuilder;

// Generate a badge with the default color palette
let badge_svg = BadgeBuilder::new()
    .label("release")
    .status("1.0")
    .build()
    .svg();

// Print the SVG code to stdout
println!("{}", badge_svg);
```
