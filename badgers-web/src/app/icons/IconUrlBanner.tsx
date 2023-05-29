'use client'

import { useEffect, useState } from "react"

import Path from "@/components/Path"

const iconList = [
    'feather-github',
    'feather-activity',
    'feather-arrow-left',
    'feather-git-merge',
    'feather-plus',
    'feather-lock',
    'feather-mail',
    'feather-code',
    'feather-key',
    'feather-globe',
    'feather-hash',
    'feather-map',
    'feather-chrome',
    'feather-box',
    'feather-bell',
    'feather-award',
    'feather-copy',
    'feather-heart',
    'feather-command',
    'feather-play',
    'feather-mic',
    'feather-tag',
    'feather-power',
    'feather-rewind',
    'feather-coffee',
    'feather-slack',
    'feather-table',
]

const maxIconLength = iconList.reduce((a, b) => a.length > b.length ? a : b).length

export default function IconUrlBanner() {
    const [iconIndex, setIconIndex] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIconIndex(i => (i + 1) % iconList.length)
        }, 1000)
        return () => clearInterval(intervalId)
    })

    const icon = iconList[iconIndex].padEnd(maxIconLength, ' ')
    const path = `${process.env.NEXT_PUBLIC_WEB_PROTO}://${process.env.NEXT_PUBLIC_WEB_HOST}/badge/:label/:status__query__?icon=${icon}`

    return (
        <div className="flex flex-wrap justify-center bg-gray-100 p-4 rounded-md font-mono text-sm text-center">
            <Path value={path} />
        </div>
    )
}
