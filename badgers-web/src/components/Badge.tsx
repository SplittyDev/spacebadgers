type Props = {
    label: string
    status: string
    color?: string
}

export default function Badge({ label, status, color }: Props) {
    const buildUrl = () => {
        const proto = process.env.NEXT_PUBLIC_API_PROTO
        const host = process.env.NEXT_PUBLIC_API_HOST
        const baseUrl = `${proto}://${host}/badge`
        const params = [
            label,
            status,
            color,
        ]

        return `${baseUrl}/${params.filter(Boolean).join('/')}`
    }

    return (
        <div className="">
            <img loading="lazy" src={buildUrl()} alt={label} />
        </div>
    )
}
