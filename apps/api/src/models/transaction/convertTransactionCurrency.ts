import { Transaction, User, getExchangeRate } from 'database'

export const convertTransactionsCurrency = async (transactions: Transaction[], user: User) => {
  const convertedTransactions: Transaction[] = []
  for (const transaction of transactions.filter((t) => t.account)) {
    let convertedAmount = transaction.amount
    if (user.currencyCode !== transaction.account.currencyCode) {
      const exchangeRate = await getExchangeRate(transaction.account.currencyCode, user.currencyCode)
      convertedAmount *= exchangeRate
    }
    convertedTransactions.push({
      ...transaction,
      convertedAmount
    })
  }
  return convertedTransactions
}
