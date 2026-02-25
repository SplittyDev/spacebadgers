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

    const crateResp = await Crates.crate(crate)
    if (crateResp === null) return await Badge.error(request, 'crates.io')
    return await Badge.generate(request, 'crates.io', `${crateResp.crate.name}`)
}
