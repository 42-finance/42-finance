import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Menu, useTheme } from 'react-native-paper'

type Props = {
  onSelectTransactions: () => void
}

export const TransactionsMenu: React.FC<Props> = ({ onSelectTransactions }: Props) => {
  const { colors } = useTheme()
  const [visible, setVisible] = React.useState(false)

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onPrimary} />
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          setVisible(false)
          onSelectTransactions()
        }}
        title="Select Transactions"
      />
    </Menu>
  )
}
