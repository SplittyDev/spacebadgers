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

    const resp = await Crates.crate(crate)
    if (resp === null) return await Badge.error(request, 'crates.io')
    const downloadCount = Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(resp.crate.downloads)
    return await Badge.generate(request, 'downloads', downloadCount)
}
