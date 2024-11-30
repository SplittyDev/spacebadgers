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
        octokit.licenses.getForRepo({ owner, repo }),
    )
    const licenseName = resp.data?.license?.spdx_id ?? resp.data?.license?.name
    return await Badge.generate(request, 'license', licenseName ?? 'unknown', {
        color: licenseName ? 'blue' : 'gray',
    })
}
