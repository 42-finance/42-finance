import { Card, Divider, customText } from 'react-native-paper'
import { ReportDateFilter } from 'shared-types'

import { CategorySpendingGraph } from '../stats/CategorySpendingGraph'

export const CategorySpendingWidget = () => {
  const Text = customText<'titleLargeBold'>()

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Spending By Category
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <CategorySpendingGraph dateFilter={ReportDateFilter.Monthly} />
      </Card.Content>
    </Card>
  )
}
