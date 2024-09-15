import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getBalanceHistory } from 'frontend-api'
import { Account } from 'frontend-types'
import {
  formatAccountBalance,
  formatDollars,
  formatPercentage,
  getMonthlyValueChange,
  getNetWorth,
  mapAccountGroupType,
  mapAccountGroupTypeToAccountSubTypes,
  mapAccountSubType,
  mapAccountSubTypeToAccountGroupType,
  mapAccountTypeToAccountSubTypes,
  useUserTokenContext,
  valueChangeColor
} from 'frontend-utils'
import { formatDateDifference } from 'frontend-utils/src/date/date.utils'
import { sumBy } from 'lodash'
import { useMemo } from 'react'
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { AccountType } from 'shared-types'

import { AccountIcon } from './account-icon'

type Props = {
  groupAccounts: Account[]
  allAccounts: Account[]
  onSelected: () => void
}

export const AccountGroup: React.FC<Props> = ({ groupAccounts, allAccounts, onSelected }) => {
  const navigate = useNavigate()
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

  const type = useMemo(() => groupAccounts[0].type, [groupAccounts])

  const groupType = useMemo(() => mapAccountSubTypeToAccountGroupType(groupAccounts[0].subType), [groupAccounts])

  const subTypes = useMemo(() => mapAccountGroupTypeToAccountSubTypes(groupType), [groupType])

  const valueChange = useMemo(
    () => getMonthlyValueChange(balanceHistory, subTypes, null, null, true, false),
    [balanceHistory, subTypes]
  )

  const balance = useMemo(() => sumBy(groupAccounts, 'convertedBalance'), [groupAccounts])

  const isAsset = useMemo(() => type === AccountType.Asset, [type])

  const accountTypeSubTypes = useMemo(() => mapAccountTypeToAccountSubTypes(type), [type])

  const totalValue = useMemo(
    () => getNetWorth(allAccounts, accountTypeSubTypes, true, false),
    [allAccounts, accountTypeSubTypes]
  )

  return (
    <div className="flex flex-col rounded-md shadow-md mb-4">
      <div className="flex justify-between p-3">
        <div className="flex flex-col">
          {mapAccountGroupType(groupType)}
          <div className="flex items-center">
            {valueChange.value >= 0 || type === AccountType.Liability ? (
              <FiArrowUpRight size={14} color={valueChangeColor(valueChange.value, type)} className="mt-[3px]" />
            ) : (
              <FiArrowDownLeft size={14} color={valueChangeColor(valueChange.value, type)} className="mt-[3px]" />
            )}
            <div style={{ color: valueChangeColor(valueChange.value, type) }} className="text-xs mt-1">
              {formatDollars(valueChange.value)} ({formatPercentage(valueChange.percentage)}){' '}
              <span className="text-gray-500">This Month</span>
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-right">{formatDollars(balance)}</div>
          <div className="text-xs text-right mt-1">
            {formatPercentage(Math.abs(balance / totalValue) * 100, 0)} of {isAsset ? 'assets' : 'liabilities'}
          </div>
        </div>
      </div>
      {groupAccounts.map((account) => (
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
