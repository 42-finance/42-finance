import { EntityType } from 'database'
import _ from 'lodash'
import { HTTPRequestQuery } from '../http/httpRequestQuery'
import { QueryOptions } from './queryOptions'

type SortOrder = 'ASC' | 'DESC'

const parseParam = (rawParams: string[]) => {
  const splitedParams = rawParams.map((rawParam) => rawParam.split(':'))
  return splitedParams.map((splitedParam, index) => {
    if (splitedParam.length === 2 && !_.isEmpty(splitedParam?.[0]) && !_.isEmpty(splitedParam?.[1])) {
      return splitedParam
    }
    throw `Invalid query parameter ${rawParams[index]}`
  })
}

const parseFilters = (rawParams: string[], entityAlias: string) => {
  const splitFilters = parseParam(rawParams)

  const paramArray = splitFilters.map(([field, value]): [string, string | string[]] => [
    field.includes('.') ? field : `${entityAlias}.${field}`,
    value.includes(',') ? value.split(',') : value
  ])

  return paramArray.reduce(
    (acc, [field, value]) => ({
      ...acc,
      [field]: value
    }),
    {}
  )
}

const parseSortings = (queryParams: HTTPRequestQuery, entityAlias: string) => {
  const rawParams = queryParams.sortings ?? [`${entityAlias}.id:ASC`]
  const paramArray = parseParam(rawParams).map(([sortByField, sortOrder]) => [sortByField, sortOrder.toUpperCase()])
  if (!paramArray.every(([sortByField, sortOrder]) => sortOrder === 'ASC' || sortOrder === 'DESC')) {
    throw 'Invalid sorting options'
  }
  const splitFilters = paramArray.map(([field, value]) => [
    field.includes('.') ? field : `${entityAlias}.${field}`,
    value
  ])
  return splitFilters.reduce(
    (acc, [sortByField, sortOrder]) => ({
      ...acc,
      [sortByField]: sortOrder
    }),
    {}
  )
}

const parseTerms = (queryParams: HTTPRequestQuery, entityAlias: string) => {
  const rawParams = queryParams.terms ?? []
  const splitFilters = parseParam(rawParams)
  const paramArray = splitFilters.map(([field, value]) => [
    field.includes('.') ? field : `${entityAlias}.${field}`,
    value
  ])
  return paramArray.reduce(
    (acc, [searchField, searchTerm]) => ({
      ...acc,
      [searchField]: searchTerm
    }),
    {}
  )
}

const parseFields = (queryParams: HTTPRequestQuery, entityAlias: string, filters: any, sortings: any, terms: any) => {
  const rawFields = queryParams.fields ?? ['id']
  const [fields, additionalFields] = [
    _.isArray(rawFields) ? rawFields : [rawFields],
    Object.keys(filters).concat(Object.keys(sortings)).concat(Object.keys(terms))
  ]
  return fields
    .concat(
      additionalFields
        .reduce((acc, fieldName) => {
          const [entity, field] = fieldName.split('.')
          return !entity.endsWith('s') ? [...acc, `${entity}s.${field}`] : acc
        }, additionalFields)
        .map((fieldName) => {
          const [entity, field] = fieldName.split('.')
          return entity === entityAlias ? field : entity
        })
    )
    .filter((value, index, self) => self.indexOf(value) === index)
}

export const useQueryOptions = (baseEntity: EntityType, queryParams: HTTPRequestQuery): QueryOptions => {
  const entityAlias = _.lowerFirst(baseEntity.name)
  const filters = parseFilters(queryParams.filters ?? [], entityAlias)
  const negativeFilters = parseFilters(queryParams.negativeFilters ?? [], entityAlias)
  const sortings = parseSortings(queryParams, entityAlias)
  const terms = parseTerms(queryParams, entityAlias)
  const fields = parseFields(queryParams, entityAlias, filters, sortings, terms)
  const limit = queryParams.limit ?? 0
  const offset = queryParams.offset ?? 0
  return {
    fields,
    filters,
    negativeFilters,
    sortings,
    terms,
    limit,
    offset
  }
}
