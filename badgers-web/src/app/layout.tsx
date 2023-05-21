import { Inter } from 'next/font/google'
import Image from 'next/image'
import { Analytics } from '@vercel/analytics/react'

import Logo from './logo.png'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SpaceBadgers',
  applicationName: 'SpaceBadgers',
  description: 'Fast and clean SVG badges',
  keywords: ['badge', 'badges', 'badgers', 'spacebadgers', 'badge-generator', 'svg',],
  colorScheme: 'light',
  authors: [{ name: 'Marco Quinten', url: 'https://github.com/splittydev' }],
  creator: 'Marco Quinten',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={inter.className}>
            <div className="flex min-h-screen flex-col items-center py-4 md:p-16 gap-8">
                <header className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="max-w-[64px] max-h-[64px] rounded-full shadow-md">
                            <Image placeholder='blur' priority alt="badgers.space Logo" src={Logo} width={256} height={256} />
                        </div>
                        <h1 className="text-6xl font-bold text-center">
                            Badge
                            <span className="text-orange-500">rs</span>
                        </h1>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        Fast and clean SVG badges for your projects
                    </div>
                </header>
                <div className="flex flex-col gap-8">
                    {children}
                    <footer className="flex flex-wrap justify-between gap-2 bg-gray-100 mx-4 px-4 py-2 rounded-md">
                        <div className="text-sm">
                            <span className="text-gray-600">
                                Made with <span className="text-rose-500">♥</span> by <a target="_blank" className="text-gray-500 hover:text-amber-600" href="https://github.com/SplittyDev">Marco Quinten</a>.
                            </span>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <a target="_blank" className="text-gray-500 hover:text-amber-600" href="https://github.com/splittydev/badgers">GitHub</a>
                        </div>
                    </footer>
                </div>
            </div>
            <Analytics />
        </body>
    </html>
  )
}
