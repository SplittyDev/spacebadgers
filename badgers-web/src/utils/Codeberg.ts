const API_BASE = 'https://codeberg.org/api/v1'

type ProjectInfo = {
    owner: string
    repo: string
}

type Repository = {
    id: number
    default_branch: string
    name: string
    forks_count: number
    stars_count: number
}

type Release = {
    name: string
    tag_name: string
}

class CodebergClient {
    token: string

    constructor(token: string) {
        this.token = token
    }

    buildUrl(
        path: string,
        query: Record<string, string | number | boolean> = {},
    ): string {
        const queryArgs = {
            ...query,
            token: this.token,
        }
        const queryString = Object.entries(queryArgs)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')

        return `${API_BASE}/${path}?${queryString}`
    }

    async getRepository({
        owner,
        repo,
    }: ProjectInfo): Promise<Repository | null> {
        const repoId = `${owner}/${repo}`
        const url = this.buildUrl(`repos/${repoId}`)
        const resp = await fetch(url)

        if (resp.status !== 200) return null
        return (await resp.json()) as Repository
    }

    async getIssuesCount(
        { owner, repo }: ProjectInfo,
        query: Record<string, string | number | boolean> = {},
    ): Promise<number | null> {
        const repoId = `${owner}/${repo}`
        const url = this.buildUrl(`repos/${repoId}/issues`, query)
        const resp = await fetch(url)

        if (resp.status !== 200) return null
        const count = resp.headers.get('x-total-count')
        return Number(count)
    }

    async getLatestRelease({
        owner,
        repo,
    }: ProjectInfo): Promise<Release | null> {
        const repoId = `${owner}/${repo}`
        const url = this.buildUrl(`repos/${repoId}/releases/latest`)
        const resp = await fetch(url)

        if (resp.status !== 200) return null
        return (await resp.json()) as Release
    }
}

const Codeberg = {
    getClient(): CodebergClient {
        return new CodebergClient(process.env.CODEBERG_TOKEN as string)
    },
}

export default Codeberg
