import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import Codeberg from '@/utils/Codeberg'

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

    const repository = await Codeberg.getClient().getRepository({ owner, repo })
    const stargazers = repository?.stars_count

    return await Badge.generate(
        request,
        'stars',
        stargazers?.toString() ?? 'None',
        {
            color: stargazers ? 'blue' : 'yellow',
        },
    )
}

