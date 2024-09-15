import { Transaction } from 'frontend-types'
import { formatDateInUtc, formatDollars } from 'frontend-utils'
import { FaCheck, FaCodeFork } from 'react-icons/fa6'
import { IoHourglass } from 'react-icons/io5'
import { CurrencyCode } from 'shared-types'

import { useLocalStorage } from '../../hooks/use-local-storage.hook'
import { AccountIcon } from '../account/account-icon'

type Props = {
  transaction: Transaction
  onSelected?: (transaction: Transaction) => void
  isSelecting?: boolean
  isSelected?: boolean
}

export const TransactionItem: React.FC<Props> = ({ transaction, onSelected, isSelecting, isSelected = [] }) => {
  const [currencyCode] = useLocalStorage<CurrencyCode>('currencyCode', CurrencyCode.USD)

  return (
    <div
      onClick={() => {
        if (onSelected) {
          onSelected(transaction)
        }
      }}
      className={`flex items-center border-b p-4 ${onSelected ? 'cursor-pointer hover:opacity-75' : ''}`}
    >
      <div className="flex items-center grow md:w-1/3">
        {isSelecting && (
          <div
            className={`flex items-center justify-center rounded-full mr-3 w-5 h-5 ${isSelected ? 'bg-primary' : 'bg-outline'}`}
          >
            {isSelected && <FaCheck color="white" />}
          </div>
        )}
        <div className="text-xl mr-3">{transaction.category.icon}</div>
        <div className="flex flex-col">
          <div>{transaction.merchant.name}</div>
          <div className="mt-1 text-outline">{formatDateInUtc(transaction.date, 'MMMM dd, yyyy')}</div>
        </div>
      </div>
      <div className="hidden xl:flex items-center w-1/3">
        <AccountIcon account={transaction.account} />
        <div className="">{transaction.account.name}</div>
      </div>
      <div className="flex items-center md:w-2/3 xl:w-1/3">
        <div className="hidden md:flex items-center grow mr-4">
          <div className="text-xl mr-3">{transaction.category.icon}</div>
          <div>{transaction.category.name}</div>
        </div>
        {transaction.splitTransactionId && <FaCodeFork className="mr-1.5" />}
        {transaction.pending && <IoHourglass className="mr-1.5" />}
        <div
          className="text-base"
          style={{
            ...(transaction.amount >= 0 ? {} : { color: '#19d2a5' }),
            fontStyle: transaction.pending ? 'italic' : 'normal'
          }}
        >
          {transaction.amount < 0 ? '+' : ''}
          {formatDollars(transaction.amount)}
          {transaction.account.currencyCode === currencyCode ? '' : ` ${transaction.account.currencyCode}`}
        </div>
      </div>
    </div>
  )
}
