<p align="center">
    <img alt="badgers.space Logo" src="./badgers-web/src/app/logo.png" width="256" height="256" />
</p>

# Badgers - Fast SVG Badges

[![](https://badgers.space/badge/live%20instance/badgers.space)](https://badgers.space)
[![](https://badgers.space/github/license/splittydev/badgers)](./LICENSE)
[![](https://badgers.space/badge/crates.io/spacebadgers)](https://crates.io/crates/spacebadgers)
![](https://badgers.space/github/checks/splittydev/badgers)

> Yes, badgers is an ingenious name. It contains the word badge, is similar to [badgen](https://badgen.net) (a popular badge generation service), includes the `-rs` suffix 🦀 and it's an actual word! Badgers are awesome animals. And they're also the mascot of the [University of Wisconsin-Madison](https://en.wikipedia.org/wiki/Wisconsin_Badgers). I don't know why I'm telling you this, I don't even live in the US. But hey, the more you know.

[Live instance at badgers.space](https://badgers.space)

## Project Structure

- `badgers`: Core badgers library
- `badgers-cli`: CLI for generating SVG badges
- `badgers-worker`: Cloudflare worker
- `badgers-web`: Web frontend for [badgers.space](https://badgers.space)

## Development

### Environment Variables
> Paste this template into `badgers-web/.env.local`

```py
NEXT_PUBLIC_API_PROTO = "http"          # Worker protocol
NEXT_PUBLIC_API_HOST = "127.0.0.1:8787" # Worker host
NEXT_PUBLIC_WEB_PROTO = "http"          # Web frontend protocol
NEXT_PUBLIC_WEB_HOST = "127.0.0.1:3000" # Web frontend host
GITHUB_TOKEN = "ghp_Foo1234567"         # Required for GitHub badges
```

### badgers
> Requires: cargo

#### Running tests

```bash
cargo test -p badgers
```

### badgers-worker
> Requires: cargo, npm/yarn

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

### badgers-web
> Requires: npm/yarn

#### Installing dependencies

```bash
cd badgers-web
npm install         # If you're using npm
yarn                # If you're using yarn
```

#### Running locally

```bash
cd badgers-web
npm run dev     # If you're using npm
yarn dev        # If you're using yarn
```

## Why

Over the years, I've used quite a few badge generator services. First shields.io, which became slower and less reliable over time. Then badgen.net, which was fast and reliable at first, but became similarly disfunctional and doesn't seem to be maintained anymore.

Badgers is my attempt at creating a fast, reliable, and easy to use badge generator. It's written in Rust, and uses Cloudflare Workers to serve the badges. On my machine, badge generation takes ~1ms. Cloudflare reports a median CPU time of 2.4ms.

Even though there is an "official" live instance for everyone to use, I encourage you to host your own instance. It's super easy, and you can customize it to your needs.

For now, all that's supported is simple badges, without third-party data sources.

Feel free to contribute!
