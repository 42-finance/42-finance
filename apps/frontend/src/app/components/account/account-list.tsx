import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccountGroups, getAccounts } from 'frontend-api'
import { useMemo, useState } from 'react'
import { AccountGroupType, AccountType, DateRangeFilter } from 'shared-types'

import { AccountGroupView } from './account-group-view'

type Props = {
  onSelected: () => void
}

export const AccountList: React.FC<Props> = ({ onSelected }) => {
  const [selectedDateRangeFilter, setSelectedDateRangeFilter] = useState<DateRangeFilter>(DateRangeFilter.OneMonth)
  const [showHiddenAccounts, setShowHiddenAccounts] = useState(true)

  const { data: accounts = [] } = useQuery({
    queryKey: [ApiQuery.Accounts],
    queryFn: async () => {
      const res = await getAccounts()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const { data: accountGroups = [] } = useQuery({
    queryKey: [ApiQuery.AccountGroups],
    queryFn: async () => {
      const res = await getAccountGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const ungroupedAssetAccounts = useMemo(
    () =>
      accounts
        .filter((a) => a.accountGroupId == null && a.type === AccountType.Asset)
        .map((a) => ({ ...a, accountGroupId: 0 })),
    [accounts]
  )

  const ungroupedLiabilityAccounts = useMemo(
    () =>
      accounts
        .filter((a) => a.accountGroupId == null && a.type === AccountType.Liability)
        .map((a) => ({ ...a, accountGroupId: 0 })),
    [accounts]
  )

  const ungroupedAssetsAccountGroup = useMemo(
    () => ({
      id: 0,
      name: 'Ungrouped Assets',
      type: AccountGroupType.OtherAssets,
      hideFromAccountsList: false,
      hideFromNetWorth: false,
      hideFromBudget: false,
      accounts: ungroupedAssetAccounts
    }),
    [ungroupedAssetAccounts]
  )

  const ungroupedLiabilitiesAccountGroup = useMemo(
    () => ({
      id: 0,
      name: 'Ungrouped Liabilities',
      type: AccountGroupType.OtherLiabilities,
      hideFromAccountsList: false,
      hideFromNetWorth: false,
      hideFromBudget: false,
      accounts: ungroupedLiabilityAccounts
    }),
    [ungroupedLiabilityAccounts]
  )

  return (
    <div className="flex flex-col h-full p-4">
      {accountGroups.map((accountGroup) => (
        <AccountGroupView
          key={accountGroup.id}
          accountGroup={accountGroup}
          allAccounts={accounts}
          dateRangeFilter={selectedDateRangeFilter}
          showHiddenAccounts={showHiddenAccounts}
          onSelected={onSelected}
        />
      ))}
      {ungroupedAssetAccounts.length > 0 && (
        <AccountGroupView
          accountGroup={ungroupedAssetsAccountGroup}
          allAccounts={accounts}
          dateRangeFilter={selectedDateRangeFilter}
          showHiddenAccounts={showHiddenAccounts}
          onSelected={onSelected}
        />
      )}
      {ungroupedLiabilityAccounts.length > 0 && (
        <AccountGroupView
          accountGroup={ungroupedLiabilitiesAccountGroup}
          allAccounts={accounts}
          dateRangeFilter={selectedDateRangeFilter}
          showHiddenAccounts={showHiddenAccounts}
          onSelected={onSelected}
        />
      )}
    </div>
  )
}
