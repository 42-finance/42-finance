import {
  Account,
  applyRules,
  dataSource,
  getCategory,
  getExchangeRate,
  getOrCreateMerchant,
  Rule,
  Transaction
} from 'database'
import { startOfDay } from 'date-fns'
import { isArray } from 'lodash'
import { CurrencyCode, SystemCategory, TransactionType } from 'shared-types'
import { ethplorerConfig } from '../common/config'

type EthplorerAddressInfoResponse = {
  ETH: {
    price: {
      rate: number
    }
    balance: number
  }
}

type EthplorerTransaction = {
  timestamp: number
  from: string
  to: string
  hash: string
  value: number
  usdValue: number
}

type EthplorerError = {
  error: {
    code: number
    message: string
  }
}

export const getEthereumBalance = async (walletAddress: string, currencyCode: CurrencyCode) => {
  const response = await fetch(
    `${ethplorerConfig.apiUrl}/getAddressInfo/${walletAddress}?apiKey=${ethplorerConfig.apiKey}`
  )

  let responseBody: EthplorerAddressInfoResponse | null = null
  try {
    responseBody = await response.json()
  } catch (error) {
    console.log(error)
  }

  if (!responseBody) {
    return {
      currentBalance: null as number | null,
      walletTokenBalance: null as number | null
    }
  }

  const balance = responseBody.ETH.balance
  const exchangeRate = await getExchangeRate(CurrencyCode.ETH, currencyCode)

  return {
    currentBalance: balance * exchangeRate,
    walletTokenBalance: balance
  }
}

export const getWalletTransactions = async (walletAddress: string, startDate: Date | null) => {
  const timestamp = startDate ? Math.round(startDate.getTime() / 1000) : 0
  const response = await fetch(
    `${ethplorerConfig.apiUrl}/getAddressTransactions/${walletAddress}?limit=1000&apiKey=${ethplorerConfig.apiKey}`
  )

  let responseBody: EthplorerTransaction[] | EthplorerError | null = null
  try {
    responseBody = await response.json()
  } catch (error) {
    console.log(error)
  }

  if (!responseBody || !isArray(responseBody)) {
    console.log(responseBody)
    return []
  }

  const transactions: EthplorerTransaction[] = []

  for (const transactionResponse of responseBody) {
    if (transactionResponse.timestamp > timestamp) {
      transactions.push(transactionResponse)
    }
  }

  return transactions
}

export const saveWalletTransactions = async (
  transactions: EthplorerTransaction[],
  walletAddress: string,
  rules: Rule[],
  accountId: string,
  householdId: number
) => {
  const withdrawalCategory = await getCategory(SystemCategory.Withdrawal, householdId)
  const depositCategory = await getCategory(SystemCategory.Deposit, householdId)
  const merchant = await getOrCreateMerchant('Crypto Transfer', 'Crypto Transfer', null, householdId)
  const account = await dataSource.getRepository(Account).findOneByOrFail({ id: accountId })
  const exchangeRate = await getExchangeRate(CurrencyCode.USD, account.currencyCode)

  const newTransactions: Transaction[] = []

  for (const transaction of transactions) {
    if (
      transaction.usdValue == null ||
      transaction.from == null ||
      transaction.to == null ||
      transaction.hash == null ||
      transaction.timestamp == null
    ) {
      continue
    }

    const amount = transaction.usdValue * exchangeRate
    const isWithdrawal = transaction.from.toLowerCase() === walletAddress.toLowerCase()
    const name = `${transaction.from} -> ${transaction.to}`
    const category = isWithdrawal ? withdrawalCategory : depositCategory

    const { merchantIdOverride, categoryIdOverride, hideOverride, needsReviewOverride } = await applyRules(
      rules,
      householdId,
      name,
      amount,
      accountId,
      category,
      merchant
    )

    const existingTransaction = await dataSource.getRepository(Transaction).findOneBy({ id: transaction.hash })

    if (!existingTransaction) {
      const newTransaction = await dataSource.getRepository(Transaction).save({
        id: transaction.hash,
        name,
        date: startOfDay(transaction.timestamp * 1000),
        amount: isWithdrawal ? amount : -amount,
        currencyCode: account.currencyCode,
        pending: false,
        type: TransactionType.Crypto,
        needsReview: needsReviewOverride ?? true,
        hidden: hideOverride ?? false,
        accountId,
        categoryId: categoryIdOverride ?? category.id,
        merchantId: merchantIdOverride ?? merchant.id,
        householdId
      })

      newTransactions.push(newTransaction)
    }
  }

  return newTransactions
}

export const updateWalletTransactions = async (account: Account, rules: Rule[], householdId: number) => {
  if (!account.walletAddress || !account.walletType) {
    return []
  }

  const transactions = await getWalletTransactions(account.walletAddress, account.lastTransactionsUpdate)

  const newTransactions = await saveWalletTransactions(
    transactions,
    account.walletAddress,
    rules,
    account.id,
    householdId
  )

  const sortedTransactions = newTransactions.sort((t1, t2) => t1.date.getTime() - t2.date.getTime())

  if (sortedTransactions.length) {
    await dataSource.getRepository(Account).update(account.id, {
      lastTransactionsUpdate: sortedTransactions[sortedTransactions.length - 1].date
    })
  }

  return sortedTransactions
}
