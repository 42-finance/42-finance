import { Category } from './category.type'

export type Budget = {
  id: number
  amount: number
  categoryId: number
  category: Category
}
