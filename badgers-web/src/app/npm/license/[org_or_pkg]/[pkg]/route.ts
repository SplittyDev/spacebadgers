import { NextRequest } from "next/server"

import { Badge, Npm } from '@/utils'

interface Params {
    params: {
        org_or_pkg: string
        pkg: string
    }
}

export async function GET(request: NextRequest, { params: { org_or_pkg: org, pkg } }: Params) {
    const data = await Npm.getPackageVersion(`${org}/${pkg}`, 'latest')
    if (data === null) return await Badge.error(request, 'npm')
    return await Badge.generate(request, 'license', data.license)
}
