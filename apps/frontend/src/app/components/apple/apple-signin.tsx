import AppleSignIn from 'react-apple-signin-auth'

type Props = {
  onSuccess: (response: any) => void
  onError: (error: any) => void
}

export const AppleSignInButton: React.FC<Props> = ({ onSuccess, onError }) => (
  <AppleSignIn
    authOptions={{
      clientId: 'com.fortytwofinance.web',
      scope: 'email name',
      redirectURI: 'https://app.42f.io',
      usePopup: true
    }}
    uiType="dark"
    className="apple-auth-btn w-full"
    buttonExtraChildren="Sign in with Apple"
    onSuccess={onSuccess}
    onError={onError}
  />
)
