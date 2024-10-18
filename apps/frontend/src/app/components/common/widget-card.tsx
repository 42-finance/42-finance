import { Card } from './card/card'

export const WidgetCard = (props: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <Card className="min-h-[120px] max-h-[120px]" hoverable={props.onClick !== undefined} onClick={props.onClick}>
      {props.children}
    </Card>
  )
}
