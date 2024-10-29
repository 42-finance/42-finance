import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccountGroups, getAccounts } from 'frontend-api'
import { useMemo } from 'react'
import { AccountGroupType } from 'shared-types'

import { AccountGroupView } from './account-group-view'

type Props = {
  onSelected: () => void
}

export const AccountList: React.FC<Props> = ({ onSelected }) => {
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

  const ungroupedAccounts = useMemo(
    () => accounts.filter((a) => a.accountGroupId == null).map((a) => ({ ...a, accountGroupId: 0 })),
    [accounts]
  )

  const ungroupedAccountGroup = useMemo(
    () => ({
      id: 0,
      name: 'Ungrouped',
      type: AccountGroupType.Other,
      hideFromAccountsList: false,
      hideFromNetWorth: false,
      hideFromBudget: false,
      accounts: ungroupedAccounts
    }),
    [ungroupedAccounts]
  )

  return (
    <div className="flex flex-col h-full p-4">
      {accountGroups.map((accountGroup) => (
        <AccountGroupView
          key={accountGroup.id}
          accountGroup={accountGroup}
          allAccounts={accounts}
          onSelected={onSelected}
        />
      ))}
      {ungroupedAccounts.length > 0 && (
        <AccountGroupView accountGroup={ungroupedAccountGroup} allAccounts={accounts} onSelected={onSelected} />
      )}
    </div>
  )
}
