import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import Crates from '@/utils/Crates'

interface Params {
    params: Promise<{
        crate: string
    }>
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    const {
        crate
    } = params;

    const resp = await Crates.wrapRequest(crates =>
        crates.api.crates.getVersions(crate),
    )
    if (resp === null) return await Badge.error(request, 'crates.io')
    const latestVersion = resp.versions
        .filter(v => !v.yanked)
        .sort(
            (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
        )
        .shift()
    if (latestVersion === undefined)
        return await Badge.error(request, 'crates.io')
    return await Badge.generate(request, 'crates.io', `v${latestVersion.num}`)
}
