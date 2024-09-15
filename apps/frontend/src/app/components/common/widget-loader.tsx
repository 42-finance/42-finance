import { Card } from './card/card'
import { Loader } from './loader/loader'

export const WidgetLoader = () => {
  return (
    <Card className="min-h-[120px] max-h-[120px]">
      <Loader />
    </Card>
  )
}
