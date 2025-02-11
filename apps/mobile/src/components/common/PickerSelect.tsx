import { Picker, PickerProps } from '@react-native-picker/picker'
import { useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  Modal,
  ModalProps,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native'
import { useTheme } from 'react-native-paper'

type PickerStyle = {
  chevron?: StyleProp<ViewStyle>
  chevronDark?: StyleProp<ViewStyle>
  chevronActive?: StyleProp<ViewStyle>
  chevronContainer?: StyleProp<ViewStyle>
  chevronDown?: StyleProp<ViewStyle>
  chevronUp?: StyleProp<ViewStyle>
  done?: StyleProp<TextStyle>
  doneDark?: StyleProp<TextStyle>
  doneDepressed?: StyleProp<TextStyle>
  headlessAndroidContainer?: StyleProp<ViewStyle>
  headlessAndroidPicker?: StyleProp<TextStyle>
  iconContainer?: StyleProp<ViewStyle>
  inputAndroid?: StyleProp<TextStyle>
  inputAndroidContainer?: StyleProp<ViewStyle>
  inputIOS?: StyleProp<TextStyle>
  inputIOSContainer?: StyleProp<ViewStyle>
  inputWeb?: StyleProp<TextStyle>
  modalViewBottom?: StyleProp<ViewStyle>
  modalViewBottomDark?: StyleProp<ViewStyle>
  modalViewMiddle?: StyleProp<ViewStyle>
  modalViewMiddleDark?: StyleProp<ViewStyle>
  modalViewTop?: StyleProp<ViewStyle>
  placeholder?: StyleProp<TextStyle>
  viewContainer?: StyleProp<ViewStyle>
}

type CustomModalProps = Omit<ModalProps, 'visible' | 'transparent' | 'animationType'>
// 'testID', 'supportedOrientations', and 'onOrientationChange' are also used, but can be overwritten safely

type CustomTextInputProps = Omit<TextInputProps, 'style' | 'value' | 'ref' | 'editable'>
// 'testID' is also used, but can be overwritten safely

type CustomPickerProps = Omit<PickerProps, 'onValueChange' | 'selectedValue'>
// 'style' and 'enabled' are also used, but only in headless or native Android mode
// 'testID' is also used, but can be overwritten safely

type CustomTouchableDoneProps = Omit<TouchableOpacityProps, 'onPress'>
// 'testID', 'onPressIn', 'onPressOut', and 'hitSlop' are also used, but can be overwritten safely

type CustomTouchableWrapperProps = Omit<TouchableOpacityProps, 'onPress'>
// 'testID' and 'activeOpacity' are also used, but can be overwritten safely

type Props = {
  onValueChange: (value: any, index: number) => void
  items: Item[]
  value?: any
  placeholder?: Item | null
  disabled?: boolean
  style?: PickerStyle
  children?: React.ReactNode
  onOpen?: () => void
  doneText?: string
  onDonePress?: () => void
  onUpArrow?: () => void
  onDownArrow?: () => void
  onClose?: () => void
  modalProps?: CustomModalProps
  textInputProps?: CustomTextInputProps
  pickerProps?: CustomPickerProps
  touchableDoneProps?: CustomTouchableDoneProps
  touchableWrapperProps?: CustomTouchableWrapperProps
  Icon?: React.FC
  InputAccessoryView?: React.ReactNode
}

type Item = {
  label: string
  value: any
}

const defaultStyles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch'
  },
  iconContainer: {
    position: 'absolute',
    right: 0
  },
  modalViewTop: {
    flex: 1
  },
  modalViewMiddle: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#dedede',
    zIndex: 2
  },
  modalViewMiddleDark: {
    backgroundColor: '#232323',
    borderTopColor: '#252525'
  },
  chevronContainer: {
    flexDirection: 'row'
  },
  chevron: {
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
    borderColor: '#a1a1a1',
    borderTopWidth: 1.5,
    borderRightWidth: 1.5
  },
  chevronDark: {
    borderColor: '#707070'
  },
  chevronUp: {
    marginLeft: 11,
    transform: [{ translateY: 4 }, { rotate: '-45deg' }]
  },
  chevronDown: {
    marginLeft: 22,
    transform: [{ translateY: -5 }, { rotate: '135deg' }]
  },
  chevronActive: {
    borderColor: '#007aff'
  },
  done: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 17,
    paddingTop: 1,
    paddingRight: 11
  },
  doneDark: {
    color: '#fff'
  },
  doneDepressed: {
    fontSize: 19
  },
  modalViewBottom: {
    justifyContent: 'center',
    backgroundColor: '#d0d4da'
  },
  modalViewBottomDark: {
    backgroundColor: '#252525'
  },
  placeholder: {
    color: '#c7c7cd'
  },
  headlessAndroidPicker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: 'transparent',
    opacity: 0
  }
})

export const PickerSelect: React.FC<Props> = ({
  onValueChange,
  items,
  value,
  placeholder = {
    label: 'Select an item...',
    value: null
  },
  disabled = false,
  style = {},
  children,
  onOpen,
  doneText = 'Done',
  onDonePress,
  onUpArrow,
  onDownArrow,
  onClose,
  modalProps = {},
  textInputProps = {},
  pickerProps = {},
  touchableDoneProps = {},
  touchableWrapperProps = {},
  Icon,
  InputAccessoryView
}) => {
  const { dark } = useTheme()

  const getSelectedItem = (items: Item[], value: any) => {
    for (const item of items) {
      if (String(item.value) === String(value)) {
        return item
      }
    }

    return placeholder
  }

  const handlePlaceholder = (placeholder: Item | null) => {
    if (placeholder == null) {
      return []
    }
    return [placeholder]
  }

  const [allItems, setAllItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [animationType, setAnimationType] = useState<'none' | 'slide' | 'fade' | undefined>()
  const [orientation, setOrientation] = useState<string>('portrait')
  const [doneDepressed, setDoneDepressed] = useState<boolean>(false)

  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    setAllItems(handlePlaceholder(placeholder).concat(items))
  }, [items, placeholder])

  useEffect(() => {
    const selectedItem = getSelectedItem(allItems, value)
    setSelectedItem(selectedItem)
  }, [allItems, value])

  const onOrientationChange = ({ nativeEvent }) => {
    setOrientation(nativeEvent.orientation)
  }

  const getPlaceholderStyle = () => {
    if (placeholder && selectedItem?.label === placeholder.label) {
      return {
        ...defaultStyles.placeholder,
        ...(style.placeholder as object)
      }
    }
    return {}
  }

  const triggerOpenCloseCallbacks = (donePressed) => {
    if (!showPicker && onOpen) {
      onOpen()
    }

    if (showPicker && onClose) {
      // onClose(donePressed)
      onClose()
    }
  }

  const togglePicker = (animate = false, postToggleCallback: (() => void) | null = null, donePressed = false) => {
    if (disabled) {
      return
    }

    if (!showPicker) {
      Keyboard.dismiss()
    }

    triggerOpenCloseCallbacks(donePressed)

    setAnimationType(animate ? 'slide' : undefined)
    setShowPicker(!showPicker)
    if (postToggleCallback) {
      postToggleCallback()
    }
  }

  const renderPickerItems = () => {
    const defaultItemColor = dark ? '#fff' : undefined

    return allItems.map((item) => {
      return <Picker.Item label={item.label} value={item.value} key={item.label} color={defaultItemColor} />
    })
  }

  const renderInputAccessoryView = () => {
    if (InputAccessoryView) {
      return InputAccessoryView
    }

    return (
      <View
        style={[
          defaultStyles.modalViewMiddle,
          dark ? defaultStyles.modalViewMiddleDark : {},
          dark ? style.modalViewMiddleDark : style.modalViewMiddle
        ]}
      >
        <View style={[defaultStyles.chevronContainer, style.chevronContainer]}>
          <TouchableOpacity
            activeOpacity={onUpArrow ? 0.5 : 1}
            onPress={() => {
              if (onUpArrow) {
                togglePicker(false, onUpArrow)
              }
            }}
          >
            <View
              style={[
                defaultStyles.chevron,
                dark ? defaultStyles.chevronDark : {},
                dark ? style.chevronDark : style.chevron,
                defaultStyles.chevronUp,
                style.chevronUp,
                onUpArrow ? [defaultStyles.chevronActive, style.chevronActive] : {}
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={onDownArrow ? 0.5 : 1}
            onPress={() => {
              if (onDownArrow) {
                togglePicker(false, onDownArrow)
              }
            }}
          >
            <View
              style={[
                defaultStyles.chevron,
                dark ? defaultStyles.chevronDark : {},
                dark ? style.chevronDark : style.chevron,
                defaultStyles.chevronDown,
                style.chevronDown,
                onDownArrow ? [defaultStyles.chevronActive, style.chevronActive] : {}
              ]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          testID="done_button"
          onPress={() => {
            togglePicker(true, onDonePress, true)
          }}
          onPressIn={() => {
            setDoneDepressed(true)
          }}
          onPressOut={() => {
            setDoneDepressed(false)
          }}
          hitSlop={{
            top: 4,
            right: 4,
            bottom: 4,
            left: 4
          }}
          {...touchableDoneProps}
        >
          <View testID="needed_for_touchable">
            <Text
              testID="done_text"
              allowFontScaling={false}
              style={[
                defaultStyles.done,
                dark ? defaultStyles.doneDark : {},
                dark ? style.doneDark : style.done,
                doneDepressed ? [defaultStyles.doneDepressed, style.doneDepressed] : {}
              ]}
            >
              {doneText}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderIcon = () => {
    if (!Icon) {
      return null
    }

    return (
      <View testID="icon_container" style={[defaultStyles.iconContainer, style.iconContainer]}>
        <Icon />
      </View>
    )
  }

  const renderTextInputOrChildren = () => {
    const containerStyle = Platform.OS === 'ios' ? style.inputIOSContainer : style.inputAndroidContainer

    if (children) {
      return (
        <View pointerEvents="box-only" style={containerStyle}>
          {children}
        </View>
      )
    }

    return (
      <View pointerEvents="box-only" style={containerStyle}>
        <TextInput
          style={[Platform.OS === 'ios' ? style.inputIOS : style.inputAndroid, getPlaceholderStyle()]}
          value={selectedItem?.label ?? ''}
          ref={inputRef}
          editable={false}
          {...textInputProps}
        />
        {renderIcon()}
      </View>
    )
  }

  const renderIOS = () => {
    return (
      <View style={[defaultStyles.viewContainer, style.viewContainer]}>
        <TouchableOpacity
          testID="ios_touchable_wrapper"
          onPress={() => {
            togglePicker(true)
          }}
          activeOpacity={1}
          {...touchableWrapperProps}
        >
          {renderTextInputOrChildren()}
        </TouchableOpacity>
        <Modal
          visible={showPicker}
          transparent
          animationType={animationType}
          supportedOrientations={['portrait', 'landscape']}
          onOrientationChange={onOrientationChange}
          {...modalProps}
        >
          <TouchableOpacity
            style={[defaultStyles.modalViewTop, style.modalViewTop]}
            testID="ios_modal_top"
            onPress={() => {
              togglePicker(true)
            }}
          />
          {renderInputAccessoryView()}
          <View
            style={[
              defaultStyles.modalViewBottom,
              dark ? defaultStyles.modalViewBottomDark : {},
              { height: orientation === 'portrait' ? 215 : 162 },
              dark ? style.modalViewBottomDark : style.modalViewBottom
            ]}
          >
            <Picker
              onValueChange={(value, index) => {
                onValueChange(value == null || value === 'null' ? null : value, index)
                setSelectedItem(allItems[index])
              }}
              selectedValue={selectedItem?.value}
              {...pickerProps}
            >
              {renderPickerItems()}
            </Picker>
          </View>
        </Modal>
      </View>
    )
  }

  const renderAndroidHeadless = () => {
    return (
      <TouchableOpacity onPress={onOpen} activeOpacity={1} {...touchableWrapperProps}>
        <View style={style.headlessAndroidContainer}>
          {renderTextInputOrChildren()}
          <Picker
            style={[
              Icon ? { backgroundColor: 'transparent' } : {}, // to hide native icon
              defaultStyles.headlessAndroidPicker,
              style.headlessAndroidPicker
            ]}
            enabled={!disabled}
            onValueChange={onValueChange}
            selectedValue={selectedItem?.value}
            {...pickerProps}
          >
            {renderPickerItems()}
          </Picker>
        </View>
      </TouchableOpacity>
    )
  }

  if (Platform.OS === 'ios') {
    return renderIOS()
  }

  return renderAndroidHeadless()
}
