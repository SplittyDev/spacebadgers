type Props = {
    themes: {
        name: string,
        palette: {
            name: string,
            color: string,
        }[]
    }[]
}

export default function ThemeStrip({ themes }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {themes.map(theme => (
                <div key={theme.name} className="flex flex-col gap-2 p-4 bg-gray-100 rounded-md">
                    <div className="text-lg text-gray-700">{theme.name}</div>
                    <div className="flex gap-2">
                        {theme.palette.map(entry => (
                            <div
                                key={entry.name}
                                style={{ background: entry.color }}
                                className="flex flex-col gap-1 rounded-full w-4 h-4"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
