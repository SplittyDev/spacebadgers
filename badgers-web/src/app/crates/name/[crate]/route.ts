import { NextRequest } from "next/server"

import { Badge, Crates } from '@/utils'

interface Params {
    params: {
        crate: string
    }
}

export async function GET(request: NextRequest, { params: { crate } }: Params) {
    const crateResp = await Crates.wrapRequest(crates => crates.api.crates.getCrate(crate))
    if (crateResp === null) return await Badge.error('crates.io')
    return await Badge.generate('crates.io', `${crateResp.crate.name}`)
}
