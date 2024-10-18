import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts } from 'frontend-api'
import { mapAccountSubTypeToAccountGroupType } from 'frontend-utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { AccountGroupType } from 'shared-types'

import { AccountGroup } from './account-group'

type Props = {
  onSelected: () => void
}

export const AccountList: React.FC<Props> = ({ onSelected }) => {
  const { data: accounts = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Accounts],
    queryFn: async () => {
      const res = await getAccounts()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

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
    <div className="flex flex-col h-full p-4">
      {accountGroups.map((accountGroup) => (
        <AccountGroup
          key={accountGroup.groupType}
          groupAccounts={accountGroup.accounts}
          allAccounts={accounts}
          onSelected={onSelected}
        />
      ))}
    </div>
  )
}
