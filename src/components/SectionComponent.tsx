import type { ReactNode } from "react"

interface SectionComponentProps {
    children: ReactNode
    classNameContainer?: string
    classNameContent?: string
}

export const SectionComponent = ({ children, classNameContainer, classNameContent }: SectionComponentProps) => {
    return (
        <div className={`py-20 w-full flex  justify-center ${classNameContainer}`} id="empresas">
            <div className={`w-full max-w-4xl flex flex-col items-center justify-center gap-4 px-4 ${classNameContent}`}>
                {children}
            </div>
        </div>
    )
}
