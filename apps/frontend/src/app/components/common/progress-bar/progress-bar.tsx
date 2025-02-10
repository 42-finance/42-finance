type Props = {
  trackColor: string
  barColor: string
  percentage: number
}

export const ProgressBar: React.FC<Props> = ({ trackColor, barColor, percentage }) => {
  return (
    <div className="relative flex-1">
      <div className={`overflow-hidden h-2 md:h-4 flex rounded-sm ${trackColor}`}>
        <div style={{ width: `${percentage * 100}%`, backgroundColor: barColor }} />
      </div>
    </div>
  )
}
