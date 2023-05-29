import { Suspense } from "react"
import IconShelf from "./IconShelf"
import IconUrlBanner from "./IconUrlBanner"

export type IconSetList = {
    name: string
    icons: Record<string, string>
}[]

async function getIcons() {
    const endpoint = `${process.env.NEXT_PUBLIC_API_PROTO}://${process.env.NEXT_PUBLIC_API_HOST}/json/icons`
    const res = await fetch(endpoint)
    const data = await res.json() as IconSetList
    for (const item in data) {
        data[item].icons = Object.fromEntries(Object.entries(data[item].icons).map(([key, value]) => {
            return [key, `data:image/svg+xml;base64,${Buffer.from(value).toString('base64')}`]
        }))
    }
    return data
}

export default async function IconsPage() {
    const icons = await getIcons()

    return (
        <main className="flex flex-col gap-4 px-4 w-full">
            <IconUrlBanner />
            <Suspense fallback={<div className="p-4 bg-gray-100 rounded-md">Loading icons...</div>}>
                <IconShelf icons={icons} />
            </Suspense>
        </main>
    )
}
