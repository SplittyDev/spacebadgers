import { NextRequest } from "next/server"

interface BadgeOverrides {
    labelColor?: string,
    color?: string,
    theme?: string,
}

export default class BadgeUtil {
    static async generate(label: string, status: string, overrides: BadgeOverrides = {}): Promise<Response> {
        const api = {
            proto: process.env.NEXT_PUBLIC_API_PROTO,
            host: process.env.NEXT_PUBLIC_API_HOST,
        }
        const pathParams = {
            label: encodeURIComponent(label),
            status: encodeURIComponent(status),
        }
        const queryParams = Object
            .entries(overrides)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')
        return await fetch(`${api.proto}://${api.host}/badge/${pathParams.label}/${pathParams.status}?${queryParams}`)
    }

    static async passThrough(request: NextRequest) {
        const api = {
            proto: process.env.NEXT_PUBLIC_API_PROTO,
            host: process.env.NEXT_PUBLIC_API_HOST,
        }
        return await fetch(`${api.proto}://${api.host}${request.nextUrl.pathname}${request.nextUrl.search}`)
    }
}
