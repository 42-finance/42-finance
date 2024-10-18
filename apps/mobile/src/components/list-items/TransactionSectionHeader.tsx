import { formatDateInUtc } from 'frontend-utils'
import { memo } from 'react'
import { Text, useTheme } from 'react-native-paper'

type Props = {
  title: string
}

const TSH = ({ title }: Props) => {
  const { colors } = useTheme()

  // const count = useRef(0)
  // count.current++
  // console.log(count.current, title)

  return (
    <Text style={{ padding: 10, backgroundColor: colors.surface }}>
      {formatDateInUtc(new Date(title), 'MMMM d, yyyy')}
    </Text>
  )
}

export const TransactionSectionHeader = memo(TSH)
