import { FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGroups } from 'frontend-api'
import { useDebounce } from 'frontend-utils/src/hooks/use-debounce.hook'
import { mapCategoryType } from 'frontend-utils/src/mappers/map-category-type'
import { useEffect, useMemo, useState } from 'react'
import { SectionList, TouchableOpacity } from 'react-native'
import { Chip, Divider, ProgressBar, Searchbar, customText, useTheme } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { View } from '../components/common/View'
import { CategoryItem } from '../components/list-items/CategoryItem'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const CategoriesScreen = ({ navigation }: RootStackScreenProps<'Categories'>) => {
  const showActionSheet = useActionSheet()
  const { colors } = useTheme()

  const [selectedFilter, setSelectedFilter] = useState<CategoryType>(CategoryType.Income)
  const [search, setSearch] = useState('')
  const [searchParam, setSearchParam] = useDebounce('', 500)

  const {
    data: groups = [],
    isFetching: fetching,
    refetch
  } = useQuery({
    queryKey: [ApiQuery.GroupsList, searchParam],
    queryFn: async () => {
      const res = await getGroups({ search: searchParam, showHidden: true })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const sections = useMemo(
    () => groups.filter((g) => g.type === selectedFilter).map((g) => ({ id: g.id, title: g.name, data: g.categories })),
    [groups, selectedFilter]
  )

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Add category',
                onSelected: () => navigation.navigate('AddCategory')
              },
              {
                label: 'Add group',
                onSelected: () => navigation.navigate('AddGroup')
              }
            ])
          }}
        >
          <FontAwesome5 name="plus" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors, navigation, showActionSheet])

  const Text = customText<'titleMediumBold'>()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >
      <ProgressBar indeterminate visible={fetching} />
      <Searchbar
        placeholder="Search"
        onChangeText={(value) => {
          setSearch(value)
          setSearchParam(value)
        }}
        value={search}
        style={{ margin: 10 }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 15,
          marginHorizontal: 10
        }}
      >
        {Object.values(CategoryType).map((type) => (
          <Chip
            key={type}
            onPress={() => {
              setSelectedFilter(type)
            }}
            theme={{ roundness: 20 }}
            style={{
              padding: 2,
              flex: 1,
              ...(selectedFilter === type ? {} : { backgroundColor: 'transparent' })
            }}
            textStyle={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1 }}
          >
            {mapCategoryType(type)}
          </Chip>
        ))}
      </View>
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <CategoryItem
            key={item.id}
            category={item}
            onSelected={(category) => {
              navigation.navigate('Category', { categoryId: category.id })
            }}
          />
        )}
        renderSectionHeader={({ section: { id, title } }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditGroup', { groupId: id })
            }}
            style={{
              flex: 1,
              alignItems: 'stretch',
              backgroundColor: colors.elevation.level2
            }}
          >
            <>
              <Divider />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  padding: 15
                }}
              >
                <Text variant="titleMediumBold" numberOfLines={1} style={{ flex: 1, fontWeight: 'bold' }}>
                  {title}
                </Text>
              </View>
              <Divider />
            </>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
