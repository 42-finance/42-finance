import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { endOfDay, format, parseISO, startOfDay } from 'date-fns'
import { ApiQuery, deleteTransactions, getTransactions } from 'frontend-api'
import { Transaction } from 'frontend-types'
import { dateToUtc, formatAccountName, formatDateInUtc } from 'frontend-utils'
import FileDownload from 'js-file-download'
import { json2csv } from 'json-2-csv'
import React, { useCallback, useState } from 'react'
import { AiOutlineFileExcel } from 'react-icons/ai'
import InfiniteScroll from 'react-infinite-scroller'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AmountFilter, TransactionAmountType } from 'shared-types'
import { ArrayParam, NumberParam, StringParam, createEnumParam, useQueryParams, withDefault } from 'use-query-params'

import { AccountsFilter } from '../components/account/account-filter'
import { CategoryFilter } from '../components/category/category-filter'
import { Button } from '../components/common/button/button'
import { Card } from '../components/common/card/card'
import { confirmModal } from '../components/common/confirm-modal/confirm-modal'
import { DateFilter } from '../components/common/date-filter'
import { FilterPicker, FilterType } from '../components/common/filter-picker'
import { ActivityIndicator } from '../components/common/loader/activity-indicator'
import { SearchInput } from '../components/common/search-input/search-input'
import { MerchantsFilter } from '../components/merchant/merchant-filter'
import { AddTransactionModal } from '../components/modals/add-transaction-modal'
import { EditMultipleTransactionsModal } from '../components/modals/edit-multiple-transactions-modal'
import { TransactionAmountFilter } from '../components/transaction/amount-filter'
import { ReviewStatusFilter } from '../components/transaction/review-status-filter'
import { TransactionItem } from '../components/transaction/transaction-item'
import { VisibilityFilter } from '../components/transaction/visibility-filter'
import { debounce } from '../utils/debounce/debounce.utils'

export enum Visibility {
  All = 'all',
  Visible = 'visible',
  Hidden = 'hidden'
}

export enum ReviewStatus {
  All = 'all',
  NeedsReview = 'needsReview',
  Reviewed = 'reviewed'
}

export const Transactions: React.FC = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [limit, setLimit] = useState<number>(25)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const [showEditMultiple, setShowEditMultiple] = useState<boolean>(false)
  const [showAddTransaction, setShowAddTransaction] = useState<boolean>(false)

  const [query, setQuery] = useQueryParams({
    search: withDefault(StringParam, null),
    filters: withDefault(ArrayParam, []),
    accountIds: ArrayParam,
    categoryIds: ArrayParam,
    merchantIds: ArrayParam,
    startDate: StringParam,
    endDate: StringParam,
    visibility: createEnumParam<Visibility>(Object.values(Visibility)),
    reviewStatus: createEnumParam<ReviewStatus>(Object.values(ReviewStatus)),
    amountType: createEnumParam<TransactionAmountType>(Object.values(TransactionAmountType)),
    amountFilter: createEnumParam<AmountFilter>(Object.values(AmountFilter)),
    amountValue: NumberParam,
    amountValue2: NumberParam
  })

  const {
    search,
    filters: transactionFilters,
    accountIds,
    categoryIds,
    merchantIds,
    startDate,
    endDate,
    visibility,
    reviewStatus,
    amountType,
    amountFilter,
    amountValue,
    amountValue2
  } = query

  const { data: transactions = [], isFetching } = useQuery({
    queryKey: [
      ApiQuery.Transactions,
      limit,
      search,
      startDate,
      endDate,
      accountIds,
      categoryIds,
      merchantIds,
      visibility,
      reviewStatus,
      amountType,
      amountFilter,
      amountValue,
      amountValue2
    ],
    queryFn: async () => {
      const res = await getTransactions({
        startDate: startDate ? dateToUtc(startOfDay(parseISO(startDate))) : undefined,
        endDate: endDate ? dateToUtc(endOfDay(parseISO(endDate))) : undefined,
        limit,
        search,
        accountIds: accountIds && accountIds.length > 0 ? accountIds.map((c) => c as string) : null,
        categoryIds: categoryIds && categoryIds.length > 0 ? categoryIds.map((c) => Number(c)) : null,
        merchantIds: merchantIds && merchantIds.length > 0 ? merchantIds.map((c) => Number(c)) : null,
        hidden: visibility === Visibility.Hidden ? true : visibility === Visibility.Visible ? false : null,
        needsReview:
          reviewStatus === ReviewStatus.NeedsReview ? true : reviewStatus === ReviewStatus.Reviewed ? false : null,
        amountType,
        amountFilter,
        amountValue,
        amountValue2
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { isFetching: fetchingExport, refetch } = useQuery({
    queryKey: [
      ApiQuery.TransactionsExport,
      search,
      startDate,
      endDate,
      accountIds,
      categoryIds,
      merchantIds,
      visibility,
      reviewStatus,
      amountType,
      amountFilter,
      amountValue,
      amountValue2
    ],
    queryFn: async () => {
      const res = await getTransactions({
        startDate: startDate ? dateToUtc(startOfDay(parseISO(startDate))) : undefined,
        endDate: endDate ? dateToUtc(endOfDay(parseISO(endDate))) : undefined,
        search,
        accountIds: accountIds && accountIds.length > 0 ? accountIds.map((c) => c as string) : null,
        categoryIds: categoryIds && categoryIds.length > 0 ? categoryIds.map((c) => Number(c)) : null,
        merchantIds: merchantIds && merchantIds.length > 0 ? merchantIds.map((c) => Number(c)) : null,
        hidden: visibility === Visibility.Hidden ? true : visibility === Visibility.Visible ? false : null,
        needsReview:
          reviewStatus === ReviewStatus.NeedsReview ? true : reviewStatus === ReviewStatus.Reviewed ? false : null,
        amountType,
        amountFilter,
        amountValue,
        amountValue2
      })
      if (res.ok && res.parsedBody) {
        const data = res.parsedBody.payload.map((transaction: Transaction) => ({
          Date: formatDateInUtc(transaction.date, 'yyyy-MM-dd'),
          Merchant: transaction.merchant.name,
          Category: transaction.category.name,
          Account: formatAccountName(transaction.account),
          'Original Statement': transaction.name,
          Amount: Math.round(transaction.amount * 100) / 100
        }))
        const csv = json2csv(data)
        FileDownload(csv, `transactions_${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.csv`)
        toast.success('Exported successfully')
      }
    },
    refetchOnWindowFocus: false,
    enabled: false
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteTransactions(selectedIds)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        toast.success('Transactions deleted')
      }
    }
  })

  const onDelete = async () => {
    if (await confirmModal({ content: 'Are you sure you want to delete the selected transactions?' })) {
      deleteMutation()
    }
  }

  const addFilter = (filter: FilterType) => {
    setQuery(
      {
        filters: [...transactionFilters, filter]
      },
      'replaceIn'
    )
  }

  const filters: { [key in FilterType]?: boolean } = {
    [FilterType.StartDate]: transactionFilters.some((f) => f === FilterType.StartDate) || startDate !== undefined,
    [FilterType.EndDate]: transactionFilters.some((f) => f === FilterType.EndDate) || endDate !== undefined,
    [FilterType.Accounts]: transactionFilters.some((f) => f === FilterType.Accounts) || accountIds !== undefined,
    [FilterType.Categories]: transactionFilters.some((f) => f === FilterType.Categories) || categoryIds !== undefined,
    [FilterType.Merchants]: transactionFilters.some((f) => f === FilterType.Merchants) || merchantIds !== undefined,
    [FilterType.Amount]: transactionFilters.some((f) => f === FilterType.Amount) || amountFilter !== undefined,
    [FilterType.Visibility]: transactionFilters.some((f) => f === FilterType.Visibility) || visibility !== undefined,
    [FilterType.ReviewStatus]:
      transactionFilters.some((f) => f === FilterType.ReviewStatus) || reviewStatus !== undefined
  }

  const removeFilter = (filter: FilterType) => {
    setQuery(
      {
        filters: transactionFilters.filter((f) => f !== filter),
        startDate: filter === FilterType.StartDate ? undefined : startDate,
        endDate: filter === FilterType.EndDate ? undefined : endDate,
        accountIds: filter === FilterType.Accounts ? undefined : accountIds,
        categoryIds: filter === FilterType.Categories ? undefined : categoryIds,
        merchantIds: filter === FilterType.Merchants ? undefined : merchantIds,
        amountFilter: filter === FilterType.Amount ? undefined : amountFilter,
        amountType: filter === FilterType.Amount ? undefined : amountType,
        amountValue: filter === FilterType.Amount ? undefined : amountValue,
        amountValue2: filter === FilterType.Amount ? undefined : amountValue2,
        visibility: filter === FilterType.Visibility ? undefined : visibility,
        reviewStatus: filter === FilterType.ReviewStatus ? undefined : reviewStatus
      },
      'replaceIn'
    )
  }

  const onSelected = useCallback(
    (transaction: Transaction) => {
      if (isSelecting) {
        setSelectedIds((ids) =>
          ids.includes(transaction.id) ? ids.filter((id) => id !== transaction.id) : [...ids, transaction.id]
        )
      } else {
        navigate(`/transactions/${transaction.id}`)
      }
    },
    [isSelecting]
  )

  const onEndReached = useCallback(() => {
    if (transactions.length > 0 && !isFetching) {
      setLimit((limit) => limit + 25)
    }
  }, [transactions.length, isFetching])

  return (
    <div className={'p-2 md:p-4'}>
      <div className="flex mb-4 items-center justify-between flex-wrap gap-x-5 gap-y-3">
        <div className="flex flex-wrap gap-x-5 gap-y-3 ml-[1px]">
          <div>
            <FilterPicker
              onChange={(filter: FilterType, isVisible: boolean) =>
                isVisible ? addFilter(filter) : removeFilter(filter)
              }
              filters={filters}
            />
          </div>
          <SearchInput
            data-testid="search-transactions"
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(
                {
                  search: e.target.value.trim() || undefined
                },
                'replaceIn'
              )
            }, 500)}
            placeholder="Search"
            defaultValue={search}
          />
          {filters[FilterType.StartDate] && (
            <div>
              <DateFilter
                title="Start Date"
                date={startDate ? parseISO(startDate) : undefined}
                onChange={(value) => {
                  if (value) {
                    setQuery(
                      {
                        startDate: formatDateInUtc(value, 'yyyy-MM-dd')
                      },
                      'replaceIn'
                    )
                  } else {
                    setQuery(
                      {
                        startDate: undefined
                      },
                      'replaceIn'
                    )
                  }
                }}
              />
            </div>
          )}
          {filters[FilterType.EndDate] && (
            <div>
              <DateFilter
                title="End Date"
                date={endDate ? parseISO(endDate) : undefined}
                onChange={(value) => {
                  if (value) {
                    setQuery(
                      {
                        endDate: formatDateInUtc(value, 'yyyy-MM-dd')
                      },
                      'replaceIn'
                    )
                  } else {
                    setQuery(
                      {
                        endDate: undefined
                      },
                      'replaceIn'
                    )
                  }
                }}
              />
            </div>
          )}
          {filters[FilterType.Accounts] && (
            <div>
              <AccountsFilter
                accountIds={accountIds ? accountIds.map((id) => id as string) : []}
                onChange={(value) => {
                  setQuery(
                    {
                      accountIds: value.map((id) => id.toString())
                    },
                    'replaceIn'
                  )
                }}
              />
            </div>
          )}
          {filters[FilterType.Categories] && (
            <div>
              <CategoryFilter
                categoryIds={categoryIds ? categoryIds.map((id) => Number(id)) : []}
                onChange={(value) => {
                  setQuery(
                    {
                      categoryIds: value.map((id) => id.toString())
                    },
                    'replaceIn'
                  )
                }}
              />
            </div>
          )}
          {filters[FilterType.Merchants] && (
            <div>
              <MerchantsFilter
                merchantIds={merchantIds ? merchantIds.map((id) => Number(id)) : []}
                onChange={(value) => {
                  setQuery(
                    {
                      merchantIds: value.map((id) => id.toString())
                    },
                    'replaceIn'
                  )
                }}
              />
            </div>
          )}
          {filters[FilterType.Amount] && (
            <div>
              <TransactionAmountFilter
                amountType={amountType ?? TransactionAmountType.Debit}
                amountFilter={amountFilter ?? AmountFilter.Equal}
                amountValue={amountValue}
                amountValue2={amountValue2}
                onChange={(amountType, amountFilter, amountValue, amountValue2) =>
                  setQuery(
                    {
                      amountType,
                      amountFilter,
                      amountValue,
                      amountValue2
                    },
                    'replaceIn'
                  )
                }
              />
            </div>
          )}
          {filters[FilterType.Visibility] && (
            <div>
              <VisibilityFilter
                value={visibility || undefined}
                onChange={(value) =>
                  setQuery(
                    {
                      visibility: value
                    },
                    'replaceIn'
                  )
                }
              />
            </div>
          )}
          {filters[FilterType.ReviewStatus] && (
            <div>
              <ReviewStatusFilter
                value={reviewStatus || undefined}
                onChange={(value) =>
                  setQuery(
                    {
                      reviewStatus: value
                    },
                    'replaceIn'
                  )
                }
              />
            </div>
          )}
        </div>
      </div>

      <Card
        title="Transactions"
        className="mt-4"
        extra={
          <div className="flex flex-wrap gap-2 items-center">
            <Button type="primary" onClick={() => setIsSelecting((isSelecting) => !isSelecting)}>
              {isSelecting ? 'Cancel' : 'Edit Multiple'}
            </Button>
            {isSelecting && (
              <Button type="primary" onClick={() => setShowEditMultiple(true)} disabled={selectedIds.length === 0}>
                Edit {selectedIds.length}
              </Button>
            )}
            {isSelecting && (
              <Button type="primary" danger onClick={onDelete} disabled={selectedIds.length === 0}>
                Delete {selectedIds.length}
              </Button>
            )}
            <Button type="primary" onClick={() => setShowAddTransaction(true)}>
              Add Transaction
            </Button>
            <Button
              icon={<AiOutlineFileExcel />}
              onClick={() => refetch()}
              loading={fetchingExport}
              disabled={fetchingExport}
            >
              Export
            </Button>
          </div>
        }
      >
        <InfiniteScroll
          loadMore={onEndReached}
          hasMore={true}
          loader={
            isFetching ? (
              <div className="my-2">
                <ActivityIndicator />
              </div>
            ) : (
              <div />
            )
          }
        >
          <div key={1}>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onSelected={onSelected}
                isSelecting={isSelecting}
                isSelected={selectedIds.includes(transaction.id)}
              />
            ))}
          </div>
        </InfiniteScroll>
      </Card>
      <Outlet />
      {showEditMultiple && (
        <EditMultipleTransactionsModal
          transactionIds={selectedIds}
          onClose={() => {
            setShowEditMultiple(false)
          }}
        />
      )}
      {showAddTransaction && (
        <AddTransactionModal
          onClose={() => {
            setShowAddTransaction(false)
          }}
        />
      )}
    </div>
  )
}
