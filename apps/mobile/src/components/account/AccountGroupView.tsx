import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getBalanceHistory } from 'frontend-api'
import { AccountGroup } from 'frontend-types'
import { Account } from 'frontend-types/src/account.type'
import {
  formatAccountBalance,
  formatDateDifference,
  formatDollars,
  formatPercentage,
  getMonthlyValueChange,
  getNetWorth,
  mapAccountSubType,
  mapDateRangeFilterFull,
  mapDateRangeToDate,
  todayInUtc,
  valueChangeColor,
  valueChangeIcon
} from 'frontend-utils'
import { sumBy } from 'lodash'
import { useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Card, Divider, Text, useTheme } from 'react-native-paper'
import { AccountGroupType, AccountType, DateRangeFilter } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { View } from '../common/View'
import { AccountIcon } from './AccountIcon'

type Props = {
  accountGroup: AccountGroup
  allAccounts: Account[]
  dateRangeFilter: DateRangeFilter
  showHiddenAccounts: boolean
}

export const AccountGroupView: React.FC<Props> = ({
  accountGroup,
  allAccounts,
  dateRangeFilter,
  showHiddenAccounts
}) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { currencyCode } = useUserTokenContext()

  const { data: balanceHistory = [] } = useQuery({
    queryKey: [ApiQuery.AccountGroupBalanceHistory, showHiddenAccounts, accountGroup.accounts],
    queryFn: async () => {
      const res = await getBalanceHistory({
        hideFromAccountsList: showHiddenAccounts ? undefined : false,
        accountIds: accountGroup.accounts.map((a) => a.id)
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const [today] = useState(todayInUtc())

  const filterStartDate = useMemo(() => mapDateRangeToDate(dateRangeFilter), [dateRangeFilter])

  const type = useMemo(
    () =>
      accountGroup.type === AccountGroupType.CreditCards ||
      accountGroup.type === AccountGroupType.Loans ||
      accountGroup.type === AccountGroupType.OtherLiabilities
        ? AccountType.Liability
        : AccountType.Asset,
    [accountGroup]
  )

  const valueChange = useMemo(
    () => getMonthlyValueChange(balanceHistory, null, filterStartDate, today, true, false),
    [balanceHistory, filterStartDate, today]
  )

  const filteredAccounts = useMemo(
    () => (showHiddenAccounts ? accountGroup.accounts : accountGroup.accounts.filter((a) => !a.hideFromAccountsList)),
    [accountGroup.accounts, showHiddenAccounts]
  )

  const balance = useMemo(() => sumBy(filteredAccounts, 'convertedBalance'), [filteredAccounts])

  const isAsset = useMemo(() => type === AccountType.Asset, [type])

  const totalValue = useMemo(
    () =>
      getNetWorth(
        allAccounts.filter((a) => a.type === type && !a.hideFromAccountsList),
        null,
        true,
        false
      ),
    [allAccounts, type]
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
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: 'transparent',
              paddingHorizontal: 15,
              paddingBottom: 15
            }}
            onPress={() => {
              if (accountGroup.id > 0) {
                navigation.navigate('AccountGroup', { accountGroupId: accountGroup.id })
              }
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
                {accountGroup.name}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Feather
                  name={valueChangeIcon(valueChange.value)}
                  size={14}
                  color={valueChangeColor(valueChange.value, type, colors.outline)}
                  style={{ marginTop: 1, marginRight: 2 }}
                />
                <Text variant="bodySmall" style={{ color: valueChangeColor(valueChange.value, type, colors.outline) }}>
                  {formatDollars(valueChange.value, currencyCode)} ({formatPercentage(valueChange.percentage)})
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
              <Text variant="titleMedium">{formatDollars(balance, currencyCode)}</Text>
              <Text variant="bodySmall" style={{ marginTop: 5 }}>
                {formatPercentage(totalValue === 0 ? 0 : Math.abs(balance / totalValue) * 100, 0)} of{' '}
                {isAsset ? 'assets' : 'liabilities'}
              </Text>
            </View>
          </TouchableOpacity>
          {filteredAccounts.map((account) => (
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
