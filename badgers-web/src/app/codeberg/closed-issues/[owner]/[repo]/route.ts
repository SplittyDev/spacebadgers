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
    const closedIssuesCount = await Codeberg.getClient().getIssuesCount(
        { owner, repo },
        { type: 'issues', state: 'closed' },
    )

    return await Badge.generate(
        request,
        'closed issues',
        closedIssuesCount?.toString() ?? 'None',
    )
}

export const runtime = 'edge'
