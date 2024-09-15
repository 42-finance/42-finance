import { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  icon: ReactNode
}

export const RoadmapItem: React.FC<Props> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col p-8 gap-4 rounded-lg border shadow-md">
      <div className="flex bg-black p-4 rounded-full w-fit">{icon}</div>
      <div className="text-3xl font-semibold">{title}</div>
      <div className="text-xl">{description}</div>
    </div>
  )
}
