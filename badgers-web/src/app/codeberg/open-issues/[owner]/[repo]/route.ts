import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import Codeberg from '@/utils/Codeberg'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(
    request: NextRequest,
    { params: { owner, repo } }: Params,
) {
    const openIssuesCount = await Codeberg.getClient().getIssuesCount(
        { owner, repo },
        { type: 'issues', state: 'open' },
    )

    return await Badge.generate(
        request,
        'open issues',
        openIssuesCount?.toString() ?? 'None',
    )
}

export const runtime = 'edge'
