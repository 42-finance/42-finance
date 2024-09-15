import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditCategoryRequest, editCategory, getCategory } from 'frontend-api'
import * as React from 'react'
import { useEffect } from 'react'
import { Keyboard, ScrollView, TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'

import { ActivityIndicator } from '../components/common/ActivityIndicator'
import { CategoryForm } from '../components/forms/CategoryForm'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditCategoryScreen = ({ route, navigation }: RootStackScreenProps<'EditCategory'>) => {
  const { categoryId } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const { data: category } = useQuery({
    queryKey: [ApiQuery.Category, categoryId],
    queryFn: async () => {
      const res = await getCategory(categoryId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditCategoryRequest) => {
      Keyboard.dismiss()
      const res = await editCategory(categoryId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        navigation.pop()
      }
    }
  })

  const { mutate: editMutation, isPending: isLoadingEdit } = useMutation({
    mutationFn: async () => {
      const res = await editCategory(categoryId, { mapToCategoryId: null })
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        navigation.pop()
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isLoadingEdit ? (
          <ActivityIndicator />
        ) : category ? (
          <TouchableOpacity
            onPress={() => {
              showActionSheet([
                category.mapToCategoryId
                  ? {
                      label: 'Enable category',
                      onSelected: () => editMutation()
                    }
                  : {
                      label: `${category.systemCategory ? 'Disable' : 'Delete'} category`,
                      onSelected: () =>
                        navigation.navigate('ReassignCategory', {
                          categoryId: category.id,
                          categoryIcon: category.icon,
                          categoryName: category.name
                        })
                    }
              ])
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        ) : null
    })
  }, [category, colors, editMutation, isLoadingEdit, navigation, showActionSheet])

  if (!category) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <ScrollView>
      <CategoryForm categoryInfo={category} onSubmit={mutate} submitting={submitting} />
    </ScrollView>
  )
}
