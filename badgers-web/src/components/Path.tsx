type Props = {
    value: string,
}

export default function Path({ value }: Props) {
    const getPathColor = (path: string, i: number) => {
        const staticColors = [
            'text-slate-800',
            'text-zinc-600',
            'text-stone-600',
        ]
        const dynamicColors = [
            'text-lime-700',
            'text-green-700',
            'text-emerald-700',
            'text-teal-700',
            'text-cyan-700',
            'text-sky-700',
        ]
        return path.startsWith(':')
            ? dynamicColors[i % dynamicColors.length]
            : staticColors[i % staticColors.length]
    }

    const explodePath = (path: string) => {
        const parts = value.replace(/^[/]+/gm, '').split('/')
        let staticIndex = 0
        let dynamicIndex = 0
        return parts.map(value => {
            const isDynamic = value.startsWith(':')
            return {
                value,
                className: getPathColor(value, isDynamic ? dynamicIndex++ : staticIndex++)
            }
        })
    }

    const parts = explodePath(value)

    return (
        <div className="flex flex-wrap text-gray-400 font-mono">
            {parts.map(({ value, className }, i) => (
                <>
                    <div key={`sep-${value}`}>/</div>
                    <div key={value} className={className}>
                        {value}
                    </div>
                </>
            ))}
        </div>
    )
}
