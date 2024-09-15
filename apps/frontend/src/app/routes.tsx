import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { RestrictedRoute } from './components/common/restricted-route'
import { EditTransactionModal } from './components/modals/edit-transaction-modal'
import { AccountDetails } from './routes/account-details'
import { Budget } from './routes/budget'
import { CategoryDetails } from './routes/category'
import { Dashboard } from './routes/dashboard'
import { GroupDetails } from './routes/group'
import { MerchantDetails } from './routes/merchant'
import { ReportDetails } from './routes/report-details'
import { Reports } from './routes/reports'
import { Settings } from './routes/settings'
import { Transactions } from './routes/transactions'
import { Unauthorized } from './routes/unauthorized'

export const RoutesContainer: React.FC = () => (
  <Routes>
    <Route
      path="/accounts/:id"
      element={
        <RestrictedRoute>
          <AccountDetails />
        </RestrictedRoute>
      }
    />
    <Route
      path="/budget"
      element={
        <RestrictedRoute>
          <Budget />
        </RestrictedRoute>
      }
    />
    <Route
      path="/category/:id"
      element={
        <RestrictedRoute>
          <CategoryDetails />
        </RestrictedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <RestrictedRoute>
          <Dashboard />
        </RestrictedRoute>
      }
    />
    <Route
      path="/group/:id"
      element={
        <RestrictedRoute>
          <GroupDetails />
        </RestrictedRoute>
      }
    />
    <Route
      path="/merchant/:id"
      element={
        <RestrictedRoute>
          <MerchantDetails />
        </RestrictedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <RestrictedRoute>
          <Reports />
        </RestrictedRoute>
      }
    />
    <Route
      path="/reports/:date"
      element={
        <RestrictedRoute>
          <ReportDetails />
        </RestrictedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <RestrictedRoute>
          <Settings />
        </RestrictedRoute>
      }
    />
    <Route
      path="/transactions"
      element={
        <RestrictedRoute>
          <Transactions />
        </RestrictedRoute>
      }
    >
      <Route path=":id" element={<EditTransactionModal />} />
    </Route>
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/" element={<Navigate replace to="/dashboard" />} />
    <Route path="*" element={<Navigate replace to="/dashboard" />} />
  </Routes>
)
