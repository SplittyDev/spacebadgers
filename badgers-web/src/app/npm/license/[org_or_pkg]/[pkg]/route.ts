import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import Npm from '@/utils/Npm'

interface Params {
    params: Promise<{
        org_or_pkg: string
        pkg: string
    }>
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    const {
        org_or_pkg: org,
        pkg
    } = params;

    const data = await Npm.getPackageVersion(`${org}/${pkg}`, 'latest')
    if (data === null) return await Badge.error(request, 'npm')
    return await Badge.generate(request, 'license', data.license)
}

