import { NextRequest } from "next/server"

import Badge from '@/utils/Badge'
import GitLab from '@/utils/GitLab'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(request: NextRequest, { params: { owner, repo } }: Params) {
    const repoData = await GitLab.getClient().getRepository({ owner, repo, license: true })
    const licenseName = repoData?.license?.nickname ?? repoData?.license?.key
    return await Badge.generate(request, 'license', licenseName ?? 'unknown', {
        color: !!licenseName ? 'blue' : 'gray'
    })
}

export const runtime = 'edge'
