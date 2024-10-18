import { formatDateInUtc, todayInUtc } from 'frontend-utils'
import { Card, Divider, Text } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { BudgetProgress } from '../budget/BudgetProgress'

export const BudgetWidget = () => {
  const today = todayInUtc()

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          {formatDateInUtc(today, 'MMMM')} Budget
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <BudgetProgress type={CategoryType.Income} />
        <Divider />
        <BudgetProgress type={CategoryType.Expense} />
      </Card.Content>
    </Card>
  )
}
