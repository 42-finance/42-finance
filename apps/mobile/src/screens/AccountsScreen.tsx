import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts } from 'frontend-api'
import {
  mapAccountGroupType,
  mapAccountSubTypeToAccountGroupType
} from 'frontend-utils/src/mappers/map-account-group-type'
import _ from 'lodash'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Chip, ProgressBar, useTheme } from 'react-native-paper'
import { AccountGroupType, DateRangeFilter } from 'shared-types'

import { AccountGroup } from '../components/account/AccountGroup'
import { DateRangePicker } from '../components/common/DateRangePicker'
import { View } from '../components/common/View'
import { NetWorthGraph } from '../components/stats/NetWorthGraph'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AccountsScreen = ({ navigation }: RootStackScreenProps<'Accounts'>) => {
  const { colors } = useTheme()

  const [selectedFilter, setSelectedFilter] = useState<AccountGroupType | null>(null)
  const [selectedDateRangeFilter, setSelectedDateRangeFilter] = useState<DateRangeFilter>(DateRangeFilter.OneMonth)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddAsset')}>
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

  const allGroupTypes = useMemo(() => Object.values(AccountGroupType), [])

  const accountGroups = useMemo(
    () =>
      _.chain(accounts.map((a) => ({ ...a, groupType: mapAccountSubTypeToAccountGroupType(a.subType) })))
        .groupBy('groupType')
        .map((value, key) => ({ groupType: key as AccountGroupType, accounts: value }))
        .sort((a1, a2) => allGroupTypes.indexOf(a1.groupType) - allGroupTypes.indexOf(a2.groupType))
        .value(),
    [accounts, allGroupTypes]
  )

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <ScrollView style={{ marginTop: 5 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', marginBottom: 15, marginLeft: 10 }}>
            {[null, ...Object.values(AccountGroupType)].map((type) => (
              <Chip
                key={type}
                onPress={() => setSelectedFilter(type)}
                theme={{ roundness: 20 }}
                style={{
                  padding: 2,
                  ...(selectedFilter === type ? {} : { backgroundColor: 'transparent' })
                }}
                textStyle={{ fontWeight: 'bold', fontSize: 12 }}
              >
                {mapAccountGroupType(type).toUpperCase()}
              </Chip>
            ))}
          </View>
        </ScrollView>
        <NetWorthGraph accountGroupType={selectedFilter} dateRangeFilter={selectedDateRangeFilter} />
        <DateRangePicker
          selectedDateRangeFilter={selectedDateRangeFilter}
          onSelected={(type) => setSelectedDateRangeFilter(type)}
        />
        {accountGroups.map((accountGroup) => (
          <AccountGroup
            key={accountGroup.groupType}
            groupAccounts={accountGroup.accounts}
            allAccounts={accounts}
            dateRangeFilter={selectedDateRangeFilter}
          />
        ))}
      </ScrollView>
    </View>
  )
}
