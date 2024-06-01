import { CratesIO } from 'crates.io'

type WrappedCratesRequest<T> = (arg0: CratesIO) => Promise<T>

const Crates = {
    getCratesClient(): CratesIO {
        return new CratesIO()
    },

    async wrapRequest<T>(request: WrappedCratesRequest<T>): Promise<T | null> {
        try {
            return await request(Crates.getCratesClient())
        } catch (error) {
            return null
        }
    },
}

export default Crates

// Disable Vercel data cache for all requests.
// This is a temporary solution. Once we can serve all routes via fetch,
// we can remove this and use the next revalidate feature.
export const fetchCache = 'force-no-store'
