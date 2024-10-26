import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccountGroups, getAccounts } from 'frontend-api'
import { AccountGroup } from 'frontend-types'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Chip, ProgressBar, useTheme } from 'react-native-paper'
import { AccountGroupType, DateRangeFilter } from 'shared-types'

import { AccountGroupView } from '../components/account/AccountGroupView'
import { DateRangePicker } from '../components/common/DateRangePicker'
import { View } from '../components/common/View'
import { NetWorthGraph } from '../components/stats/NetWorthGraph'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AccountsScreen = ({ navigation }: RootStackScreenProps<'Accounts'>) => {
  const { colors } = useTheme()

  const showActionSheet = useActionSheet()
  const [selectedFilter, setSelectedFilter] = useState<AccountGroup | null>(null)
  const [selectedDateRangeFilter, setSelectedDateRangeFilter] = useState<DateRangeFilter>(DateRangeFilter.OneMonth)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Add account',
                onSelected: () => navigation.navigate('AddAsset')
              },
              {
                label: 'Add account group',
                onSelected: () => navigation.navigate('AddAccountGroup')
              }
            ])
          }}
        >
          <FontAwesome5 name="plus" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors, navigation])

  const {
    data: accounts = [],
    isFetching: fetching,
    refetch
  } = useQuery({
    queryKey: [ApiQuery.Accounts],
    queryFn: async () => {
      const res = await getAccounts()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const {
    data: accountGroups = [],
    isFetching: fetchingAccountGroups,
    refetch: refetchAccountGroups
  } = useQuery({
    queryKey: [ApiQuery.AccountGroups],
    queryFn: async () => {
      const res = await getAccountGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetchAccountGroups)

  const ungroupedAccounts = useMemo(
    () => accounts.filter((a) => a.accountGroupId == null).map((a) => ({ ...a, accountGroupId: 0 })),
    [accounts]
  )

  const ungroupedAccountGroup = useMemo(
    () => ({
      id: 0,
      name: 'Ungrouped',
      type: AccountGroupType.Other,
      accounts: ungroupedAccounts
    }),
    [ungroupedAccounts]
  )

  const getChipStyle = (accountGroup: AccountGroup | null) => {
    if (accountGroup?.id === selectedFilter?.id) {
      return {}
    }

    return {
      backgroundColor: 'transparent'
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching || fetchingAccountGroups} />
      <ScrollView style={{ marginTop: 5 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', marginBottom: 15, marginLeft: 10 }}>
            {[null, ...accountGroups].map((accountGroup) => (
              <Chip
                key={accountGroup?.id ?? 'netWorth'}
                onPress={() => setSelectedFilter(accountGroup)}
                theme={{ roundness: 20 }}
                style={{
                  padding: 2,
                  ...getChipStyle(accountGroup)
                }}
                textStyle={{ fontWeight: 'bold', fontSize: 12 }}
              >
                {accountGroup?.name.toUpperCase() ?? 'NET WORTH'}
              </Chip>
            ))}
          </View>
        </ScrollView>
        <NetWorthGraph accountGroup={selectedFilter} dateRangeFilter={selectedDateRangeFilter} />
        <DateRangePicker
          selectedDateRangeFilter={selectedDateRangeFilter}
          onSelected={(type) => setSelectedDateRangeFilter(type)}
        />
        {accountGroups.map((accountGroup) => (
          <AccountGroupView
            key={accountGroup.id}
            accountGroup={accountGroup}
            allAccounts={accounts}
            dateRangeFilter={selectedDateRangeFilter}
          />
        ))}
        {ungroupedAccounts.length > 0 && (
          <AccountGroupView
            accountGroup={ungroupedAccountGroup}
            allAccounts={accounts}
            dateRangeFilter={selectedDateRangeFilter}
          />
        )}
      </ScrollView>
    </View>
  )
}
