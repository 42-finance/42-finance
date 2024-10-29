import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { subMonths } from 'date-fns'
import { ApiQuery, getBalanceHistory } from 'frontend-api'
import { Account, AccountGroup } from 'frontend-types'
import {
  formatAccountBalance,
  formatDollars,
  formatPercentage,
  getMonthlyValueChange,
  getNetWorth,
  mapAccountSubType,
  valueChangeColor
} from 'frontend-utils'
import { formatDateDifference, todayInUtc } from 'frontend-utils/src/date/date.utils'
import { sumBy } from 'lodash'
import { useMemo, useState } from 'react'
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { AccountGroupType, AccountType, DateRangeFilter } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { AccountIcon } from './account-icon'

type Props = {
  accountGroup: AccountGroup
  allAccounts: Account[]
  dateRangeFilter: DateRangeFilter
  showHiddenAccounts: boolean
  onSelected: () => void
}

export const AccountGroupView: React.FC<Props> = ({
  accountGroup,
  allAccounts,
  dateRangeFilter,
  showHiddenAccounts,
  onSelected
}) => {
  const navigate = useNavigate()
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

  const filterStartDate = useMemo(() => subMonths(today, 1), [])

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

  const balance = useMemo(() => sumBy(accountGroup.accounts, 'convertedBalance'), [accountGroup])

  const isAsset = useMemo(() => type === AccountType.Asset, [type])

  const totalValue = useMemo(
    () =>
      getNetWorth(
        allAccounts.filter((a) => a.type === type),
        null,
        true,
        false
      ),
    [allAccounts, type]
  )

  return (
    <div className="flex flex-col rounded-md shadow-md mb-4">
      <div className="flex justify-between p-3">
        <div className="flex flex-col">
          {accountGroup.name}
          <div className="flex items-center">
            {valueChange.value >= 0 || type === AccountType.Liability ? (
              <FiArrowUpRight size={14} color={valueChangeColor(valueChange.value, type)} className="mt-[3px]" />
            ) : (
              <FiArrowDownLeft size={14} color={valueChangeColor(valueChange.value, type)} className="mt-[3px]" />
            )}
            <div style={{ color: valueChangeColor(valueChange.value, type) }} className="text-xs mt-1">
              {formatDollars(valueChange.value, currencyCode)} ({formatPercentage(valueChange.percentage)}){' '}
              <span className="text-gray-500">This Month</span>
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-right">{formatDollars(balance, currencyCode)}</div>
          <div className="text-xs text-right mt-1">
            {formatPercentage(totalValue === 0 ? 0 : Math.abs(balance / totalValue) * 100, 0)} of{' '}
            {isAsset ? 'assets' : 'liabilities'}
          </div>
        </div>
      </div>
      {accountGroup.accounts.map((account) => (
        <div
          className="flex w-full p-3 items-center border-t cursor-pointer hover:opacity-75"
          key={account.id}
          onClick={() => {
            navigate(`/accounts/${account.id}`)
            onSelected()
          }}
        >
          <AccountIcon account={account} />
          <div className="justify-center grow">
            <div className="">{account.name}</div>
            <div className="text-xs mt-1">{mapAccountSubType(account.subType)}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-right">{formatAccountBalance(account, currencyCode)}</div>
            <div className="text-xs text-right mt-1">{formatDateDifference(account.updatedAt)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
