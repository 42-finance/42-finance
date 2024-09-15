import { memo } from 'react'
import { FlatList } from 'react-native'
import { useTheme } from 'react-native-paper'

import { Transaction } from '../../../../../libs/frontend-types/src/transaction.type'
import { TransactionItem } from '../list-items/TransactionItem'

type Props = {
  transactions: Transaction[]
  isSelecting: boolean
  selectedIds: string[]
  onSelected: (transaction: Transaction) => void
  onEndReached: () => void
}

const TL: React.FC<Props> = ({ transactions, isSelecting, selectedIds, onSelected, onEndReached }) => {
  const { colors } = useTheme()

  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => (
        <TransactionItem
          key={item.id}
          transaction={item}
          isSelecting={isSelecting}
          isSelected={selectedIds.includes(item.id)}
          onSelected={onSelected}
          backgroundColor={colors.elevation.level2}
          showAccount
          showDate
        />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  )
}

export const TransactionsList = memo(TL)
