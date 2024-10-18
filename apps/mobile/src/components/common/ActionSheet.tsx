import { useActionSheet } from '@expo/react-native-action-sheet'
import React, { useEffect } from 'react'

type ActionSheetOption = {
  label: string
  onSelected: () => void
  isDestructive?: boolean
  isCancel?: boolean
}

type Props = {
  title: string
  options: ActionSheetOption[]
  isVisible: boolean
  onClose: () => void
}

export const ActionSheet: React.FC<Props> = ({ title, options, isVisible, onClose }) => {
  const { showActionSheetWithOptions } = useActionSheet()
  const optionsWithCancel = [
    ...options,
    {
      label: 'Close',
      onSelected: () => {},
      isCancel: true
    }
  ]
  const optionLabels = optionsWithCancel.map((o) => o.label)
  const destructiveButtonIndex = optionsWithCancel.findIndex((o) => o.isDestructive)
  const cancelButtonIndex = optionsWithCancel.findIndex((o) => o.isCancel)

  useEffect(() => {
    if (isVisible) {
      showActionSheetWithOptions(
        {
          title,
          options: optionLabels,
          destructiveButtonIndex,
          cancelButtonIndex
        },
        (selectedIndex?: number) => {
          if (selectedIndex != null) {
            optionsWithCancel[selectedIndex].onSelected()
          }
          onClose()
        }
      )
    }
  }, [isVisible])

  return <></>
}
