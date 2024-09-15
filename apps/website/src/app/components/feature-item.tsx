import { ReactNode } from 'react'

type Props = {
  image: string
  icon: ReactNode
  heading: string
  description: string
  reverse?: boolean
}

export const FeatureItem: React.FC<Props> = ({ image, icon, heading, description, reverse }) => {
  return (
    <div
      className={`flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} lg:gap-24 items-center border-b last:border-0 pb-12 lg:pb-0 last:pb-0 px-4`}
    >
      <div className="flex flex-1" />
      <img src={image} className="md:max-w-[50%] md:max-h-[600px] rounded-xl" />
      <div className="flex flex-col items-center lg:items-start gap-6 md:max-w-[50%]">
        <div className="bg-black p-4 rounded-full w-fit">{icon}</div>
        <div className="text-3xl md:text-4xl text-center lg:text-left font-semibold">{heading}</div>
        <div className="text-xl md:text-2xl text-center lg:text-left">{description}</div>
      </div>
      <div className="flex flex-1" />
    </div>
  )
}
