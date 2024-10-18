import React from 'react'
import { HelperText } from 'react-native-paper'

type Props = {
  visible: boolean | null | undefined
  message: string | null | undefined
  marginBottom?: number
  marginTop?: number
}

export const ErrorText: React.FC<Props> = ({ visible, message, marginBottom, marginTop }) => {
  return visible ? (
    <HelperText type="error" visible={visible} style={{ marginBottom: marginBottom ?? 5, marginTop: marginTop ?? -5 }}>
      {message}
    </HelperText>
  ) : (
    <></>
  )
}
