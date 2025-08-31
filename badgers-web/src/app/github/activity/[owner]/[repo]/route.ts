import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import GitHub from '@/utils/GitHub'

interface Params {
    params: Promise<{
        owner: string
        repo: string
    }>
}

function getRelativeTimeText(commitDate: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - commitDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffMinutes < 60) {
        return 'today'
    } else if (diffHours < 24) {
        return 'today'
    } else if (diffDays === 1) {
        return 'yesterday'
    } else if (diffDays < 7) {
        return `${diffDays} days ago`
    } else if (diffWeeks < 4) {
        return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`
    } else if (diffMonths < 12) {
        return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`
    } else {
        return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`
    }
}

function getActivityColor(commitDate: Date): string {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) return 'green'
    if (diffDays <= 7) return 'yellow'
    if (diffDays <= 30) return 'orange'
    return 'red'
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    const {
        owner,
        repo
    } = params;

    // Get repository info to find default branch
    const repoResp = await GitHub.wrapRequest(octokit =>
        octokit.repos.get({ owner, repo }),
    )
    
    if (!repoResp.data) {
        return await Badge.error(request, 'github')
    }

    const defaultBranch = repoResp.data.default_branch

    // Get latest commit on the default branch
    const commitsResp = await GitHub.wrapRequest(octokit =>
        octokit.repos.listCommits({ 
            owner, 
            repo, 
            sha: defaultBranch,
            per_page: 1 
        }),
    )

    if (!commitsResp.data || commitsResp.data.length === 0) {
        return await Badge.error(request, 'github')
    }

    const latestCommit = commitsResp.data[0]
    const commitDate = new Date(latestCommit.commit.author?.date || latestCommit.commit.committer?.date || '')
    
    if (isNaN(commitDate.getTime())) {
        return await Badge.error(request, 'github')
    }

    const relativeTime = getRelativeTimeText(commitDate)
    const color = getActivityColor(commitDate)

    return await Badge.generate(
        request,
        'last commit',
        relativeTime,
        { color }
    )
}