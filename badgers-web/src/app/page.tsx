import Image from 'next/image'

export default function Home() {
  return (
    <main className="">
        <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
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
    </main>
  )
}
