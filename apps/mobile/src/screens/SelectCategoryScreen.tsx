import { eventEmitter } from 'frontend-utils'

import { CategoriesList } from '../components/list/CategoriesList'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SelectCategoryScreen = ({ navigation, route }: RootStackScreenProps<'SelectCategory'>) => {
  const { categoryIds, eventName, multiple } = route.params

  return (
    <CategoriesList
      onSelected={(category) => {
        eventEmitter.emit(eventName, category)
        if (!multiple) {
          navigation.pop()
        }
      }}
      isSelecting={multiple}
      categoryIds={categoryIds}
    />
  )
}
