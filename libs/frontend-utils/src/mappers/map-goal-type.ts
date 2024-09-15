import { GoalType } from 'shared-types'

export const mapGoalType = (goalType: GoalType) => {
  switch (goalType) {
    case GoalType.Savings:
      return 'Savings'
    case GoalType.Debt:
      return 'Debt'
  }
}
