import { Card, Divider, customText } from 'react-native-paper'
import { ReportDateFilter } from 'shared-types'

import { DateSpending } from '../stats/DateSpending'

export const DateSpendingWidget = () => {
  const Text = customText<'titleLargeBold'>()

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Spending By Date
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <DateSpending dateFilter={ReportDateFilter.Monthly} />
      </Card.Content>
    </Card>
  )
}
