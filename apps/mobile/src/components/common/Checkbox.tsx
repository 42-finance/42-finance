import React from 'react'
import { View } from 'react-native'
import { Checkbox as PaperCheckbox, Subheading } from 'react-native-paper'

type Props = {
  label: string
  isChecked: boolean
  onPress: () => void
}

export const Checkbox: React.FC<Props> = ({ label, isChecked, onPress }) => {
  return (
    <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 5, marginBottom: 10 }}>
      <Subheading style={{ alignSelf: 'center' }}>{label}</Subheading>
      <PaperCheckbox.Android status={isChecked ? 'checked' : 'unchecked'} onPress={onPress} />
    </View>
  )
}
