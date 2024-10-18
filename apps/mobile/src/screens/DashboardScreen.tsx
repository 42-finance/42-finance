import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditDashboardWidgetsRequest, editDashboardWidgets, getDashboardWidgets } from 'frontend-api'
import { DashboardWidget } from 'frontend-types'
import { mapDashboardWidgetType } from 'frontend-utils'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Avatar, Button, Divider, ProgressBar, Text, useTheme } from 'react-native-paper'

import { ActivityIndicator } from '../components/common/ActivityIndicator'
import { View } from '../components/common/View'
import { DashboardWidgetList } from '../components/dashboard/DashboardWidgetList'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const DashboardScreen = ({ navigation }: RootStackScreenProps<'Dashboard'>) => {
  const queryClient = useQueryClient()
  const { colors } = useTheme()
  const [showEditWidgets, setShowEditWidgets] = useState(false)
  const [selectedWidgets, setSelectedWidgets] = useState<DashboardWidget[]>([])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowEditWidgets(true)}>
          <MaterialCommunityIcons name="widgets-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  const {
    data: widgets = [],
    isFetching,
    refetch
  } = useQuery({
    queryKey: [ApiQuery.DashboardWidgets],
    queryFn: async () => {
      const res = await getDashboardWidgets()
      if (res.ok && res.parsedBody?.payload) {
        setSelectedWidgets(res.parsedBody.payload)
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: EditDashboardWidgetsRequest) => {
      const res = await editDashboardWidgets(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.DashboardWidgets] })
        setShowEditWidgets(false)
      }
    }
  })

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<DashboardWidget>) => {
    return (
      <TouchableOpacity
        key={item.type}
        onPress={() => {
          setSelectedWidgets((oldSelectedWidgets) =>
            oldSelectedWidgets.map((w) => ({ ...w, isSelected: w.type === item.type ? !w.isSelected : w.isSelected }))
          )
        }}
        style={{
          flex: 1,
          backgroundColor: colors.elevation.level2
        }}
        onLongPress={drag}
        disabled={isActive}
      >
        <>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 20
            }}
          >
            {item.isSelected ? (
              <Avatar.Icon
                size={24}
                icon={() => <FontAwesome5 name="check" size={12} color="white" />}
                style={{ marginEnd: 15, backgroundColor: colors.primary }}
              />
            ) : (
              <Avatar.Icon size={24} icon={() => null} style={{ marginEnd: 15, backgroundColor: colors.outline }} />
            )}
            <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1 }}>
              {mapDashboardWidgetType(item.type)}
            </Text>
            <Ionicons name="menu" size={24} color={colors.onSurface} />
          </View>
          <Divider />
        </>
      </TouchableOpacity>
    )
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={isFetching} />
      <DashboardWidgetList widgets={widgets} />
      {showEditWidgets && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.elevation.level2,
            height: '60%'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: 10
            }}
          >
            <Button mode="text" onPress={() => setShowEditWidgets(false)}>
              Cancel
            </Button>
            <Text variant="bodyMedium">Customize Dashboard</Text>
            <View style={{ width: 65 }}>
              {isPending ? (
                <ActivityIndicator />
              ) : (
                <Button
                  mode="text"
                  onPress={() => mutate({ widgets: selectedWidgets.map((w, index) => ({ ...w, order: index })) })}
                >
                  Apply
                </Button>
              )}
            </View>
          </View>
          <Divider />
          <GestureHandlerRootView>
            <DraggableFlatList
              data={selectedWidgets}
              onDragEnd={({ data }) => setSelectedWidgets(data)}
              keyExtractor={(item) => item.type}
              renderItem={renderItem}
            />
          </GestureHandlerRootView>
        </View>
      )}
    </View>
  )
}
