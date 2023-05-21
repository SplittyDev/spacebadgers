const BASE_URL = 'https://registry.npmjs.com'

type VersionIdentifier = string | "latest"

type PackageVersion = {
    _id: string
    name: string
    version: string
    types?: string
    license: string
    description?: string
}

type Package = {
    _id: string
    _rev: string
    name: string
    description: string
    "dist-tags": {
        latest: string
    } & Record<string, string>
    versions: Record<string, PackageVersion>
    types?: string
    time: {
        modified: string
        created: string
    } & Record<string, string>
    license: string
    keywords: string[]
}

export default class Npm {
    /**
     * Use `getPackageVersion` whenever possible.
     *
     * @param packageName
     * @returns
     */
    static async getPackage(packageName: string): Promise<Package | null> {
        const url = `${BASE_URL}/${packageName}`
        const response = await fetch(url)

        if (response.status === 404) {
            return null
        }

        return await response.json() as Package
    }

    /**
     * Get the latest version of a package.
     *
     * @param packageName Package name
     * @param version Version or `'latest'`
     * @returns The latest version of the package, or `null` if the package does not exist.
     *
     * @example
     * ```ts
     * await Npm.getPackageVersion('react', 'latest')
     * await Npm.getPackageVersion('@octocat/rest', 'latest')
     * ```
     */
    static async getPackageVersion(packageName: string, version: VersionIdentifier): Promise<PackageVersion | null> {
        const url = `${BASE_URL}/${packageName}/${version}`

        try {
            const response = await fetch(url)

            if (response.status === 404) {
                return null
            }

            return await response.json() as PackageVersion
        } catch {
            return null
        }
    }

    /**
     * Get the corresponding `@types` package for an npm package.
     *
     * @param packageName Package name
     * @returns The corresponding `@types` package, or `null` if the package does not exist.
     */
    static async getTypesPackage(packageName: string): Promise<string | null> {
        const typesPackage = `@types/${packageName}`
        const data = await Npm.getPackageVersion(typesPackage, 'latest')
        if (data === null) return null
        return typesPackage
    }
}
