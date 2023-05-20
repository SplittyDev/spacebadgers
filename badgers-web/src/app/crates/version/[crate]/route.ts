import { NextRequest } from "next/server"

import { Badge, Crates } from '@/utils'

interface Params {
    params: {
        crate: string
    }
}

export async function GET(request: NextRequest, { params: { crate } }: Params) {
    const resp = await Crates.wrapRequest(crates => crates.api.crates.getVersions(crate))
    if (resp === null) return await Badge.error('crates.io')
    const latestVersion = resp.versions
        .filter(v => !v.yanked)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .shift()
    if (latestVersion === undefined) return await Badge.error('crates.io')
    return await Badge.generate('crates.io', `v${latestVersion.num}`)
}
