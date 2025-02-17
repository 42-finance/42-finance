import { randomUUID } from 'crypto'
import { Account, BalanceHistory, dataSource, getBitcoinBalance, getEthereumBalance, getVehicleValue } from 'database'
import { startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { AccountSubType, AccountType, CurrencyCode, WalletType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateAccountRequest = {
  name: string
  type: AccountType
  subType: AccountSubType
  currentBalance: number | null
  currencyCode: CurrencyCode
  accountGroupId: number | null
  walletType: WalletType | null
  walletAddress: string | null
  walletTokenBalance: number | null
  vehicleVin: string | null
  vehicleMileage: number | null
  propertyAddress: string | null
  hideFromAccountsList: boolean
  hideFromNetWorth: boolean
  hideFromBudget: boolean
}

export const createAccount = async (
  request: Request<{ id: string }, object, CreateAccountRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  let { currentBalance, walletTokenBalance } = request.body
  const {
    name,
    type,
    subType,
    currencyCode = CurrencyCode.USD,
    accountGroupId,
    walletType,
    walletAddress,
    vehicleVin,
    vehicleMileage,
    propertyAddress,
    hideFromAccountsList = false,
    hideFromNetWorth = false,
    hideFromBudget = false
  } = request.body

  let vehicleMake: string | null = null
  let vehicleModel: string | null = null
  let vehicleYear: number | null = null
  let vehicleTrim: string | null = null
  let vehicleState: string | null = null

  if (walletType && walletAddress) {
    if (walletType === WalletType.Bitcoin) {
      const result = await getBitcoinBalance(walletAddress, currencyCode)
      currentBalance = result.currentBalance
      walletTokenBalance = result.walletTokenBalance
    } else if (walletType === WalletType.Ethereum) {
      const result = await getEthereumBalance(walletAddress, currencyCode)
      currentBalance = result.currentBalance
      walletTokenBalance = result.walletTokenBalance
    }
  } else if (vehicleVin && currentBalance === 0) {
    const { make, model, year, trim, state, value } = await getVehicleValue(vehicleVin, vehicleMileage, null)
    currentBalance = value
    vehicleMake = make
    vehicleModel = model
    vehicleYear = year
    vehicleTrim = trim
    vehicleState = state
  }

  const account = await dataSource.getRepository(Account).save({
    id: randomUUID(),
    name,
    type,
    subType,
    currentBalance: currentBalance ?? 0,
    currencyCode,
    accountGroupId,
    walletType,
    walletAddress,
    walletTokenBalance,
    vehicleVin,
    vehicleMileage,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleTrim,
    vehicleState,
    propertyAddress,
    hideFromAccountsList,
    hideFromNetWorth,
    hideFromBudget,
    householdId
  })

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(BalanceHistory)
    .values({
      date: startOfDay(new Date()),
      currentBalance: currentBalance ?? 0,
      walletTokenBalance,
      accountId: account.id,
      householdId
    })
    .orIgnore()
    .execute()

  return response.json({
    errors: [],
    payload: account
  })
}
