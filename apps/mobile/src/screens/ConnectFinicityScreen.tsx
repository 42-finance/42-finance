import {
  Connect,
  ConnectCancelEvent,
  ConnectDoneEvent,
  ConnectErrorEvent,
  ConnectEventHandlers,
  ConnectRouteEvent
} from 'connect-react-native-sdk'
import { refreshFinicityData } from 'frontend-api'
import { setMessage } from 'frontend-utils'

import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const ConnectFinicityScreen = ({ navigation, route }: RootStackScreenProps<'ConnectFinicity'>) => {
  const { connectUrl } = route.params

  const eventHandlers: ConnectEventHandlers = {
    onDone: (event: ConnectDoneEvent) => {
      console.log('onDone', event)
      refreshFinicityData()
      setMessage(
        'Account linked successfully. Your accounts and transactions are syncing and will be available shortly.'
      )
      navigation.navigate('Accounts')
    },
    onCancel: (event: ConnectCancelEvent) => {
      console.log('onCancel', event)
      navigation.navigate('Accounts')
    },
    onError: (event: ConnectErrorEvent) => {
      console.log('onError', event)
      navigation.navigate('Accounts')
    },
    onRoute: (event: ConnectRouteEvent) => {
      console.log('onRoute', event)
    },
    onUser: (event: any) => {
      console.log('onUser', event)
    },
    onLoad: () => {
      console.log('onLoad')
    }
  }

  return <Connect connectUrl={connectUrl} eventHandlers={eventHandlers} />
}
