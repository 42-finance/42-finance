import { Goal } from 'frontend-types'
import { GoalType } from 'shared-types'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getGoal = async (goalId: number) => get<HTTPResponseBody<Goal>>(`${config.apiUrl}/goals/${goalId}`)

export const getGoals = async () => get<HTTPResponseBody<Goal[]>>(`${config.apiUrl}/goals`)

export type AddGoalRequest = {
  name: string
  amount: number
  accountIds: string[]
  type: GoalType
  targetDate: Date | null
  budgetAmount: number | null
}

export const addGoal = async (body: AddGoalRequest) => post<HTTPResponseBody<Goal>>(`${config.apiUrl}/goals`, body)

export type EditGoalRequest = {
  name?: string
  amount?: number
  accountIds?: string[]
  type?: GoalType
  targetDate?: Date | null
  budgetAmount?: number | null
}

export const editGoal = async (goalId: number, body: EditGoalRequest) =>
  patch<HTTPResponseBody<Goal>>(`${config.apiUrl}/goals/${goalId}`, body)

type DeleteGoalResponse = {
  affected: number
}

export const deleteGoal = async (goalId: number) =>
  del<HTTPResponseBody<DeleteGoalResponse>>(`${config.apiUrl}/goals/${goalId}`)
