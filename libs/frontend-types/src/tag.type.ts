import { TagColor } from './tag-color'

export type Tag = {
  id: number
  name: string
  color: TagColor
  householdId: number
  transactionCount: number
}
