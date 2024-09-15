import { Tag } from 'frontend-types'
import _ from 'lodash'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getTag = async (tagId: number) => get<HTTPResponseBody<Tag>>(`${config.apiUrl}/tags/${tagId}`)

type TagQuery = {
  search?: string | null
}

const buildGetTagsUrl = (baseUrl: string, query: TagQuery) => {
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  if (query.search && !_.isEmpty(query.search)) {
    searchParams.append('search', query.search)
  }
  url.search = searchParams.toString()
  return url.toString()
}

export const getTags = async (query: TagQuery = {}) => {
  const url = buildGetTagsUrl(`${config.apiUrl}/tags`, query)
  return get<HTTPResponseBody<Tag[]>>(url)
}

export type AddTagRequest = {
  name: string
  color: string
}

export const addTag = async (body: AddTagRequest) => post<HTTPResponseBody<Tag>>(`${config.apiUrl}/tags`, body)

export type EditTagRequest = {
  name?: string
  color?: string
}

export const editTag = async (tagId: number, body: EditTagRequest) =>
  patch<HTTPResponseBody<Tag>>(`${config.apiUrl}/tags/${tagId}`, body)

type DeleteTagResponse = {
  affected: number
}

export const deleteTag = async (tagId: number) =>
  del<HTTPResponseBody<DeleteTagResponse>>(`${config.apiUrl}/tags/${tagId}`)
