import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts, getBalanceHistory } from 'frontend-api'
import { AccountGroup } from 'frontend-types'
import {
  dateToLocal,
  formatDateInUtc,
  formatDollars,
  formatDollarsSigned,
  formatPercentage,
  getMonthlyValueChange,
  getNetWorth,
  getNetWorthHistory,
  todayInUtc,
  valueChangeColor,
  valueChangeIcon
} from 'frontend-utils'
import { useMemo, useState } from 'react'
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi'
import { AccountGroupType, AccountType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { Avatar } from '../common/avatar'
import { Card } from '../common/card/card'
import { NetWorthGraph } from '../common/chart/net-worth-graph'

type Props = {
  accountGroup?: AccountGroup | null
}

export const NetWorth: React.FC<Props> = ({ accountGroup = null }) => {
  const [today] = useState(todayInUtc())
  const [netWorthOverride, setNetWorthOverride] = useState<number | null>(null)
  const [filterDate, setFilterDate] = useState<Date | null>(null)
  const { currencyCode } = useUserTokenContext()

  const { data: accounts = [], isFetching: isFetchingAccounts } = useQuery({
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

  const { data: balanceHistory = [], isFetching: isFetchingBalanceHistory } = useQuery({
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

  const netWorth = useMemo(
    () => getNetWorth(accounts, accountGroup, true, accountGroup == null),
    [accounts, accountGroup]
  )

  const netWorthHistory = useMemo(() => {
    const history = getNetWorthHistory(balanceHistory, accountGroup, true, accountGroup == null, null)
    if (history.length === 0) {
      history.push({ date: today, value: netWorth })
    }
    if (history.length === 1) {
      history.push(history[0])
    }
    return history
  }, [balanceHistory, accountGroup])

  const startDate = useMemo(() => netWorthHistory[0]?.date, [netWorthHistory])

  const netWorthChange = useMemo(
    () =>
      getMonthlyValueChange(balanceHistory, accountGroup, startDate, filterDate ?? today, true, accountGroup == null),
    [balanceHistory, accountGroup, startDate, filterDate]
  )

  const netWorthData = useMemo(
    () => netWorthHistory.map(({ date, value }) => ({ y: Math.abs(value), x: dateToLocal(date).getTime() })),
    [netWorthHistory]
  )

  const netWorthValue = useMemo(() => netWorthOverride ?? netWorth, [netWorth, netWorthOverride])

  const changeIcon = useMemo(() => valueChangeIcon(netWorthChange.value), [netWorthChange])

  return (
    <Card title="Net Worth">
      <div>
        <div className="text-xl text-center mt-4">{formatDollarsSigned(netWorthValue, currencyCode)}</div>
        <div className="flex items-center justify-center mt-1 mb-4">
          <Avatar>{changeIcon === 'arrow-up-right' ? <FiArrowUpRight /> : <FiArrowDownLeft />}</Avatar>
          <div
            className=""
            style={{
              color: valueChangeColor(
                netWorthChange.value,
                accountGroup?.type === AccountGroupType.CreditCards ||
                  accountGroup?.type === AccountGroupType.Loans ||
                  accountGroup?.type === AccountGroupType.OtherLiabilities
                  ? AccountType.Liability
                  : AccountType.Asset
              )
            }}
          >
            {formatDollars(netWorthChange.value, currencyCode)} ({formatPercentage(netWorthChange.percentage)})
          </div>
          <div className="text-outline ml-1">
            {filterDate == null
              ? 'This Month'
              : `${formatDateInUtc(startDate, 'MMM d, yyyy')} - ${formatDateInUtc(filterDate, 'MMM d, yyyy')}`}
          </div>
        </div>
        <NetWorthGraph data={netWorthData} isLoading={isFetchingAccounts || isFetchingBalanceHistory} />
      </div>
    </Card>
  )
}
