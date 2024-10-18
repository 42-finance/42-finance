import React from 'react'

import { Card } from '../components/common/card/card'
import { CashFlowGraph } from '../components/reports/cash-flow-graph'
import { ExpensesGraph } from '../components/reports/expenses-graph'
import { IncomeGraph } from '../components/reports/income-graph'

export const Reports: React.FC = () => {
  return (
    <div className="md:p-4">
      <Card title="Cash Flow">
        <CashFlowGraph />
      </Card>
      <Card title="Income" className="mt-4">
        <IncomeGraph />
      </Card>
      <Card title="Expenses" className="mt-4">
        <ExpensesGraph />
      </Card>
    </div>
  )
}
