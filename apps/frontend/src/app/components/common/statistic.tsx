type Props = {
  title: React.ReactNode
  value?: React.ReactNode
  color?: string
  className?: string
}

export const Statistic: React.FC<Props> = ({ title, value, color = 'lighter-green', className }) => {
  let val = value

  if (typeof value === 'number') {
    val = value.toLocaleString()
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="font-semibold text-base text-midnight-blue">{title}</div>
      <div className={`font-semibold text-3xl mt-2 ${color}`}>{val}</div>
    </div>
  )
}
