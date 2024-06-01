'use client'

import { useMemo, useState } from "react"

import type { IconSetList } from "./page"

type Props = {
    icons: IconSetList
}

export default function IconShelf({ icons }: Props) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const filteredIcons = useMemo(() => {
        if (searchTerm === '') return icons
        return icons.map(({ name, icons }) => {
            return {
                name,
                icons: Object.fromEntries(Object.entries(icons).filter(([key]) => key.includes(searchTerm))),
            }
        })
    }, [icons, searchTerm])

    return (
        <div className="flex flex-col gap-4 w-full">
            <input className="border-2 border-gray-600 p-2 rounded-md" type="search" placeholder="Search for icons" value={searchTerm} onInput={e => setSearchTerm((e.target as HTMLInputElement).value)} />
            {filteredIcons.map(({ name, icons }) => (
                <section key={name} className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <div className="border-2 border-gray-600 p-4 rounded-md grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_1fr] lg:grid-cols-[auto_1fr_auto_1fr_auto_1fr] items-center gap-4">
                        {Object.keys(icons).length === 0 && (
                            <div className="text-gray-700">No matches.</div>
                        )}
                        {Object.entries(icons).map(([name, data]) => {
                            return (
                                <>
                                    <div className="flex justify-center items-center bg-gray-700 rounded-md w-8 h-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img width="20" height="20" alt={name} src={data} />
                                    </div>
                                    <div className="text-gray-800">{name}</div>
                                </>
                            )
                        })}
                    </div>
                </section>
            ))}
        </div>
    )
}
