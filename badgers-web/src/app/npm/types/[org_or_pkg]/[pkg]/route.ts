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
    const getTypesText = async (): Promise<'included' | 'missing' | string> => {
        if (data.types) return 'included'
        const typesPackage = await Npm.getTypesPackage(`${org}/${pkg}`)
        return typesPackage ?? 'missing'
    }
    const getTypesColor = (types: string): string => {
        if (types === 'included') return 'blue'
        if (types === 'missing') return 'orange'
        return 'cyan'
    }
    const typesText = await getTypesText()
    const typesColor = getTypesColor(typesText)
    return await Badge.generate(request, 'types', typesText, {
        color: typesColor,
    })
}

export const runtime = 'edge'
