import { CratesIO } from 'crates.io'

type WrappedCratesRequest<T> = (arg0: CratesIO) => Promise<T>

export default class Crates {
    static getCratesClient(): CratesIO {
        return new CratesIO()
    }

    static async wrapRequest<T>(request: WrappedCratesRequest<T>): Promise<T | null> {
        try {
            return await request(Crates.getCratesClient())
        } catch (error) {
            return null
        }
    }
}
