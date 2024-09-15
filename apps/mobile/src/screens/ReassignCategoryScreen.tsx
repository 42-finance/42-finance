import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteCategory } from 'frontend-api'
import { Portal, Text } from 'react-native-paper'

import { Category } from '../../../../libs/frontend-types/src/category.type'
import { ActivityIndicator } from '../components/common/ActivityIndicator'
import { View } from '../components/common/View'
import { CategoriesList } from '../components/list/CategoriesList'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const ReassignCategoryScreen = ({ navigation, route }: RootStackScreenProps<'ReassignCategory'>) => {
  const { categoryId, categoryIcon, categoryName } = route.params

  const queryClient = useQueryClient()

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async (category: Category) => {
      const res = await deleteCategory(categoryId, { mapToCategoryId: category.id })
      if (res.ok && res.parsedBody?.payload) {
        navigation.navigate('Categories')
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
      }
    }
  })

  return (
    <View>
      <Text variant="bodyLarge" style={{ marginHorizontal: 15, marginTop: 15 }}>
        You will no longer see {categoryIcon} {categoryName} as a category anywhere in the app including budgets, cash
        flow or transactions.
      </Text>

      <Text variant="bodyLarge" style={{ marginHorizontal: 15, marginVertical: 10 }}>
        Where would you like any existing transactions and rules to be reassigned? Any new transactions that would be
        placed in this category will also be assigned to the selected category.
      </Text>

      <CategoriesList onSelected={(category) => deleteMutation(category)} excludeCategoryId={categoryId} flex={false} />

      {loadingDelete && (
        <Portal>
          <View style={{ flex: 1, zIndex: 100, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        </Portal>
      )}
    </View>
  )
}
