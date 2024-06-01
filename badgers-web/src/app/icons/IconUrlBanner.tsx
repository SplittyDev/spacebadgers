'use client'

import { useEffect, useState } from 'react'

import Path from '@/components/Path'

const iconList = [
    'feather-github',
    'cssgg-add',
    'eva-book',
    'feather-activity',
    'cssgg-alarm',
    'eva-cast',
    'feather-arrow-left',
    'cssgg-anchor',
    'eva-google',
    'feather-git-merge',
    'cssgg-album',
    'eva-activity',
    'feather-plus',
    'cssgg-arrow-up',
    'eva-npm',
    'feather-lock',
    'cssgg-battery',
    'eva-options',
    'feather-mail',
    'cssgg-box',
    'eva-repeat',
    'feather-code',
    'cssgg-browser',
    'eva-shield',
    'feather-key',
    'cssgg-bulb',
    'eva-wifi',
    'feather-globe',
    'cssgg-calendar',
    'eva-twitter',
    'feather-hash',
    'cssgg-carousel',
    'eva-unlock',
    'feather-map',
    'cssgg-key',
    'eva-sync',
    'feather-chrome',
    'cssgg-paypal',
    'eva-trash',
    'feather-box',
    'cssgg-phone',
    'eva-power',
    'feather-bell',
    'cssgg-quote',
    'eva-star',
    'feather-award',
    'cssgg-size',
    'eva-printer',
    'feather-copy',
    'cssgg-smartphone',
    'eva-share',
    'feather-heart',
    'cssgg-tag',
    'eva-pin',
    'feather-command',
    'cssgg-time',
    'eva-person',
    'feather-play',
    'cssgg-usb',
    'eva-percent',
    'feather-mic',
    'cssgg-windows',
    'eva-move',
    'feather-tag',
    'cssgg-youtube',
    'eva-minus',
    'feather-power',
    'cssgg-studio',
    'eva-mic',
    'feather-rewind',
    'cssgg-slack',
    'eva-linkedin',
    'feather-coffee',
    'cssgg-spinner',
    'eva-menu',
    'feather-slack',
    'cssgg-sun',
    'eva-list',
    'feather-table',
    'cssgg-vinyl',
    'eva-at',
]

const maxIconLength = iconList.reduce((a, b) =>
    a.length > b.length ? a : b,
).length

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
