import { Fragment } from 'react'

type Props = {
    value: string
}

export default function Path({ value }: Props) {
    const containsProtocol = /^https?:[/]{2}/m.test(value)

    const getPathColor = (
        path: string,
        i: number,
        isProtocol: boolean,
        isQueryParam: boolean,
    ) => {
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
        const queryParamColors = ['text-pink-600', 'text-purple-600']
        if (isProtocol) {
            return 'text-gray-400'
        }
        if (isQueryParam) {
            return queryParamColors[i % queryParamColors.length]
        }
        return path.startsWith(':')
            ? dynamicColors[i % dynamicColors.length]
            : staticColors[i % staticColors.length]
    }

    const explodePath = (path: string) => {
        const parts = path.replace(/^[/]+/gm, '').split(/\/|&|__query__/)
        let staticIndex = 0
        let dynamicIndex = 0
        let queryParamCount = 0
        let isQueryParam = false
        return parts.map(value => {
            const isProtocol = value.endsWith(':')
            const isDynamic = value.startsWith(':')
            isQueryParam ||= value.startsWith('?') || value.startsWith('&')
            if (isQueryParam) {
                queryParamCount += 1
            }
            return {
                value,
                className: getPathColor(
                    value,
                    isQueryParam
                        ? queryParamCount - 1
                        : isDynamic
                          ? dynamicIndex++
                          : staticIndex++,
                    isProtocol,
                    isQueryParam,
                ),
                isQuery: isQueryParam,
                renderAmpersand: queryParamCount === 2,
            }
        })
    }

    const parts = explodePath(value)

    return (
        <div className="flex flex-wrap whitespace-pre-wrap text-gray-400 font-mono">
            {parts.map(({ value, className, isQuery, renderAmpersand }, i) => (
                <Fragment key={value}>
                    {!isQuery &&
                        (!containsProtocol ||
                            (containsProtocol && i !== 0)) && <div>/</div>}
                    {renderAmpersand && <div className={className}>&amp;</div>}
                    <div className={className}>{value}</div>
                </Fragment>
            ))}
        </div>
    )
}
