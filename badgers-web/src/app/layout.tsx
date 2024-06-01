import { Inter } from "next/font/google";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

import Logo from "./logo.png";

import "./globals.css";
import Link from "next/link";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

const metadataBase = (() => {
    const proto = process.env.NEXT_PUBLIC_WEB_PROTO
    const host = process.env.NEXT_PUBLIC_WEB_HOST
    if (!proto || !host) {
        throw new Error("Missing environment variables: NEXT_PUBLIC_WEB_PROTO, NEXT_PUBLIC_WEB_HOST")
    }
    return new URL(`${proto}://${host}`)
})()

export const metadata: Metadata = {
  title: "SpaceBadgers",
  applicationName: "SpaceBadgers",
  description: "Fast and clean SVG badges",
  keywords: [
    "badge",
    "badges",
    "badgers",
    "spacebadgers",
    "badge-generator",
    "svg",
  ],
  authors: [{ name: "Marco Quinten", url: "https://github.com/splittydev" }],
  creator: "Marco Quinten",
  metadataBase,
}

export const viewport: Viewport = {
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full flex flex-col items-center`}>
        <div className="flex min-h-screen w-full xl:w-10/12 2xl:w-8/12 flex-col items-center py-4 md:p-16 gap-8">
          <header className="flex flex-col gap-4">
            <Link href="/" className="flex gap-4 select-none">
              <div className="max-w-[64px] max-h-[64px] rounded-full shadow-md">
                <Image
                  placeholder="blur"
                  priority
                  alt="badgers.space Logo"
                  src={Logo}
                  width={256}
                  height={256}
                />
              </div>
              <h1 className="text-6xl font-bold text-center">
                Badge
                <span className="text-orange-500">rs</span>
              </h1>
            </Link>
            <div className="flex flex-col items-center justify-center">
              Fast and clean SVG badges for your projects
            </div>
          </header>
          <div className="flex flex-col gap-8 w-full">
            {children}
            <footer className="flex flex-col gap-6 w-full">
              {/* Created by and link section */}
              <section className="flex flex-wrap justify-between gap-2 bg-gray-100 mx-4 px-4 py-2 rounded-md">
                <div className="text-sm">
                  <span className="text-gray-600">
                    Made with <span className="text-rose-500">♥</span> by{" "}
                    <a
                      target="_blank"
                      className="text-gray-500 hover:text-amber-600"
                      href="https://github.com/SplittyDev" rel="noreferrer"
                    >
                      Marco Quinten
                    </a>
                    .
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <a
                    target="_blank"
                    className="text-gray-500 hover:text-amber-600"
                    href="https://github.com/splittydev/spacebadgers" rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </section>

              {/* Informational Text */}
              <section className="flex flex-col gap-4 px-6 text-sm text-justify text-gray-700">
                <h2 className="text-md text-gray-600 font-bold">
                  About SpaceBadgers
                </h2>
                <p>
                  Hey there, welcome to SpaceBadgers! If you&#x27;re wondering
                  who we are and what we do, let us fill you in. We&#x27;re an
                  open-source project with a passion for delivering top-notch
                  SVG badges that are as speedy as they are stylish.
                </p>
                <p>
                  You see, we noticed that developers and project maintainers
                  like you needed a way to display key information &#x2013;
                  think build status, version, download counts &#x2013; in a way
                  that&#x27;s quick and easy to integrate. That&#x27;s where we
                  come in.
                </p>
                <p>
                  Under the hood, we&#x27;re powered by a Rust-based core
                  library{" "}
                  <a
                    className="text-xs text-gray-700 hover:text-orange-600"
                    href="https://crates.io/crates/spacebadgers"
                    target="_blank" rel="noreferrer"
                  >
                    (crates.io)
                  </a>{" "}
                  and a Cloudflare worker. This dynamic duo ensures that
                  we&#x27;re always delivering badges with excellent
                  performance, straight from the edge. And speaking of
                  integration, we&#x27;ve made it our mission to ensure smooth
                  sailing when it comes to working with third-party services,
                  courtesy of our NextJS-based API routes running on Vercel edge
                  infrastructure.
                </p>
                <p>
                  What makes us different? We&#x27;re glad you asked! Unlike
                  traditional image-based badges, we&#x27;re all about SVGs.
                  They&#x27;re scalable, high-quality, and we serve them in a
                  minified and compressed form for optimal delivery.
                </p>
                <p>
                  So that&#x27;s us, SpaceBadgers, in a nutshell. We&#x27;re
                  here to provide a seamless, efficient badge generation
                  process. If that sounds like your cup of tea, why not join the
                  open-source community using SpaceBadgers today? We&#x27;d be
                  thrilled to have you onboard!
                </p>
                <p>
                  For more information, take a look at our{" "}
                  <a
                    className="text-gray-700 hover:text-orange-600 underline underline-offset-2"
                    href="https://github.com/splittydev/spacebadgers"
                    target="_blank" rel="noreferrer"
                  >
                    GitHub
                  </a>
                  !
                </p>
              </section>
            </footer>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
