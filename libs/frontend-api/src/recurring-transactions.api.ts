import { RecurringTransaction } from 'frontend-types'
import { CategoryType, Frequency } from 'shared-types'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getRecurringTransaction = async (recurringTransactionId: number) =>
  get<HTTPResponseBody<RecurringTransaction>>(`${config.apiUrl}/recurring-transactions/${recurringTransactionId}`)

export const getRecurringTransactions = async () =>
  get<HTTPResponseBody<RecurringTransaction[]>>(`${config.apiUrl}/recurring-transactions`)

export type AddRecurringTransactionRequest = {
  name: string
  startDate: Date
  frequency: Frequency
  interval: number | null
  amount: number
  type: CategoryType
  accountId: string
  merchantId: number
  transactionIds: string[]
}

export const addRecurringTransaction = async (body: AddRecurringTransactionRequest) =>
  post<HTTPResponseBody<RecurringTransaction>>(`${config.apiUrl}/recurring-transactions`, body)

export type EditRecurringTransactionRequest = {
  name?: string
  startDate?: Date
  frequency?: Frequency
  interval?: number | null
  amount?: number
  type?: CategoryType
  accountId?: string
  merchantId?: number
  transactionIds?: []
}

export const editRecurringTransaction = async (recurringTransactionId: number, body: EditRecurringTransactionRequest) =>
  patch<HTTPResponseBody<RecurringTransaction>>(
    `${config.apiUrl}/recurring-transactions/${recurringTransactionId}`,
    body
  )

type DeleteRecurringTransactionResponse = {
  affected: number
}

export const deleteRecurringTransaction = async (recurringTransactionId: number) =>
  del<HTTPResponseBody<DeleteRecurringTransactionResponse>>(
    `${config.apiUrl}/recurring-transactions/${recurringTransactionId}`
  )
