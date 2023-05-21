import { Octokit } from '@octokit/rest'
import { OctokitResponse } from '@octokit/types'

type WrappedGitHubRequest<T> = (arg0: Octokit) => Promise<OctokitResponse<T>>

type GitHubResponse<T> = {
    data: T | null
}

type CombinedCheckResult = {
    status: string
    color: string
}

export default class GitHub {
    /**
     * Get an Octokit instance.
     *
     * @returns An Octokit instance.
     */
    static getOctokit(): Octokit {
        return new Octokit({ auth: process.env.GITHUB_TOKEN })
    }

    /**
     * Wrap a GitHub request in a try-catch block.
     *
     * @param request The request to wrap.
     * @returns The response
     */
    static async wrapRequest<T>(request: WrappedGitHubRequest<T>): Promise<GitHubResponse<T>> {
        try {
            const { data } = await request(GitHub.getOctokit())
            return {
                data
            }
        } catch (error) {
            return {
                data: null
            }
        }
    }

    /**
     * Reduce an array of check runs to a single check conclusion.
     *
     * @param checkRuns An array of check runs.
     * @returns The combined check conclusion.
     */
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
