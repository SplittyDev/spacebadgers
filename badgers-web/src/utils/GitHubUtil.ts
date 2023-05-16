import { Octokit } from '@octokit/rest'
import { OctokitResponse } from '@octokit/types'

interface GitHubResponse<T> {
    data: T | null,
}

type WrappedGitHubRequest<T> = (arg0: Octokit) => Promise<OctokitResponse<T>>

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
}
