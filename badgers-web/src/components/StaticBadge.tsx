type Props = {
    label: string
    status: string
    color?: string
}

export default function StaticBadge({ label, status, color }: Props) {
    const buildUrl = () => {
        const proto = process.env.NEXT_PUBLIC_API_PROTO
        const host = process.env.NEXT_PUBLIC_API_HOST
        const baseUrl = `${proto}://${host}/badge`
        const params = [
            label,
            status,
            color,
        ]

        return `${baseUrl}/${params.filter(Boolean).join('/').replace(/^[/]+/gm, '')}?cache=86400`
    }

    return (
        <div className="flex justify-start items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img decoding="async" loading="lazy" src={buildUrl()} alt={label} />
        </div>
    )
}
