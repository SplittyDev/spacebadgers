import { Inter } from 'next/font/google'
import Image from 'next/image'
import { Analytics } from '@vercel/analytics/react'

import Logo from './logo.png'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Badgers',
  description: 'Fast SVG badges',
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
                            <Image placeholder='blur' priority unoptimized alt="badgers.space Logo" src={Logo} width={256} height={256} />
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
                {children}
            </div>
            <Analytics />
        </body>
    </html>
  )
}
