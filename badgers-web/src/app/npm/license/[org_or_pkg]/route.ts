import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import Npm from '@/utils/Npm'

interface Params {
    params: {
        org_or_pkg: string
    }
}

export async function GET(
    request: NextRequest,
    { params: { org_or_pkg: pkg } }: Params,
) {
    const data = await Npm.getPackageVersion(pkg, 'latest')
    if (data === null) return await Badge.error(request, 'npm')
    return await Badge.generate(request, 'license', data.license)
}

export const runtime = 'edge'
