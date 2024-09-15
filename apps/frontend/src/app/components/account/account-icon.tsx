import { Account } from 'frontend-types'
import { FaArrowUp, FaBitcoin, FaCarSide, FaHome } from 'react-icons/fa'
import { FiAlertTriangle } from 'react-icons/fi'
import { MdAccountBalance } from 'react-icons/md'
import { AccountSubType, ConnectionType } from 'shared-types'

import { Avatar } from '../common/avatar'

type Props = {
  account: Account
}

export const AccountIcon: React.FC<Props> = ({ account }) => {
  const accountIcon = (type: AccountSubType) => {
    switch (type) {
      case AccountSubType.Checking:
      case AccountSubType.CreditCard:
        return <MdAccountBalance />
      case AccountSubType.Vehicle:
        return <FaCarSide />
      case AccountSubType.CryptoExchange:
        return <FaBitcoin />
      case AccountSubType.Property:
        return <FaHome />
      default:
        return <FaArrowUp />
    }
  }

  if (account.connection?.needsTokenRefresh) {
    return (
      <Avatar className="mr-3 text-error">
        <FiAlertTriangle />
      </Avatar>
    )
  }

  if (account.connection?.type === ConnectionType.Plaid && account.connection.institutionLogo) {
    return (
      <Avatar className="mr-3">
        <img src={`data:image/png;base64,${account.connection.institutionLogo}`} />
      </Avatar>
    )
  }

  if (account.connection?.type === ConnectionType.Mx && account.connection.institutionLogo) {
    return (
      <Avatar className="mr-3">
        <img src={account.connection.institutionLogo} />
      </Avatar>
    )
  }

  return <Avatar className="mr-3">{accountIcon(account.subType)}</Avatar>
}
