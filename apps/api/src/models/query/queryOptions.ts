export type QueryOptions = {
  fields: string[]
  filters: {
    [field: string]: any
  }
  negativeFilters: {
    [field: string]: any
  }
  sortings: {
    [field: string]: 'ASC' | 'DESC'
  }
  limit: number
  offset: number
  terms: {
    [field: string]: string
  }
}
