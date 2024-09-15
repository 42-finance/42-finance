import { useActionSheet as _useActionSheet } from '@expo/react-native-action-sheet'

type Option = {
  label: string
  onSelected: () => void
  isDestructive?: boolean
  isCancel?: boolean
}

export const useActionSheet = () => {
  const { showActionSheetWithOptions } = _useActionSheet()

  return (options: Option[], title?: string) => {
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
      }
    )
  }
}
