import { Button, useTheme } from 'react-native-paper'

import { View } from './View'

type Props = {
  applyText: string
  onClear: () => void
  onApply: () => void
  disabled?: boolean
}

export const BottomActionView: React.FC<Props> = ({ applyText, onClear, onApply, disabled }) => {
  const { colors } = useTheme()

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        paddingVertical: 20
      }}
    >
      <Button mode="text" onPress={onClear}>
        Clear All
      </Button>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent'
        }}
      />
      <Button mode="contained" style={{ marginRight: 10 }} onPress={onApply} disabled={disabled}>
        {applyText}
      </Button>
    </View>
  )
}
