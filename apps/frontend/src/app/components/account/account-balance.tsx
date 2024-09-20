import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getBalanceHistory } from 'frontend-api'
import { Account } from 'frontend-types'
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
import { AccountSubType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { Avatar } from '../common/avatar'
import { NetWorthGraph } from '../common/chart/net-worth-graph'

type Props = {
  account: Account
}

export const AccountBalance: React.FC<Props> = ({ account }) => {
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())
  const [filterDate, setFilterDate] = useState<Date | null>(null)

  const { data: balanceHistory = [], isFetching: isFetchingBalanceHistory } = useQuery({
    queryKey: [ApiQuery.AccountBalanceHistory, account],
    queryFn: async () => {
      const res = await getBalanceHistory({ accountIds: [account.id] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const accountTypes = useMemo(() => Object.values(AccountSubType), [])

  const convertBalance = useMemo(
    () => account.subType === AccountSubType.CryptoExchange || account.subType === AccountSubType.Vehicle,
    [account]
  )

  const netWorth = useMemo(
    () => getNetWorth([account], accountTypes, convertBalance, false),
    [account, accountTypes, convertBalance]
  )

  const netWorthHistory = useMemo(() => {
    const history = getNetWorthHistory(balanceHistory, accountTypes, convertBalance, false, null)
    if (history.length === 1) {
      history.push(history[0])
    }
    return history
  }, [balanceHistory, accountTypes, convertBalance])

  const startDate = useMemo(() => netWorthHistory[0]?.date, [netWorthHistory])

  const netWorthChange = useMemo(
    () => getMonthlyValueChange(balanceHistory, accountTypes, startDate, filterDate ?? today, convertBalance, false),
    [balanceHistory, accountTypes, filterDate, startDate, convertBalance]
  )

  const netWorthData = useMemo(
    () => netWorthHistory.map(({ date, value }) => ({ y: Math.abs(value), x: dateToLocal(date).getTime() })),
    [netWorthHistory]
  )

  const changeIcon = useMemo(() => valueChangeIcon(netWorthChange.value), [netWorthChange])

  return (
    <div>
      <div className="text-xl text-center mt-4">
        {formatDollarsSigned(netWorth, account.currencyCode)}
        {account.currencyCode === currencyCode || convertBalance ? '' : ` ${account.currencyCode}`}
      </div>
      <div className="flex items-center justify-center mt-1 mb-4">
        <Avatar>{changeIcon === 'arrow-up-right' ? <FiArrowUpRight /> : <FiArrowDownLeft />}</Avatar>
        <div className="" style={{ color: valueChangeColor(netWorthChange.value, account.type) }}>
          {formatDollars(netWorthChange.value, account.currencyCode)} ({formatPercentage(netWorthChange.percentage)})
        </div>
        <div className="text-outline ml-1">
          {filterDate == null
            ? 'This Month'
            : `${formatDateInUtc(startDate, 'MMM d, yyyy')} - ${formatDateInUtc(filterDate, 'MMM d, yyyy')}`}
        </div>
      </div>
      <NetWorthGraph data={netWorthData} isLoading={isFetchingBalanceHistory} />
    </div>
  )
}
