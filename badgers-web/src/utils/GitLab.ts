// Supports GitLab API v4

/**
 * GitLab API base url
 */
const API_BASE = 'https://gitlab.com/api/v4';

type ProjectInfo = {
    owner: string
    repo: string
}

type GetRepositoryArgs = ProjectInfo & {
    license: boolean
}

/**
 * A subset of the GitLab repository response.
 *
 * @see https://docs.gitlab.com/api/projects.html#get-single-project
 */
type GetRepositoryResponse = {
    id: number
    default_branch: string
    name: string
    license: {
        key: string
        name: string
        nickname: string
    }
    forks_count: number
    star_count: number
}

type Release = {
    name: string
    tag_name: string
    upcoming_release: boolean
}

/**
 * GitLab API client
 */
class GitLabClient {
    privateToken: string

    constructor(privateToken: string) {
        this.privateToken = privateToken
    }

    /**
     * Build a GitLab API url with authentication.
     */
    buildUrl(path: string, query: Record<string, any> = {}): string {
        const queryArgs = {
            ...query,
            private_token: this.privateToken,
        }
        const queryString = Object
            .entries(queryArgs)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')
        return `${API_BASE}/${path}?${queryString}`
    }

    async getRepository({ owner, repo, license }: GetRepositoryArgs): Promise<GetRepositoryResponse | null> {
        const repoId = encodeURIComponent(`${owner}/${repo}`)
        const resp = await fetch(this.buildUrl(`projects/${repoId}`, { license }))
        if (resp.status !== 200) return null
        return await resp.json() as GetRepositoryResponse
    }

    async getLatestRelease({ owner, repo }: ProjectInfo): Promise<Release | null> {
        const repoId = encodeURIComponent(`${owner}/${repo}`)
        const resp = await fetch(this.buildUrl(`projects/${repoId}/releases`))
        if (resp.status !== 200) return null
        const releases = await resp.json() as Array<Release>
        if (releases.length === 0) return null
        const latestNonUpcomingRelease = releases.find(r => !r.upcoming_release)
        if (latestNonUpcomingRelease === undefined) return null
        return latestNonUpcomingRelease
    }
}

export default class GitLab {
    static getClient(): GitLabClient {
        return new GitLabClient(process.env.GITLAB_TOKEN as string);
    }
}
