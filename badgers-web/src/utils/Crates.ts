export type CrateInfo = {
    badges: {
        [key: string]: {
            [key: string]: string
        }
    } | null
    categories: null | string
    created_at: string
    description: string
    documentation: null | string
    downloads: number
    exact_match: boolean
    homepage: null | string
    id: string
    keywords: null | string
    links: {
        owner_team: string
        owner_user: string
        owners: string
        reverse_dependencies: string
        version_downloads: string
        versions: string
    }
    max_version: string
    name: string
    recent_downloads: null | number
    repository: null | string
    updated_at: string
    versions: null | number[]
}

export type CrateVersion = {
    crate: string
    crate_size: number
    created_at: string
    dl_path: string
    downloads: number
    features: {
        [key: string]: string[]
    }
    id: number
    license: string
    links: {
        authors: string
        dependencies: string
        version_downloads: string
    }
    num: string
    published_by: null | string
    readme_path: string
    updated_at: string
    yanked: boolean
}

export type CrateInfoResponse = {
    crate: CrateInfo
    versions: CrateVersion[]
}

export type CrateVersionResponse = {
    versions: CrateVersion[]
}

export default class CratesClient {
    static BASE_URL = 'https://crates.io/api/v1'

    static async crate(crate: string): Promise<CrateInfoResponse | null> {
        return await this.request(`${CratesClient.BASE_URL}/crates/${crate}`)
    }

    static async versions(crate: string): Promise<CrateVersionResponse | null> {
        return await this.request(`${CratesClient.BASE_URL}/crates/${crate}/versions`)
    }

    private static async request<T>(url: string): Promise<T | null> {
        const resp = await fetch(url, {
            headers: {
                'User-Agent': 'spacebadgers-badge-agent (badgers.space)'
            }
        })
        if (resp.status !== 200) return null
        return await resp.json<T>()
    }
}
