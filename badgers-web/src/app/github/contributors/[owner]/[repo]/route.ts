import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import GitHub from '@/utils/GitHub'

interface Params {
    params: Promise<{
        owner: string
        repo: string
    }>
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    const {
        owner,
        repo
    } = params;

    const resp = await GitHub.wrapRequest(octokit =>
        octokit.repos.listContributors({ owner, repo }),
    )
    if (!resp.data) return await Badge.error(request, 'github')
    return await Badge.generate(
        request,
        'contributors',
        resp.data.length.toString(),
    )
}
