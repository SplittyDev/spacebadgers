type Props = {
    label: string
    status: string
    color?: string
    icon?: string,
    labelOverride?: string,
}

const isDevelopment = process.env.NODE_ENV === 'development'

// Pre-calculated static badge widths to avoid layout shifts
const widthLut = {
    'color/blue/blue': 70,
    'color/cyan/cyan': 73,
    'color/green/green': 79,
    'color/yellow/yellow': 82,
    'color/orange/orange': 85,
    'color/red/red': 65,
    'color/pink/pink': 70,
    'color/purple/purple': 82,
    'color/gray/gray': 72,
    'color/black/black': 76,
} as Record<string, number>

export default function StaticBadge({ label, status, color, icon, labelOverride }: Props) {
    const buildUrl = () => {
        const proto = process.env.NEXT_PUBLIC_API_PROTO
        const host = process.env.NEXT_PUBLIC_API_HOST
        const baseUrl = `${proto}://${host}/badge`
        const pathParams = [
            label,
            status,
            color,
        ]
        const queryParams = [
            icon && `icon=${icon}`,
            labelOverride !== undefined && `label=${labelOverride}`,
            isDevelopment && `bust=${Date.now()}`,
        ].filter(Boolean).join("&")
        return `${baseUrl}/${pathParams.filter(Boolean).join('/').replace(/^[/]+/gm, '')}?cache=86400&${queryParams}`
    }

    const badgeHash = `${label}/${status}/${color}`
    const width = widthLut[badgeHash] || undefined

    return (
        <div className="flex justify-start items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="h-[20px]" style={{ width }} width={width} height={20} src={buildUrl()} alt={label} />
        </div>
    )
}
