import { NextRequest } from "next/server"

import Badge from '@/utils/Badge'
import GitLab from '@/utils/GitLab'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(request: NextRequest, { params: { owner, repo } }: Params) {
    const release = await GitLab.getClient().getLatestRelease({ owner, repo })
    const shortestName = [release?.tag_name, release?.name]
        .filter(Boolean)
        .reduce((a, b) => a!.length < b!.length ? a : b)
    return await Badge.generate(request, 'release', shortestName ?? 'None', {
        color: !!shortestName ? 'blue' : 'yellow'
    })
}

export const runtime = 'edge'
