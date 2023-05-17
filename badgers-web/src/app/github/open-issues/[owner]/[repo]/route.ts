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
        octokit => octokit.issues.listForRepo({ owner, repo, state: 'open' })
    )
    const issues = resp.data?.filter(issue => issue.pull_request === undefined)
    return await Badge.generate('open issues', issues?.length?.toString() ?? 'None')
}
