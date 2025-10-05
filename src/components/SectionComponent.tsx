import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface SectionComponentProps {
    id?: string
    children: ReactNode
    classNameContainer?: string
    classNameContent?: string
}

export const SectionComponent = ({ id, children, classNameContainer = "", classNameContent = "" }: SectionComponentProps) => {
    return (
        <div className={twMerge("py-20 w-full flex justify-center", classNameContainer)} id={id}>
            <div className={twMerge(`w-full max-w-4xl flex flex-col items-center justify-center gap-4 px-4`, classNameContent)}>
                {children}
            </div>
        </div>
    )
}
