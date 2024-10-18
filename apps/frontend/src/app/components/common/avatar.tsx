import { PropsWithChildren } from 'react'

type Props = {
  className?: string
}
export const Avatar: React.FC<PropsWithChildren<Props>> = ({ className, children }) => {
  return (
    <div
      className={`flex justify-center items-center w-9 h-9 bg-background self-center rounded-full ${className} overflow-hidden`}
    >
      {children}
    </div>
  )
}
