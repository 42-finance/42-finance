import { GoalType } from 'shared-types'

export const mapGoalType = (goalType: GoalType) => {
  switch (goalType) {
    case GoalType.Debt:
      return 'Debt'
    case GoalType.Savings:
      return 'Savings'
    case GoalType.Spending:
      return 'Spending'
  }
}
