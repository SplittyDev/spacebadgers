type Props = {
    value: string,
}

export default function Path({ value }: Props) {
    const containsProtocol = /^https?:[/]{2}/m.test(value)

    const getPathColor = (path: string, i: number, isProtocol: boolean) => {
        const staticColors = [
            'text-slate-800',
            'text-zinc-600',
            'text-stone-600',
        ]
        const dynamicColors = [
            'text-emerald-700',
            'text-cyan-700',
            'text-sky-700',
            'text-indigo-700',
            'text-purple-700',
        ]
        if (isProtocol) {
            return 'text-gray-400'
        }
        return path.startsWith(':')
            ? dynamicColors[i % dynamicColors.length]
            : staticColors[i % staticColors.length]
    }

    const explodePath = (path: string) => {
        const parts = value.replace(/^[/]+/gm, '').split('/')
        let staticIndex = 0
        let dynamicIndex = 0
        return parts.map(value => {
            const isProtocol = value.endsWith(':')
            const isDynamic = value.startsWith(':')
            return {
                value,
                className: getPathColor(value, isDynamic ? dynamicIndex++ : staticIndex++, isProtocol)
            }
        })
    }

    const parts = explodePath(value)

    return (
        <div className="flex flex-wrap text-gray-400 font-mono">
            {parts.map(({ value, className }, i) => (
                <>
                    {(!containsProtocol || (containsProtocol && i != 0)) && (
                        <div key={`sep-${value}`}>/</div>
                    )}
                    <div key={value} className={className}>
                        {value}
                    </div>
                </>
            ))}
        </div>
    )
}
