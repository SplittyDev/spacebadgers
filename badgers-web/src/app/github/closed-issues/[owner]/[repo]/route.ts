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
        octokit.issues.listForRepo({ owner, repo, state: 'closed' }),
    )
    const issues = resp.data?.filter(issue => issue.pull_request === undefined)
    return await Badge.generate(
        request,
        'closed issues',
        issues?.length?.toString() ?? 'None',
    )
}
