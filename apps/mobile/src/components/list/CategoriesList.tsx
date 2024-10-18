import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGroups } from 'frontend-api'
import { useMemo, useState } from 'react'
import { SectionList } from 'react-native'
import { ProgressBar, Searchbar, Text, useTheme } from 'react-native-paper'

import { Category } from '../../../../../libs/frontend-types/src/category.type'
import { View } from '../common/View'
import { CategoryItem } from '../list-items/CategoryItem'

type Props = {
  onSelected: (category: Category) => void
  isSelecting?: boolean
  showHidden?: boolean
  excludeCategoryId?: number
  flex?: boolean
  categoryIds?: number[]
}

export const CategoriesList: React.FC<Props> = ({
  onSelected,
  showHidden,
  excludeCategoryId,
  isSelecting,
  flex = true,
  categoryIds = []
}) => {
  const { colors } = useTheme()

  const [search, setSearch] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(categoryIds)

  const { data: groups = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Groups, search],
    queryFn: async () => {
      const res = await getGroups({ search, showHidden })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const sections = useMemo(
    () =>
      groups.map((g) => ({
        title: g.name,
        data: g.categories
          .filter((c) => !excludeCategoryId || c.id !== excludeCategoryId)
          .filter((c) => showHidden || !c.mapToCategoryId)
      })),
    [groups, showHidden, excludeCategoryId]
  )

  return (
    <View style={{ flex: flex ? 1 : undefined }}>
      <ProgressBar indeterminate visible={fetching} />
      <Searchbar placeholder="Search" onChangeText={setSearch} value={search} style={{ margin: 10 }} />
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <CategoryItem
            key={item.id}
            category={item}
            onSelected={() => {
              setSelectedCategoryIds((oldCategoryIds) =>
                oldCategoryIds.find((c) => c === item.id)
                  ? oldCategoryIds.filter((c) => c !== item.id)
                  : [...oldCategoryIds, item.id]
              )
              onSelected(item)
            }}
            isSelecting={isSelecting}
            isSelected={selectedCategoryIds.find((c) => c === item.id) != null}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ padding: 10, backgroundColor: colors.surface }}>{title}</Text>
        )}
      />
    </View>
  )
}
