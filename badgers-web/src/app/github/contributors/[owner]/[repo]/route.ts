import { NextRequest } from "next/server"

import { Badge, GitHub } from '@/utils'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(request: NextRequest, { params: { owner, repo } }: Params) {
    const resp = await GitHub.wrapRequest(
        octokit => octokit.repos.listContributors({ owner, repo })
    )
    if (resp.data === undefined) return await Badge.error('github')
    return await Badge.generate('contributors', resp.data!.length.toString())
}
