import { GoalType } from 'shared-types'

import { Account } from './account.type'

export type Goal = {
  id: number
  name: string
  amount: number
  accounts: Account[]
  type: GoalType
  startDate: Date | null
  targetDate: Date | null
  budgetAmount: number | null
}
