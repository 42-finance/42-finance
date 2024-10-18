import { Account, Category, Merchant, Tag } from 'frontend-types'
import React, { useCallback, useState } from 'react'
import { AmountFilter, TransactionAmountType } from 'shared-types'

type Props = {
  children: React.ReactNode
}

type TransactionsFilterContextType = {
  accounts: Account[]
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
  amountType: TransactionAmountType | null
  setAmountType: React.Dispatch<React.SetStateAction<TransactionAmountType | null>>
  amountFilter: AmountFilter | null
  setAmountFilter: React.Dispatch<React.SetStateAction<AmountFilter | null>>
  amountValue: number | null
  setAmountValue: React.Dispatch<React.SetStateAction<number | null>>
  amountValue2: number | null
  setAmountValue2: React.Dispatch<React.SetStateAction<number | null>>
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  startDate: Date | null
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
  endDate: Date | null
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
  merchants: Merchant[]
  setMerchants: React.Dispatch<React.SetStateAction<Merchant[]>>
  hidden: boolean | null
  setHidden: React.Dispatch<React.SetStateAction<boolean | null>>
  needsReview: boolean | null
  setNeedsReview: React.Dispatch<React.SetStateAction<boolean | null>>
  tags: Tag[]
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  reset: () => void
}

const TransactionsFilterContext = React.createContext<TransactionsFilterContextType>(
  {} as TransactionsFilterContextType
)

export const useTransactionsFilterContext = () => React.useContext(TransactionsFilterContext)

export const TransactionsFilterProvider = (props: Props) => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [amountType, setAmountType] = useState<TransactionAmountType | null>(null)
  const [amountFilter, setAmountFilter] = useState<AmountFilter | null>(null)
  const [amountValue, setAmountValue] = useState<number | null>(null)
  const [amountValue2, setAmountValue2] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [hidden, setHidden] = useState<boolean | null>(null)
  const [needsReview, setNeedsReview] = useState<boolean | null>(null)
  const [tags, setTags] = useState<Tag[]>([])

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
