import { Entypo } from '@expo/vector-icons'
import { Tag } from 'frontend-types'
import { mapTagColorToHex } from 'frontend-utils'
import { TouchableOpacity, View } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'

type Props = {
  tag: Tag
  onDelete: (tag: Tag) => void
}

export const TagFilterSelection = ({ tag, onDelete }: Props) => {
  const { colors } = useTheme()

  return (
    <>
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          backgroundColor: 'transparent',
          alignItems: 'center',
          padding: 15
        }}
      >
        <View
          style={{
            backgroundColor: mapTagColorToHex(tag.color),
            borderRadius: 100,
            width: 15,
            height: 15,
            marginRight: 10
          }}
        />
        <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1 }}>
          {tag.name}
        </Text>
        <TouchableOpacity onPress={() => onDelete(tag)}>
          <Entypo name="cross" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
    </>
  )
}
