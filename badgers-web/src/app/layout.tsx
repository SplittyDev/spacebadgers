import Badge from './Badge'
import './globals.css'
import { Inter } from 'next/font/google'

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
        <div className="flex min-h-screen flex-col items-center p-16 gap-8">
            <header>
                <h1 className="text-6xl font-bold text-center">
                    Badge
                    <span className="text-orange-500">rs</span>
                </h1>
                <div className="flex flex-col items-center justify-center">
                    Fast and clean SVG badges for your projects
                </div>
            </header>
            {children}
        </div>
    </body>
    </html>
  )
}
