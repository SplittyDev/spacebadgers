use once_cell::sync::Lazy;
use regex::Regex;

static REGEX_MATCH_NEWLINE: Lazy<Regex> = Lazy::new(|| Regex::new(r"\r?\n").unwrap());
static REGEX_MATCH_COMMENTS: Lazy<Regex> = Lazy::new(|| Regex::new(r"(?s)<!--.*?-->").unwrap());
static REGEX_MATCH_BETWEEN_TAGS: Lazy<Regex> = Lazy::new(|| Regex::new(r"(>)(\s+)(<)").unwrap());
static REGEX_MATCH_TAG_END: Lazy<Regex> = Lazy::new(|| Regex::new(r"(\s+)(/?>)").unwrap());
static REGEX_MATCH_START_END_WHITESPACE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"(?m)^\s+|\s+$").unwrap());

pub fn minify_svg(str: impl AsRef<str>) -> String {
    let str = str.as_ref();
    let str = REGEX_MATCH_START_END_WHITESPACE.replace_all(str, "");
    let str = REGEX_MATCH_NEWLINE.replace_all(&str, " ");
    let str = REGEX_MATCH_COMMENTS.replace_all(&str, "");
    let str = REGEX_MATCH_BETWEEN_TAGS.replace_all(&str, "$1$3");
    let str = REGEX_MATCH_TAG_END.replace_all(&str, "$2");
    str.trim().to_string()
}

#[cfg(test)]
mod tests {
    use super::minify_svg;

    /// Test minification of an SVG icon.
    #[test]
    fn test_minify_svg_icon() {
        let svg = r#"
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <!-- Some comment -->
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        "#;
        let minified = minify_svg(svg);
        assert_eq!(
            minified,
            r#"<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>"#
        );
    }

    /// Test minification of an SVG badge.
    #[test]
    fn test_minify_svg_badge() {
        let svg = r##"
        <svg width="55.5" height="20" viewBox="0 0 555 200" xmlns="http://www.w3.org/2000/svg" role="img">
            <title>foo: bar</title>
            <g>
                <rect fill="#4a414e" width="273" height="200"/>
                <rect fill="#1bbb40" x="273" width="282" height="200"/>
            </g>
            <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
                <text x="60" y="148" textLength="173" fill="#000" opacity="0.1">foo</text>
                <text x="50" y="138" textLength="173">foo</text>
                <text x="333" y="148" textLength="182" fill="#000" opacity="0.1">bar</text>
                <text x="323" y="138" textLength="182">bar</text>
            </g>
        </svg>
        "##;
        let minified = minify_svg(svg);
        assert_eq!(
            minified,
            r##"<svg width="55.5" height="20" viewBox="0 0 555 200" xmlns="http://www.w3.org/2000/svg" role="img"><title>foo: bar</title><g><rect fill="#4a414e" width="273" height="200"/><rect fill="#1bbb40" x="273" width="282" height="200"/></g><g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110"><text x="60" y="148" textLength="173" fill="#000" opacity="0.1">foo</text><text x="50" y="138" textLength="173">foo</text><text x="333" y="148" textLength="182" fill="#000" opacity="0.1">bar</text><text x="323" y="138" textLength="182">bar</text></g></svg>"##
        )
    }

    /// Test minification of an SVG badge with extra whitespace.
    /// The whitespace around the text should be preserved.
    #[test]
    fn test_minify_svg_badge_2() {
        let svg = r##"
        <svg width="55.5" height="20" viewBox="0 0 555 200" xmlns="http://www.w3.org/2000/svg" role="img">
            <title> foo :  bar </title>
            <g>
                <rect fill="#4a414e" width="273" height="200"/>
                <rect fill="#1bbb40" x="273" width="282" height="200"/>
            </g>
            <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
                <text x="60" y="148" textLength="173" fill="#000" opacity="0.1"> foo </text>
                <text x="50" y="138" textLength="173"> foo </text>
                <text x="333" y="148" textLength="182" fill="#000" opacity="0.1"> bar </text>
                <text x="323" y="138" textLength="182"> bar </text>
            </g>
        </svg>
        "##;
        let minified = minify_svg(svg);
        assert_eq!(
            minified,
            r##"<svg width="55.5" height="20" viewBox="0 0 555 200" xmlns="http://www.w3.org/2000/svg" role="img"><title> foo :  bar </title><g><rect fill="#4a414e" width="273" height="200"/><rect fill="#1bbb40" x="273" width="282" height="200"/></g><g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110"><text x="60" y="148" textLength="173" fill="#000" opacity="0.1"> foo </text><text x="50" y="138" textLength="173"> foo </text><text x="333" y="148" textLength="182" fill="#000" opacity="0.1"> bar </text><text x="323" y="138" textLength="182"> bar </text></g></svg>"##
        )
    }
}
