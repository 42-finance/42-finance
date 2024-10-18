import { eventEmitter } from 'frontend-utils'
import * as React from 'react'

import { CategoriesList } from '../components/list/CategoriesList'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const CategoryRuleScreen = ({ navigation, route }: RootStackScreenProps<'CategoryRule'>) => {
  const { eventName } = route.params

  return (
    <CategoriesList
      onSelected={(category) => {
        eventEmitter.emit(eventName, category)
        navigation.pop()
      }}
    />
  )
}
