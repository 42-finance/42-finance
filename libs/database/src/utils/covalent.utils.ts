import { Transaction as CovalentTransaction, GoldRushClient } from '@covalenthq/client-sdk'
import { startOfDay } from 'date-fns'
import { CurrencyCode, SystemCategory, TransactionType, WalletType } from 'shared-types'

import {
  Account,
  Rule,
  Transaction,
  applyRules,
  dataSource,
  getCategory,
  getExchangeRate,
  getOrCreateMerchant
} from '..'

const getChain = (walletType: WalletType) => {
  switch (walletType) {
    case WalletType.Bitcoin:
      return 'btc-mainnet'
    case WalletType.Ethereum:
      return 'eth-mainnet'
  }
}

const getTokenSymbol = (walletType: WalletType) => {
  switch (walletType) {
    case WalletType.Bitcoin:
      return 'BTC'
    case WalletType.Ethereum:
      return 'ETH'
  }
}

export const getWalletBalance = async (walletAddress: string, walletType: WalletType, currencyCode: CurrencyCode) => {
  const client = new GoldRushClient(process.env.COVALENT_API_KEY!)
  const chain = getChain(walletType)
  const response = await client.BalanceService.getTokenBalancesForWalletAddress(chain, walletAddress)

  if (response.error || response.data?.items == null) {
    return {
      currentBalance: null,
      walletTokenBalance: null
    }
  }

  const symbol = getTokenSymbol(walletType)
  const balanceItem = response.data.items.find((i) => i.contract_ticker_symbol === symbol)

  if (balanceItem?.balance == null) {
    return {
      currentBalance: null,
      walletTokenBalance: null
    }
  }

  const walletTokenBalance = balanceItem.contract_decimals
    ? balanceItem.balance / BigInt(balanceItem.contract_decimals)
    : balanceItem.balance

  const currentBalance = balanceItem.quote
  const exchangeRate = await getExchangeRate(CurrencyCode.USD, currencyCode)

  return {
    currentBalance: currentBalance != null ? currentBalance * exchangeRate : null,
    walletTokenBalance: Number(walletTokenBalance)
  }
}

export const getWalletTransactions = async (walletAddress: string, walletType: WalletType, startDate: Date | null) => {
  const client = new GoldRushClient(process.env.COVALENT_API_KEY!)
  const chain = getChain(walletType)

  const transactions: CovalentTransaction[] = []

  const requests = client.TransactionService.getAllTransactionsForAddress(chain, walletAddress)

  for await (const transactionResponse of requests) {
    if (transactionResponse.error || transactionResponse.data.items == null) {
      continue
    }
    for (const transaction of transactionResponse.data.items) {
      if (!startDate || (transaction.block_signed_at && transaction.block_signed_at.getTime() > startDate.getTime())) {
        transactions.push(transaction)
      }
    }
  }

  return transactions
}

export const saveWalletTransactions = async (
  transactions: CovalentTransaction[],
  walletAddress: string,
  rules: Rule[],
  accountId: string,
  householdId: number
) => {
  const withdrawalCategory = await getCategory(SystemCategory.Withdrawal, householdId)
  const depositCategory = await getCategory(SystemCategory.Deposit, householdId)
  const merchant = await getOrCreateMerchant('Crypto Transfer', 'Crypto Transfer', null, householdId)

  const newTransactions: Transaction[] = []

  for (const transaction of transactions) {
    if (
      transaction.value_quote == null ||
      transaction.gas_quote == null ||
      transaction.from_address == null ||
      transaction.tx_hash == null ||
      transaction.block_signed_at == null
    ) {
      continue
    }
    const amount = transaction.value_quote + transaction.gas_quote
    const isWithdrawal = transaction.from_address.toLowerCase() === walletAddress.toLowerCase()
    const name = `${transaction.from_address} -> ${transaction.to_address}`
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

    const existingTransaction = await dataSource.getRepository(Transaction).findOneBy({ id: transaction.tx_hash })

    if (!existingTransaction) {
      const newTransaction = await dataSource.getRepository(Transaction).save({
        id: transaction.tx_hash,
        name,
        date: startOfDay(transaction.block_signed_at),
        amount: isWithdrawal ? amount : -amount,
        currencyCode: CurrencyCode.USD,
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

  const transactions = await getWalletTransactions(
    account.walletAddress,
    account.walletType,
    account.lastTransactionsUpdate
  )

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
