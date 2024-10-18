import { Card, Divider, customText } from 'react-native-paper'
import { DateRangeFilter } from 'shared-types'

import { SpendingGraph } from '../stats/SpendingGraph'

export const DateSpendingWidget = () => {
  const Text = customText<'titleLargeBold'>()

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Spending By Date
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <SpendingGraph widthReduction={20} dateRangeFilter={DateRangeFilter.OneMonth} />
      </Card.Content>
    </Card>
  )
}
