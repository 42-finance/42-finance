import { Navigate } from 'react-router-dom'

import { useUserTokenContext } from '../../contexts/user-token.context'

type Props = {
  children: React.ReactElement<any, any> | null
}

export const RestrictedRoute: React.FC<Props> = ({ children }) => {
  const { token } = useUserTokenContext()

  if (!token) {
    return <Navigate to="/" />
  }

  return children
}
