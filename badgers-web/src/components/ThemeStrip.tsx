type Props = {
    themes: string[]
}

const isDevelopment = process.env.NODE_ENV === 'development'

export default function ThemeStrip({ themes }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {themes.map(theme => {
                const name = theme === 'honey' ? 'honey (default)' : theme
                const bust = isDevelopment ? `?bust=${Date.now()}` : ''
                const url = `${process.env.NEXT_PUBLIC_API_PROTO}://${process.env.NEXT_PUBLIC_API_HOST}/theme/${theme}${bust}`
                return (
                    <div
                        key={theme}
                        className="flex flex-col gap-2 px-3 py-2 bg-gray-100 rounded-md"
                    >
                        <div className="text-gray-700 font-mono">{name}</div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="w-[220px] h-[20px] rounded-[.25rem]"
                            alt={theme}
                            width="220"
                            height="20"
                            src={url}
                        />
                    </div>
                )
            })}
        </div>
    )
}
