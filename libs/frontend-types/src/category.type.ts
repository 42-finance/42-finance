import { SystemCategory } from 'shared-types'

import { Group } from './group.type'

export type Category = {
  id: number
  name: string
  systemCategory: SystemCategory | null
  icon: string
  mapToCategoryId: number | null
  hideFromBudget: boolean
  rolloverBudget: boolean
  groupId: number
  group: Group
}
