import { NextRequest, NextResponse } from "next/server"

const pick = (obj: any, keys: string[]) => Object.fromEntries(keys.map(key => [key, obj[key]]))

interface BadgeOverrides {
    labelColor?: string,
    color?: string,
    theme?: string,
}

/**
 * Badge generation utility.
 *
 * Uses the Spacebadgers worker to generate badges.
 */
export default class Badge {

    /**
     * Generate a badge.
     *
     * @param request The incoming request.
     * @param label The badge label.
     * @param status The badge status.
     * @param overrides Badge overrides.
     * @returns The badge response.
     */
    static async generate(request: NextRequest, label: string, status: string, overrides: BadgeOverrides = {}): Promise<NextResponse> {
        // Get API configuration from env
        const api = {
            proto: process.env.NEXT_PUBLIC_API_PROTO,
            host: process.env.NEXT_PUBLIC_API_HOST,
        }

        // Build path params
        const pathParams = {
            label: encodeURIComponent(label),
            status: encodeURIComponent(status),
        }

        // Build query params
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

        // Fetch the badge from the worker
        const resp = await fetch(`${api.proto}://${api.host}/badge/${pathParams.label}/${pathParams.status}?${queryParams}`)
        const data = await resp.arrayBuffer()

        // Build response headers
        const headers = {
            'content-type': 'image/svg+xml',
        } as Record<string, string>
        const cacheControl = resp.headers.get('cache-control')
        if (cacheControl) {
            headers['cache-control'] = cacheControl
        }

        // Return the response
        return new NextResponse(data, {
            status: resp.status,
            statusText: resp.statusText,
            headers,
        })
    }

    static async error(request: NextRequest, subsystem: string): Promise<NextResponse> {
        return await Badge.generate(request, subsystem, 'error', { color: 'gray' })
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
