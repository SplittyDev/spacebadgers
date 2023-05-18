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
        octokit => octokit.licenses.getForRepo({ owner, repo })
    )
    const licenseName = resp.data?.license?.spdx_id ?? resp.data?.license?.name
    return await Badge.generate('license', licenseName ?? 'unknown', {
        color: !!licenseName ? 'blue' : 'gray'
    })
}