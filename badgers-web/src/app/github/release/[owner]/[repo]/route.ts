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
        octokit.repos.getLatestRelease({ owner, repo }),
    )
    return await Badge.generate(
        request,
        'release',
        resp.data?.tag_name ?? 'None',
        {
            color: resp.data ? 'blue' : 'yellow',
        },
    )
}
