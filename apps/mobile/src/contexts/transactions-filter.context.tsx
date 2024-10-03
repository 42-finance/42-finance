import React, { useCallback } from 'react'
import { AmountFilter, TransactionAmountType } from 'shared-types'

import { useLocalStorage } from '../hooks/use-local-storage.hook'

type Props = {
  children: React.ReactNode
}

type TransactionsFilterContextType = {
  accounts: string[]
  setAccounts: (value: string[]) => void
  amountType: TransactionAmountType | null
  setAmountType: (value: TransactionAmountType | null) => void
  amountFilter: AmountFilter | null
  setAmountFilter: (value: AmountFilter | null) => void
  amountValue: number | null
  setAmountValue: (value: number | null) => void
  amountValue2: number | null
  setAmountValue2: (value: number | null) => void
  categories: number[]
  setCategories: (value: number[]) => void
  startDate: Date | null
  setStartDate: (value: Date | null) => void
  endDate: Date | null
  setEndDate: (value: Date | null) => void
  merchants: number[]
  setMerchants: (value: number[]) => void
  hidden: boolean | null
  setHidden: (value: boolean | null) => void
  needsReview: boolean | null
  setNeedsReview: (value: boolean | null) => void
  tags: number[]
  setTags: (value: number[]) => void
  reset: () => void
}

const TransactionsFilterContext = React.createContext<TransactionsFilterContextType>(
  {} as TransactionsFilterContextType
)

export const useTransactionsFilterContext = () => React.useContext(TransactionsFilterContext)

export const TransactionsFilterProvider = (props: Props) => {
  const [accounts, setAccounts] = useLocalStorage<string[]>('accounts', [])
  const [amountType, setAmountType] = useLocalStorage<TransactionAmountType | null>('amountType', null)
  const [amountFilter, setAmountFilter] = useLocalStorage<AmountFilter | null>('amountFilter', null)
  const [amountValue, setAmountValue] = useLocalStorage<number | null>('amountValue', null)
  const [amountValue2, setAmountValue2] = useLocalStorage<number | null>('amountValue2', null)
  const [categories, setCategories] = useLocalStorage<number[]>('categories', [])
  const [startDate, setStartDate] = useLocalStorage<Date | null>('startDate', null)
  const [endDate, setEndDate] = useLocalStorage<Date | null>('endDate', null)
  const [merchants, setMerchants] = useLocalStorage<number[]>('merchants', [])
  const [hidden, setHidden] = useLocalStorage<boolean | null>('hidden', null)
  const [needsReview, setNeedsReview] = useLocalStorage<boolean | null>('needsReview', null)
  const [tags, setTags] = useLocalStorage<number[]>('tags', [])

  const reset = useCallback(() => {
    setAccounts([])
    setAmountType(null)
    setAmountType(null)
    setAmountFilter(null)
    setAmountValue(null)
    setAmountValue2(null)
    setCategories([])
    setStartDate(null)
    setEndDate(null)
    setMerchants([])
    setHidden(null)
    setNeedsReview(null)
    setTags([])
  }, [])

  const value = {
    accounts,
    setAccounts,
    amountType,
    setAmountType,
    amountFilter,
    setAmountFilter,
    amountValue,
    setAmountValue,
    amountValue2,
    setAmountValue2,
    categories,
    setCategories,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    merchants,
    setMerchants,
    hidden,
    setHidden,
    needsReview,
    setNeedsReview,
    tags,
    setTags,
    reset
  }

  return <TransactionsFilterContext.Provider value={value}>{props.children}</TransactionsFilterContext.Provider>
}
