import { Category } from 'frontend-types'
import _ from 'lodash'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getCategory = async (categoryId: number) =>
  get<HTTPResponseBody<Category>>(`${config.apiUrl}/categories/${categoryId}`)

type CategoriesQuery = {
  search?: string | null
}

export const getCategories = async (query: CategoriesQuery = {}) => {
  const url = new URL(`${config.apiUrl}/categories`)
  const searchParams = new URLSearchParams()
  if (query.search && !_.isEmpty(query.search)) {
    searchParams.append('search', query.search)
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<Category[]>>(url.toString())
}

export type AddCategoryRequest = {
  name: string
  icon: string
  groupId: number
}

export const addCategory = async (body: AddCategoryRequest) =>
  post<HTTPResponseBody<Category>>(`${config.apiUrl}/categories`, body)

export type EditCategoryRequest = {
  name?: string
  icon?: string
  groupId?: number
  mapToCategoryId?: number | null
}

export const editCategory = async (categoryId: number, body: EditCategoryRequest) =>
  patch<HTTPResponseBody<Category>>(`${config.apiUrl}/categories/${categoryId}`, body)

export type DeleteCategoryRequest = {
  mapToCategoryId: number
}

type DeleteCategoryResponse = {
  affected: number
}

export const deleteCategory = async (categoryId: number, body: DeleteCategoryRequest) =>
  del<HTTPResponseBody<DeleteCategoryResponse>>(`${config.apiUrl}/categories/${categoryId}`, body)
