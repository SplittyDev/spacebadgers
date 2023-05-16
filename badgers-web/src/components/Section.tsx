type Props = {
    name: string,
    children: React.ReactNode,
}

export default function Section({ name, children }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg text-gray-600">{name}</h3>
            <div className="flex flex-col ps-2 border-l-[3px]">
                {children}
            </div>
        </div>
    )
}
