import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getBalanceHistory } from 'frontend-api'
import {
  formatAccountBalance,
  formatDateDifference,
  formatDollars,
  formatPercentage,
  getMonthlyValueChange,
  getNetWorth,
  mapAccountGroupType,
  mapAccountGroupTypeToAccountSubTypes,
  mapAccountSubType,
  mapAccountSubTypeToAccountGroupType,
  mapAccountTypeToAccountSubTypes,
  mapDateRangeFilterFull,
  mapDateRangeToDate,
  todayInUtc,
  useUserTokenContext,
  valueChangeColor,
  valueChangeIcon
} from 'frontend-utils'
import { sumBy } from 'lodash'
import { useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Card, Divider, Text, useTheme } from 'react-native-paper'
import { AccountType, DateRangeFilter } from 'shared-types'

import { Account } from '../../../../../libs/frontend-types/src/account.type'
import { View } from '../common/View'
import { AccountIcon } from './AccountIcon'

type Props = {
  groupAccounts: Account[]
  allAccounts: Account[]
  dateRangeFilter?: DateRangeFilter
}

export const AccountGroup: React.FC<Props> = ({
  groupAccounts,
  allAccounts,
  dateRangeFilter = DateRangeFilter.AllTime
}) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { currencyCode } = useUserTokenContext()

  const { data: balanceHistory = [] } = useQuery({
    queryKey: [ApiQuery.BalanceHistory],
    queryFn: async () => {
      const res = await getBalanceHistory()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const [today] = useState(todayInUtc())

  const filterStartDate = useMemo(() => mapDateRangeToDate(dateRangeFilter), [dateRangeFilter])

  const type = useMemo(() => groupAccounts[0].type, [groupAccounts])

  const groupType = useMemo(() => mapAccountSubTypeToAccountGroupType(groupAccounts[0].subType), [groupAccounts])

  const subTypes = useMemo(() => mapAccountGroupTypeToAccountSubTypes(groupType), [groupType])

  const valueChange = useMemo(
    () => getMonthlyValueChange(balanceHistory, subTypes, filterStartDate, today, true, false),
    [balanceHistory, subTypes, filterStartDate, today]
  )

  const balance = useMemo(() => sumBy(groupAccounts, 'convertedBalance'), [groupAccounts])

  const isAsset = useMemo(() => type === AccountType.Asset, [type])

  const accountTypeSubTypes = useMemo(() => mapAccountTypeToAccountSubTypes(type), [type])

  const totalValue = useMemo(
    () => getNetWorth(allAccounts, accountTypeSubTypes, true, false),
    [allAccounts, accountTypeSubTypes]
  )

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <View
          style={{
            width: '100%',
            backgroundColor: 'transparent'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: 'transparent',
              paddingHorizontal: 15,
              paddingBottom: 15
            }}
          >
            <View
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                flex: 1
              }}
            >
              <Text variant="titleMedium" style={{}}>
                {mapAccountGroupType(groupType)}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Feather
                  name={valueChangeIcon(valueChange.value)}
                  size={14}
                  color={valueChangeColor(valueChange.value, type)}
                  style={{ marginTop: 1, marginRight: 2 }}
                />
                <Text variant="bodySmall" style={{ color: valueChangeColor(valueChange.value, type) }}>
                  {formatDollars(valueChange.value)} ({formatPercentage(valueChange.percentage)})
                </Text>
                <Text variant="bodySmall" style={{ marginLeft: 5, color: colors.outline }}>
                  {mapDateRangeFilterFull(dateRangeFilter)}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
            >
              <Text variant="titleMedium">{formatDollars(balance)}</Text>
              <Text variant="bodySmall" style={{ marginTop: 5 }}>
                {formatPercentage(Math.abs(balance / totalValue) * 100, 0)} of {isAsset ? 'assets' : 'liabilities'}
              </Text>
            </View>
          </View>
          {groupAccounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              onPress={() => navigation.navigate('Account', { accountId: account.id })}
            >
              <Divider />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  backgroundColor: 'transparent',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  alignItems: 'center'
                }}
              >
                <AccountIcon account={account} />
                <View
                  style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    flex: 1
                  }}
                >
                  <Text variant="titleMedium">{account.name}</Text>
                  <Text variant="bodySmall" style={{ marginTop: 5 }}>
                    {mapAccountSubType(account.subType)}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                  }}
                >
                  <Text variant="titleMedium">{formatAccountBalance(account, currencyCode)}</Text>
                  <Text variant="bodySmall" style={{ marginTop: 5 }}>
                    {formatDateDifference(account.updatedAt)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  )
}
