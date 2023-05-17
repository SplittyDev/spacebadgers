import { Octokit } from '@octokit/rest'
import { OctokitResponse } from '@octokit/types'

interface GitHubResponse<T> {
    data: T | null,
}

type WrappedGitHubRequest<T> = (arg0: Octokit) => Promise<OctokitResponse<T>>

type CombinedCheckResult = {
    status: string
    color: string
}

export default class GitHubUtil {
    static getOctokit(): Octokit {
        return new Octokit({ auth: process.env.GITHUB_TOKEN })
    }

    static async wrapRequest<T>(request: WrappedGitHubRequest<T>): Promise<GitHubResponse<T>> {
        try {
            const { data } = await request(GitHubUtil.getOctokit())
            return {
                data
            }
        } catch (error) {
            return {
                data: null
            }
        }
    }

    static getCombinedCheckConclusion(conclusions: string[]): CombinedCheckResult {
        const ignoreList = ['neutral', 'cancelled', 'skipped']

        const shortCircuitMatch = (conclusion: string): CombinedCheckResult | undefined => {
            if (conclusions.some(c => c === conclusion)) {
                return { status: conclusion, color: 'red' }
            }
        }

        return (
            shortCircuitMatch('failure') ??
            shortCircuitMatch('timed_out') ??
            shortCircuitMatch('action_required') ??
            (
                conclusions
                    .filter(conclusion => !ignoreList.includes(conclusion))
                    .every(conclusion => conclusion === 'success')
                    ? { status: 'success', color: 'green' }
                    : { status: 'unknown', color: 'gray' }
            )
        )
    }
}
