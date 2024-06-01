import type { NextRequest } from "next/server"

import Badge from '@/utils/Badge'
import PyPI from '@/utils/PyPI'

interface Params {
    params: {
        pkg: string
    }
}

export async function GET(request: NextRequest, { params: { pkg } }: Params) {
    const data = await PyPI.getPackage(pkg, 'latest')
    if (data === null) return await Badge.error(request, 'pypi')
    return await Badge.generate(request, 'pypi', `${data.name}`)
}

export const runtime = 'edge'
