import Image from 'next/image'
import Badge from './Badge'
import ThemeStrip from './ThemeStrip'

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
            <span className="text-gray-400">https://</span>
            <span className="text-gray-700">honey.badgers.space</span>
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
                            { name: 'default_label', color: '#555' },
                            { name: 'black', color: '#2a2a2a' },
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
                    }
                ]} />
            </div>
        </div>
    </main>
  )
}
