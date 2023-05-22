import Image from "next/image"
import Path from "./Path"
import { RefObject, useEffect, useMemo, useState } from "react"

type Props = {
    name: string,
    path: string,
    inject: string[],
}

// function useOnScreen(ref: RefObject<HTMLElement>) {
//     const [isIntersecting, setIntersecting] = useState(false)

//     const observer = useMemo(() => new IntersectionObserver(
//         ([entry]) => setIntersecting(entry.isIntersecting)
//     ), [ref])


//     useEffect(() => {
//         observer.observe(ref.current)
//         return () => observer.disconnect()
//     }, [])

//     return isIntersecting
// }

const isDevelopment = process.env.NODE_ENV === 'development'

export default function BadgeEndpoint({ name, path, inject }: Props) {
    const buildUrl = () => {
        const proto = process.env.NEXT_PUBLIC_WEB_PROTO
        const host = process.env.NEXT_PUBLIC_WEB_HOST
        const baseUrl = `${proto}://${host}`
        const injectables = path.split('/').filter((part) => part.startsWith(':'))
        const injectionTable = Object.fromEntries(injectables.map((part, i) => [part, inject[i]]))
        const examplePath = path.replace(/:[^/]+/g, (match) => injectionTable[match])
        if (isDevelopment) return `${baseUrl}/${examplePath}?bust=${Date.now()}`
        return `${baseUrl}/${examplePath}`
    }

    return (
        <>
            <div className="text-gray-700 text-sm py-2 pl-2 w-16 sm:w-24 md:w-28 lg:w-48">{name}</div>
            <div className="text-xs sm:text-sm cursor-pointer">
                <Path value={path} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-[200px] h-[20px] object-left object-scale-down" src={buildUrl()} alt={path} />
        </>
    )
}
