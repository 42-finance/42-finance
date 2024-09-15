import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
  AppleAuthenticationScope,
  signInAsync
} from 'expo-apple-authentication'
import { setMessage } from 'frontend-utils'
import { Platform } from 'react-native'
import { useTheme } from 'react-native-paper'

type Props = {
  onSuccess: (identityToken: string, name: string) => void
}

export const AppleSignIn: React.FC<Props> = ({ onSuccess }) => {
  const { dark } = useTheme()

  if (Platform.OS === 'android') {
    return null
  }

  return (
    <AppleAuthenticationButton
      buttonType={AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={dark ? AppleAuthenticationButtonStyle.WHITE : AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{
        height: 44,
        marginHorizontal: 5,
        marginTop: 5
      }}
      onPress={async () => {
        try {
          const credential = await signInAsync({
            requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL]
          })
          console.log(credential)
          if (credential.identityToken) {
            let name = ''
            if (credential.fullName?.givenName && credential.fullName?.familyName) {
              name = `${credential.fullName.givenName} ${credential.fullName.familyName}`
            } else if (credential.fullName?.givenName) {
              name = credential.fullName.givenName
            } else if (credential.fullName?.familyName) {
              name = credential.fullName.familyName
            }
            onSuccess(credential.identityToken, name)
          } else {
            setMessage('An error occurred signing in with Apple.')
          }
        } catch (e: any) {
          console.log(e)
          if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    />
  )
}
