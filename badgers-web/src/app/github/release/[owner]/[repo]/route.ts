import { NextRequest } from "next/server"

import { Badge, GitHub } from '@/utils'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(request: NextRequest, { params: { owner, repo } }: Params) {
    const resp = await GitHub.wrapRequest(octokit => octokit.repos.getLatestRelease({ owner, repo }))
    return Badge.generate('Release', resp.data?.tag_name ?? 'None', {
        color: resp.data ? 'blue' : 'yellow'
    })
}
