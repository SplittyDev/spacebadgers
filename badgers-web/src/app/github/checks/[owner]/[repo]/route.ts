import { NextRequest } from "next/server"

import { Badge, GitHub } from '@/utils'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(request: NextRequest, { params: { owner, repo } }: Params) {
    // Fetch repo
    const repoData = await GitHub.wrapRequest(
        octokit => octokit.repos.get({ owner, repo })
    )

    // Get default branch
    const defaultBranch = repoData.data?.default_branch
    if (defaultBranch === undefined) return await Badge.error(request, 'github')

    // Fetch all checks for latest commit
    const allChecksData = await GitHub.wrapRequest(
        octokit => octokit.checks.listForRef({ owner, repo, ref: defaultBranch })
    )

    // Get all check results
    const checkResults = allChecksData.data?.check_runs.map(check => check.conclusion)
    if (checkResults === undefined) return await Badge.error(request, 'github')

    // Combine check results
    const combinedConclusion = GitHub.getCombinedCheckConclusion(checkResults as string[])

    return await Badge.generate(request, 'checks', combinedConclusion.status, {
        color: combinedConclusion.color
    })
}
