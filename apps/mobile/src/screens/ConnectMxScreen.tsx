import { ConnectWidget } from '@mxenabled/react-native-widget-sdk'
import { mxMemberCreated } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { SafeAreaView } from 'react-native'

import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const ConnectMxScreen = ({ navigation, route }: RootStackScreenProps<'ConnectMx'>) => {
  const { connectUrl } = route.params

  return (
    <SafeAreaView>
      <ConnectWidget
        url={connectUrl}
        onMessage={(request) => {
          console.log(`Message: ${request}`)
          if (request.startsWith('mx://connect/connected/')) {
            setMessage(
              'Account linked successfully. Your accounts and transactions are syncing and will be available shortly.'
            )
            navigation.navigate('Accounts')
          }
        }}
        onSelectedInstitution={(payload) => console.log(`Selecting ${payload.name}`)}
        onInstitutionSearch={(payload) => console.log(payload)}
        onLoaded={(payload) => console.log(payload)}
        onMemberConnected={(payload) => {
          console.log(payload)
          mxMemberCreated(payload.member_guid)
        }}
        onMemberStatusUpdate={(payload) => console.log(payload)}
      />
    </SafeAreaView>
  )
}
