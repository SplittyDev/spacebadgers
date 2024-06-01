import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import Codeberg from '@/utils/Codeberg'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(request: NextRequest, { params: { owner, repo } }: Params) {
    const release = await Codeberg.getClient().getLatestRelease({ owner, repo })

    const shortestName = (() => {
        if (release === null) { return null }
        return [release.tag_name, release.name]
            .reduce((a, b) => a.length < b.length ? a : b)
    })()

    return await Badge.generate(request, 'release', shortestName ?? 'None', {
        color: shortestName ? 'blue' : 'yellow'
    })
}

export const runtime = 'edge'
