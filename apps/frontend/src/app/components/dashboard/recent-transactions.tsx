import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTransactions } from 'frontend-api'
import { useNavigate } from 'react-router-dom'

import { Button } from '../common/button/button'
import { Card } from '../common/card/card'
import { TransactionItem } from '../transaction/transaction-item'

export const RecentTransactions = () => {
  const navigate = useNavigate()

  const { data: transactions = [] } = useQuery({
    queryKey: [ApiQuery.DashboardTransactions],
    queryFn: async () => {
      const res = await getTransactions({ limit: 4 })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  return (
    <Card title="Recent Transactions">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
      <div className="p-2">
        <Button className="w-full" onClick={() => navigate('/transactions')}>
          View all transactions
        </Button>
      </div>
    </Card>
  )
}
