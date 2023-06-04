import { NextRequest } from "next/server"

import Badge from '@/utils/Badge'
import Crates from '@/utils/Crates'

interface Params {
    params: {
        crate: string
    }
}

export async function GET(request: NextRequest, { params: { crate } }: Params) {
    const crateResp = await Crates.wrapRequest(crates => crates.api.crates.getCrate(crate))
    if (crateResp === null) return await Badge.error(request, 'crates.io')
    const versionsResp = await Crates.wrapRequest(crates => crates.api.crates.getVersions(crate))
    if (versionsResp === null) return await Badge.error(request, 'crates.io')
    const latestVersion = versionsResp.versions
        .filter(v => !v.yanked)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .shift()
    if (latestVersion === undefined) return await Badge.error(request, 'crates.io')
    return await Badge.generate(request, 'crates.io', `${crateResp.crate.name} v${latestVersion.num}`)
}
