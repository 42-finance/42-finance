import { WalletType } from 'shared-types'

export const mapWalletType = (walletType: WalletType) => {
  switch (walletType) {
    case WalletType.Bitcoin:
      return 'Bitcoin'
    case WalletType.Ethereum:
      return 'Ethereum'
  }
}
