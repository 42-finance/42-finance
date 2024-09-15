import { formatDateInUtc, todayInUtc } from 'frontend-utils'
import { CategoryType } from 'shared-types'

import { BudgetProgress } from '../budget/budget-progress'
import { Card } from '../common/card/card'

export const BudgetWidget = () => {
  const today = todayInUtc()

  return (
    <Card title={`${formatDateInUtc(today, 'MMMM')} Budget`}>
      <BudgetProgress type={CategoryType.Income} />
      <div className="border-t" />
      <BudgetProgress type={CategoryType.Expense} />
    </Card>
  )
}
