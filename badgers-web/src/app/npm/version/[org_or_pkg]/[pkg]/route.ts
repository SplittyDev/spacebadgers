import type { NextRequest } from "next/server"

import Badge from '@/utils/Badge'
import Npm from '@/utils/Npm'

interface Params {
    params: {
        org_or_pkg: string
        pkg: string
    }
}

export async function GET(request: NextRequest, { params: { org_or_pkg: org, pkg } }: Params) {
    const data = await Npm.getPackageVersion(`${org}/${pkg}`, 'latest')
    if (data === null) return await Badge.error(request, 'npm')
    return await Badge.generate(request, 'npm', `v${data.version}`)
}
