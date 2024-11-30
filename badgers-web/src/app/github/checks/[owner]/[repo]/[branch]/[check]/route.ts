import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import GitHub from '@/utils/GitHub'

interface Params {
    params: Promise<{
        owner: string
        repo: string
        branch: string
        check: string
    }>
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    const {
        owner,
        repo,
        branch,
        check
    } = params;

    // Fetch all checks for latest commit
    const allChecksData = await GitHub.wrapRequest(octokit =>
        octokit.checks.listForRef({ owner, repo, ref: branch }),
    )

    // Get all check results
    const lowerCaseCheck = check.toLowerCase()
    const checkResults = allChecksData.data?.check_runs
        .filter(checkRun => checkRun.name.toLowerCase() === lowerCaseCheck)
        .map(checkRun => checkRun.conclusion)
    if (checkResults === undefined) return await Badge.error(request, 'github')
    if (checkResults.length === 0) return await Badge.error(request, 'github')

    // Combine check results
    const combinedConclusion = GitHub.getCombinedCheckConclusion(
        checkResults as string[],
    )

    return await Badge.generate(request, check, combinedConclusion.status, {
        color: combinedConclusion.color,
    })
}
