import Image from 'next/image'

import { Badge, Section, ThemeStrip } from '@/components'
import { BadgeEndpointRow as Row } from '@/components'

const ApiParams = [
    ['color', 'Override default color (named color or hex)'],
    ['label_color', 'Override label color (named color or hex)'],
    ['label', 'Override label text'],
    ['scale', 'Override badge size (default: 1)'],
    ['theme', 'Specify color theme (default: badgen)'],
]

export default function Home() {
  return (
    <main className="flex flex-col gap-8 px-4">

        {/* API URL */}
        <div className="flex flex-wrap justify-center bg-gray-100 p-4 rounded-md font-mono text-sm text-center">
            <span className="text-gray-400">{process.env.NEXT_PUBLIC_WEB_PROTO}://</span>
            <span className="text-gray-700">{process.env.NEXT_PUBLIC_WEB_HOST}</span>
            <span className="text-gray-400">/</span>
            <span>badge</span>
            <span className="text-gray-400">/</span>
            <span className="text-green-600">:label</span>
            <span className="text-gray-400">/</span>
            <span className="text-emerald-600">:status</span>
            <span className="text-gray-400">/</span>
            <span className="text-teal-600">:color</span>
        </div>

        {/* Named Colors */}
        <div className="flex flex-col gap-4 items-center">
            <h2 className="text-xl text-gray-700 font-bold">Supported Colors</h2>
            <div className="flex flex-col gap-1 items-center md:flex-row">
                <div className="flex gap-1">
                    <Badge label="color" status="blue" color="blue" />
                    <Badge label="color" status="cyan" color="cyan" />
                    <Badge label="color" status="green" color="green" />
                    <Badge label="color" status="yellow" color="yellow" />
                    <Badge label="color" status="orange" color="orange" />
                </div>
                <div className="flex gap-1">
                    <Badge label="color" status="red" color="red" />
                    <Badge label="color" status="pink" color="pink" />
                    <Badge label="color" status="purple" color="purple" />
                    <Badge label="color" status="gray" color="gray" />
                    <Badge label="color" status="black" color="black" />
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

            {/* Query Parameters */}
            <div className="flex flex-col gap-4 flex-grow">
                <h2 className="text-xl text-gray-700 font-bold">Query Parameters</h2>
                <ul className="list-disc flex flex-col gap-2">
                    {ApiParams.map(([name, description]) => (
                        <li key={name} className="flex flex-wrap gap-2 items-center">
                            <span className="bg-gray-100 rounded-sm text-gray-800 px-2 py-1 font-mono text-sm">
                                {name}
                            </span>
                            <span>{description}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Themes */}
            <div className="flex flex-col gap-4 flex-grow">
                <h2 className="text-xl text-gray-700 font-bold">Themes</h2>
                <ThemeStrip themes={[
                    {
                        name: 'badgen',
                        palette: [
                            { name: 'black', color: '#2a2a2a' },
                            { name: 'default_label', color: '#555' },
                            { name: 'gray', color: '#999' },
                            { name: 'red', color: '#e43' },
                            { name: 'yellow', color: '#db1' },
                            { name: 'orange', color: '#f73' },
                            { name: 'green', color: '#3c1' },
                            { name: 'cyan', color: '#1bc' },
                            { name: 'blue', color: '#08c' },
                            { name: 'pink', color: '#e5b' },
                            { name: 'purple', color: '#94e' },
                        ]
                    },
                    {
                        name: 'tailwind',
                        palette: [
                            { name: 'black', color: '#030712' },
                            { name: 'default_label', color: '#334155' },
                            { name: 'gray', color: '#9ca3af' },
                            { name: 'red', color: '#ef4444' },
                            { name: 'yellow', color: '#eab308' },
                            { name: 'orange', color: '#f97316' },
                            { name: 'green', color: '#22c55e' },
                            { name: 'cyan', color: '#06b6d4' },
                            { name: 'blue', color: '#3b82f6' },
                            { name: 'pink', color: '#ec4899' },
                            { name: 'purple', color: '#a855f7' },
                        ]
                    },
                    // {
                    //     name: 'monokai',
                    //     palette: [
                    //         { name: 'black', color: '#272822' },
                    //         { name: 'default_label', color: '#595b4d' },
                    //         { name: 'gray', color: '#9ea191' },
                    //         { name: 'red', color: '#ff616e' },
                    //         { name: 'yellow', color: '#e5b567' },
                    //         { name: 'orange', color: '#f73' },
                    //         { name: 'green', color: '#b4d273' },
                    //         { name: 'cyan', color: '#78dce8' },
                    //         { name: 'blue', color: '#6c99e9' },
                    //         { name: 'pink', color: '#f25fa6' },
                    //         { name: 'purple', color: '#745af6' },
                    //     ]
                    // },
                ]} />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <h2 className="text-xl text-gray-700 font-bold">Service Integrations</h2>
            <Section name="GitHub">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-8">
                    <Row name="Latest release" path="/github/release/:owner/:repo" inject={['quintschaf', 'schafkit']} />
                    <Row name="Issues" path="/github/issues/:owner/:repo" inject={['quintschaf', 'schafkit']} />
                    <Row name="Open issues" path="/github/open-issues/:owner/:repo" inject={['quintschaf', 'schafkit']} />
                    <Row name="Closed issues" path="/github/closed-issues/:owner/:repo" inject={['quintschaf', 'schafkit']} />
                </div>
            </Section>
        </div>
    </main>
  )
}
