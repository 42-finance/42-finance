import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, SplitTransactionRequest, getTransaction, splitTransaction } from 'frontend-api'
import { Transaction } from 'frontend-types'
import { formatDollarsSigned, roundToTwoDecimals } from 'frontend-utils'
import { useEffect, useMemo, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { SplitTransactionItem } from './split-transaction-item'
import { TransactionItem } from './transaction-item'

type Props = {
  transactionId: string
  onClose: () => void
}

export const SplitTransaction: React.FC<Props> = ({ transactionId, onClose }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [splitTransactions, setSplitTransactions] = useState<Transaction[]>([])

  const { data: transaction } = useQuery({
    queryKey: [ApiQuery.Transaction, transactionId],
    queryFn: async () => {
      const res = await getTransaction(transactionId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: SplitTransactionRequest) => {
      const res = await splitTransaction(transactionId, request)
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        toast.success('Transaction split')
        navigate('/transactions')
      }
    }
  })

  useEffect(() => {
    if (transaction) {
      if (transaction.splitTransactions?.length) {
        setSplitTransactions(transaction.splitTransactions.map((t) => ({ ...t, amount: Math.abs(t.amount) })))
      } else {
        setSplitTransactions([
          { ...transaction, amount: Math.abs(transaction.amount), id: crypto.randomUUID() as string }
        ])
      }
    }
  }, [transaction])

  const leftToSplit = useMemo(() => {
    if (!transaction) return 0

    let splitValue = 0

    for (const splitTransaction of splitTransactions) {
      splitValue += splitTransaction.amount
    }

    return roundToTwoDecimals(Math.abs(transaction.amount) - splitValue)
  }, [transaction, splitTransactions])

  const onSubmit = () => {
    if (transaction) {
      mutate({
        splitTransactions: splitTransactions.map((t) => ({
          id: t.id,
          amount: transaction.amount < 0 ? -t.amount : t.amount,
          categoryId: t.categoryId
        }))
      })
    }
  }

  const onAddSplit = () => {
    if (transaction) {
      setSplitTransactions((s) => [
        ...s,
        {
          ...transaction,
          id: crypto.randomUUID() as string,
          amount: 0
        }
      ])
    }
  }

  return (
    <Modal
      title="Split transaction"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      bodyPadding="p-0"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          type="primary"
          disabled={
            isPending ||
            leftToSplit !== 0 ||
            splitTransactions.length <= 1 ||
            splitTransactions.some((t) => t.amount <= 0)
          }
          onClick={onSubmit}
        >
          Split into {splitTransactions.length} transactions
        </Button>
      ]}
    >
      {transaction ? (
        <div className="flex flex-col">
          <div className="p-5">
            Splitting a transaction will create individual transactions that you can categorize and manage separately.
          </div>

          <div className="px-4 py-3 bg-gray-200">
            <div className="font-bold">Original transaction</div>
          </div>

          <TransactionItem transaction={transaction} />

          <div className="px-4 py-3 bg-gray-200">
            <div className="font-bold">Split transactions</div>
          </div>

          {splitTransactions.map((splitTransaction) => (
            <SplitTransactionItem
              key={splitTransaction.id}
              transaction={splitTransaction}
              onEdit={(t) => {
                setSplitTransactions((s) => [...s.filter((s) => s.id !== t.id), t])
              }}
            />
          ))}

          <Button icon={<IoIosAddCircleOutline size={18} />} className="mt-3 self-center" onClick={onAddSplit}>
            Add a split
          </Button>

          <div className="flex items-center my-3 mx-5">
            <div className="font-bold grow text-outline">LEFT TO SPLIT</div>
            <div className="text-base font-bold">
              {formatDollarsSigned(leftToSplit, transaction.account.currencyCode)}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
    </Modal>
  )
}
