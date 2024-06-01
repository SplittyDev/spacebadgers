import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import Crates from '@/utils/Crates'

interface Params {
    params: {
        crate: string
    }
}

export async function GET(request: NextRequest, { params: { crate } }: Params) {
    const resp = await Crates.wrapRequest(crates =>
        crates.api.crates.getCrate(crate),
    )
    if (resp === null) return await Badge.error(request, 'crates.io')
    const downloadCount = Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(resp.crate.downloads)
    return await Badge.generate(request, 'downloads', downloadCount)
}
