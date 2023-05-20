import { NextRequest, NextResponse } from "next/server"

const pick = (obj: any, keys: string[]) => Object.fromEntries(keys.map(key => [key, obj[key]]))

interface BadgeOverrides {
    labelColor?: string,
    color?: string,
    theme?: string,
}

export default class BadgeUtil {
    static async generate(request: NextRequest, label: string, status: string, overrides: BadgeOverrides = {}): Promise<NextResponse> {
        const api = {
            proto: process.env.NEXT_PUBLIC_API_PROTO,
            host: process.env.NEXT_PUBLIC_API_HOST,
        }
        const pathParams = {
            label: encodeURIComponent(label),
            status: encodeURIComponent(status),
        }
        const systemQueryOverrides = overrides
        const userQueryOverrides = request.nextUrl.search
            .replace(/^\?+/gm, '').split('&')
            .reduce((acc, pair) => {
                const [key, value] = pair.split('=')
                return {...acc, [key]: value}
            }, {})
        const unifiedQueryOverrides = {...systemQueryOverrides, ...userQueryOverrides}
        const queryParams = Object
            .entries(unifiedQueryOverrides)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')
        const resp = await fetch(`${api.proto}://${api.host}/badge/${pathParams.label}/${pathParams.status}?${queryParams}`)
        const data = await resp.arrayBuffer()
        const headers = {
            'content-type': 'image/svg+xml',
        } as Record<string, string>
        const cacheControl = resp.headers.get('cache-control')
        if (cacheControl) {
            headers['cache-control'] = cacheControl
        }
        return new NextResponse(data, {
            status: resp.status,
            statusText: resp.statusText,
            headers,
        })
    }

    static async error(request: NextRequest, subsystem: string): Promise<NextResponse> {
        return await BadgeUtil.generate(request, subsystem, 'error', { color: 'gray' })
    }

    static async passThrough(request: NextRequest): Promise<NextResponse> {
        const api = {
            proto: process.env.NEXT_PUBLIC_API_PROTO,
            host: process.env.NEXT_PUBLIC_API_HOST,
        }
        const urlPath = request.nextUrl.pathname.replace(/^[/]+/gm, '')
        const urlQuery = request.nextUrl.search.replace(/^\?+/gm, '')
        const url = `${api.proto}://${api.host}/${urlPath}?${urlQuery}`
        const resp = await fetch(url)
        const data = await resp.arrayBuffer()
        const headers = {
            'content-type': 'image/svg+xml',
        } as Record<string, string>
        const cacheControl = resp.headers.get('cache-control')
        if (cacheControl) {
            headers['cache-control'] = cacheControl
        }
        return new NextResponse(data, {
            status: resp.status,
            statusText: resp.statusText,
            headers,
        })
    }
}
