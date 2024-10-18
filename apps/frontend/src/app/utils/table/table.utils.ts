export const defaultOrder = (key: string, sort: string, order: 'ASC' | 'DESC') =>
  sort === key ? (order === 'ASC' ? 'ASC' : 'DESC') : null
