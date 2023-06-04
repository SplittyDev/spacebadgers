import { NextRequest } from "next/server"

import Badge from '@/utils/Badge'

export async function GET(request: NextRequest) {
    return await Badge.passThrough(request)
}
