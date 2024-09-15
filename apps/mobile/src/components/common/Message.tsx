import { eventEmitter } from 'frontend-utils'
import { useEffect, useState } from 'react'
import { Snackbar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const Message: React.FC = () => {
  const insets = useSafeAreaInsets()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const onMessage = (message: string | null) => {
      setMessage(message)
    }

    eventEmitter.on('onMessage', onMessage)

    return () => {
      eventEmitter.off('onMessage', onMessage)
    }
  }, [])

  return (
    <Snackbar
      visible={message !== null}
      onDismiss={() => {
        setMessage(null)
      }}
      action={{
        label: 'Close'
      }}
      wrapperStyle={{ position: 'absolute', top: insets.top }}
    >
      {message}
    </Snackbar>
  )
}
