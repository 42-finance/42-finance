export type HTTPRequestQuery = {
  fields?: string[]
  filters?: string[]
  negativeFilters?: string[]
  sortings?: string[]
  terms?: string[]
  limit?: number
  offset?: number
  sort?: string
  order?: 'ASC' | 'DESC'
}
