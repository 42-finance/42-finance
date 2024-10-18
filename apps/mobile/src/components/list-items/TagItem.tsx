import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { Tag } from 'frontend-types'
import { mapTagColorToHex } from 'frontend-utils'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

type Props = {
  tag: Tag
  onSelected: (tag: Tag) => void
  index?: number
  isSelecting?: boolean
  isSelected?: boolean
}

export const TagItem = ({ tag, onSelected, index, isSelecting, isSelected }: Props) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(tag)
      }}
      style={{
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: colors.elevation.level2
      }}
    >
      <>
        {index != null && index > 0 && <Divider style={{ height: 1, backgroundColor: '#082043' }} />}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: 'transparent',
            alignItems: 'center',
            padding: 20
          }}
        >
          {isSelecting && (
            <>
              {isSelected ? (
                <Avatar.Icon
                  size={24}
                  icon={() => <FontAwesome5 name="check" size={12} color="white" />}
                  style={{ marginEnd: 15, backgroundColor: colors.primary }}
                />
              ) : (
                <Avatar.Icon size={24} icon={() => null} style={{ marginEnd: 15, backgroundColor: colors.outline }} />
              )}
            </>
          )}
          <View
            style={{
              backgroundColor: mapTagColorToHex(tag.color),
              borderRadius: 100,
              width: 15,
              height: 15,
              marginRight: 10
            }}
          />
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" numberOfLines={1}>
              {tag.name}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.outline }}>
              {tag.transactionCount} transactions
            </Text>
          </View>
          {!isSelecting && <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />}
        </View>
      </>
    </TouchableOpacity>
  )
}
