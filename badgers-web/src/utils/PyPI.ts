// Docs: https://warehouse.pypa.io/api-reference/json.html

const BASE_URL = 'https://pypi.org/pypi'

type VersionIdentifier = string | "latest"

type Package = {
    name: string
    version: string
    license: string
    // ...
}

const fetchOptions = {
    next: {
        revalidate: 300, // 5m
    }
}

const PyPI = {
    /**
     * Get the package information for the given version.
     *
     * @param packageName The package name
     * @param version The version or `'latest'`
     * @returns The package information for the given version, or `null`
     *
     * @example
     * ```ts
     * await PyPI.getPackageVersion('requests', 'latest')
     * await PyPI.getPackageVersion('numpy', '1.24.3')
     * ```
     */
    async getPackage(packageName: string, version: VersionIdentifier): Promise<Package | null> {
        const url = (version === 'latest') ?
            `${BASE_URL}/${packageName}/json` :
            `${BASE_URL}/${packageName}/${version}/json`

        try {
            const response = await fetch(url, fetchOptions)

            if (response.status === 404) {
                return null
            }

            const resp = await response.json() as { info: Package }
            return resp.info
        } catch {
            return null
        }
    },
}

export default PyPI
