import { StaticBadge, Section, ThemeStrip } from '@/components'
import { BadgeEndpointRow as Row } from '@/components'

const ApiParams = [
    {
        name: 'color',
        description: 'Override status color',
        extra: ['named color', 'hex'],
    },
    {
        name: 'label_color',
        description: 'Override label color',
        extra: ['named color', 'hex'],
    },
    {
        name: 'label',
        description: 'Override label text',
        extra: ['string'],
    },
    {
        name: 'scale',
        description: 'Set badge scale',
        extra: ['default: 1'],
    },
    {
        name: 'theme',
        description: 'Set color theme',
        extra: ['default: badgen'],
    },
    {
        name: 'icon',
        description: 'Set label icon',
        extra: ['image url'],
    },
    {
        name: 'icon_width',
        description: 'Set icon width',
        extra: ['number'],
    },
    {
        name: 'cache',
        description: 'Set cache duration',
        extra: ['min: 300', 'default: 3600'],
    }
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
        <div className="flex flex-col gap-4">
            <h2 className="text-xl text-gray-700 font-bold self-start">Supported Colors</h2>
            <div className="flex flex-col gap-1 items-start md:items-center md:flex-row">
                <div className="flex gap-1 w-full">
                    <StaticBadge label="color" status="blue" color="blue" />
                    <StaticBadge label="color" status="cyan" color="cyan" />
                    <StaticBadge label="color" status="green" color="green" />
                    <StaticBadge label="color" status="yellow" color="yellow" />
                    <StaticBadge label="color" status="orange" color="orange" />
                </div>
                <div className="flex gap-1 w-full">
                    <StaticBadge label="color" status="red" color="red" />
                    <StaticBadge label="color" status="pink" color="pink" />
                    <StaticBadge label="color" status="purple" color="purple" />
                    <StaticBadge label="color" status="gray" color="gray" />
                    <StaticBadge label="color" status="black" color="black" />
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

            {/* Query Parameters */}
            <div className="flex flex-col gap-4 flex-grow">
                <h2 className="text-xl text-gray-700 font-bold">Query Parameters</h2>
                <ul className="list-none flex flex-col gap-2">
                    {ApiParams.map(({ name, description, extra }) => (
                        <li key={name} className="flex flex-wrap gap-2 items-center">
                            <span className="bg-gray-100 rounded-md text-gray-800 px-2 py-1 font-mono text-sm">
                                {name}
                            </span>
                            <span className="text-gray-800">{description}</span>
                            {extra && (
                                <div className="flex flex-wrap gap-1 items-center">
                                    {extra.map(item => (
                                        <div key={item} className="bg-gray-100 rounded-md text-gray-700 px-[0.33rem] py-[0.1rem] font-mono text-xs">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Themes */}
            <div className="flex flex-col gap-4 flex-grow">
                <h2 className="text-xl text-gray-700 font-bold">Themes</h2>
                {/*
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
                */}
                <ThemeStrip themes={['honeypunk', 'tailwind', 'badgen']} />
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
                    <Row name="Checks (combined)" path="/github/checks/:owner/:repo" inject={['quintschaf', 'schafkit']} />
                    <Row name="Checks (combined)" path="/github/checks/:owner/:repo/:branch" inject={['quintschaf', 'schafkit', 'master']} />
                    <Row name="Checks (specific)" path="/github/checks/:owner/:repo/:branch/:check" inject={['quintschaf', 'schafkit', 'master', 'build']} />
                    <Row name="Contributors" path="/github/contributors/:owner/:repo" inject={['quintschaf', 'schafkit']} />
                    <Row name="License" path="/github/license/:owner/:repo" inject={['quintschaf', 'schafkit']} />
                </div>
            </Section>
            <Section name="Crates.io">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-8">
                    <Row name="Name" path="/crates/name/:crate" inject={['serde']} />
                    <Row name="Version" path="/crates/version/:crate" inject={['serde']} />
                    <Row name="Name and Version" path="/crates/info/:crate" inject={['serde']} />
                    <Row name="Downloads" path="/crates/downloads/:crate" inject={['serde']} />
                    <Row name="Downloads (latest version)" path="/crates/downloads/:crate/latest" inject={['serde']} />
                </div>
            </Section>
        </div>
    </main>
  )
}
