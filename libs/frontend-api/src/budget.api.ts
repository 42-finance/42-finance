import { Budget } from 'frontend-types'

import { config } from './config'
import { get, patch } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getBudgets = async () => get<HTTPResponseBody<Budget[]>>(`${config.apiUrl}/budgets`)

export type EditBudgetRequest = {
  categoryId: number
  amount: number
}

export const editBudget = async (body: EditBudgetRequest) =>
  patch<HTTPResponseBody<Budget>>(`${config.apiUrl}/budgets`, body)
