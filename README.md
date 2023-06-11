<p align="center">
    <img alt="badgers.space Logo" src="./badgers-web/src/app/logo.png" width="128" height="128" />
</p>

# SpaceBadgers - Fast SVG Badges

[![](https://badgers.space/badge/live%20instance/badgers.space)](https://badgers.space)
[![](https://badgers.space/github/license/splittydev/spacebadgers)](./LICENSE)
[![](https://badgers.space/badge/crates.io/spacebadgers)](https://crates.io/crates/spacebadgers)
[![](https://badgers.space/github/checks/splittydev/spacebadgers)](https://github.com/splittydev/spacebadgers/actions)

> Yes, badgers is an ingenious name. It contains the word badge, is similar to [badgen](https://badgen.net) (a popular badge generation service), includes the `-rs` suffix 🦀 and it's an actual word! Badgers are awesome animals. And they're also the mascot of the [University of Wisconsin-Madison](https://en.wikipedia.org/wiki/Wisconsin_Badgers). I don't know why I'm telling you this, I don't even live in the US. But hey, the more you know.

[Live instance at badgers.space](https://badgers.space)

## Project Structure

- `badgers`: Core spacebadgers library
- `badgers-utils`: Internal utilities for spacebadgers
- `badgers-cli`: CLI for generating SVG badges
- `badgers-worker`: Cloudflare worker
- `badgers-web`: Web frontend for [badgers.space](https://badgers.space)

## Service Integrations

- GitHub
- crates.io
- npm
- PyPI

<small>More integrations coming soon!</small>

## Why SpaceBadgers?

The creation of SpaceBadgers was spurred by my experiences and challenges with existing badge generators such as shields.io and badgen.net. These platforms offer excellent services, but I found certain issues that could be improved upon. Here's why I decided to build SpaceBadgers:

**1. Performance:** Acknowledging past speed concerns with platforms like Shields.io, SpaceBadgers emphasizes high performance and reliability. Our Rust-based core library and Cloudflare worker enable swift, edge-based badge delivery. Smooth integration with third-party services is achieved via NextJS API routes on Vercel, and we continually aim to enhance speed by utilizing the `edge` runtime.

**2. Stability:** Badgen.net was created as a faster alternative to shields.io, but due to its lack of active maintenance, it often breaks, leading to broken images. SpaceBadgers is actively maintained and is committed to ensuring stability and uptime.

**3. SVG Exclusivity:** In contrast to Shields.io, which produces images, SpaceBadgers dedicates itself solely to the generation of SVGs. Recognizing the scalability and high-quality visuals of SVGs, we deemed them the ideal choice. To optimize performance, we serve SVGs in a minified form, ensuring a swift and efficient delivery of badges.

Building SpaceBadgers has been a labor of love, aiming to offer a superior, reliable, and open-source SVG badge generator for the developer community. I am excited to hear your feedback and to continue evolving this project with your help. Your suggestions, contributions, and active participation are always welcome.

## Development

Clone the repository and make sure to initialize the submodules

```bash
git submodule update --init --recursive
```

### Environment Variables
> Paste this template into `badgers-web/.env.local` for local development

```py
# Frontend Configuration
NEXT_PUBLIC_API_PROTO = "http"          # Worker protocol
NEXT_PUBLIC_API_HOST = "127.0.0.1:8787" # Worker host
NEXT_PUBLIC_WEB_PROTO = "http"          # Web frontend protocol
NEXT_PUBLIC_WEB_HOST = "127.0.0.1:3000" # Web frontend host

# API Tokens
GITHUB_TOKEN = "ghp_Foo1234567"         # Required for GitHub badges (private token)
GITLAB_TOKEN = "glfoo-zKvC1234"         # Required for GitLab badges (private token)
CRATESIO_TOKEN = "cio51fdR1234567"      # Required for crates.io badges
```

### spacebadgers
<details>
<summary>Click to expand</summary>

#### Prerequisites

- cargo

#### Running tests

```bash
cargo test -p spacebadgers
```

</details>

### badgers-worker

<details>
<summary>Click to expand</summary>

#### Prerequisites

- cargo
- yarn (preferred) or npm

#### Installing dependencies

```bash
cd badgers-worker
npm install         # If you're using npm
yarn                # If you're using yarn
```

#### Running locally

```bash
cd badgers-worker
npm run dev         # If you're using npm
yarn dev            # If you're using yarn
```

#### Deploying to Cloudflare

```bash
cd badgers-worker
npm run deploy      # If you're using npm
yarn deploy         # If you're using yarn
```

</details>

### badgers-web

<details>
<summary>Click to expand</summary>

#### Prerequisites

- yarn (preferred) or npm

#### Installing dependencies

```bash
cd badgers-web
npm install         # If you're using npm
yarn                # If you're using yarn
```

#### Running locally

```bash
cd badgers-web
npm run dev         # If you're using npm
yarn dev            # If you're using yarn
```

</details>

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rossmacarthur"><img src="https://avatars.githubusercontent.com/u/17109887?v=4?s=100" width="100px;" alt="Ross MacArthur"/><br /><sub><b>Ross MacArthur</b></sub></a><br /><a href="#code-rossmacarthur" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
