import { NextRequest } from "next/server"

import Badge from '@/utils/Badge'
import GitHub from '@/utils/GitHub'

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
    if (resp.data === undefined) return await Badge.error(request, 'github')
    return await Badge.generate(request, 'contributors', resp.data!.length.toString())
}
