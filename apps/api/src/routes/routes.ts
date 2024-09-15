import { NextFunction, Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'

import '../models/http/request'
import { acceptInvitationRouter } from './acceptInvitation'
import { accountRouter } from './account'
import { balanceHistoryRouter } from './balanceHistory'
import { budgetRouter } from './budget'
import { categoryRouter } from './category'
import { changePasswordRouter } from './changePassword'
import { confirmEmailRouter } from './confirmEmail'
import { connectionRouter } from './connection'
import { exchangeRateRouter } from './exchangeRate'
import expenseRouter from './expense/expenseRoutes'
import { finicityRouter } from './finicity'
import { forgotPasswordRouter } from './forgotPassword'
import { goalRouter } from './goal'
import { groupRouter } from './group'
import { householdRouter } from './household'
import invoiceRouter from './invoice/invoiceRouter'
import { loginRouter } from './login'
import { merchantRouter } from './merchant'
import { mxRouter } from './mx'
import { notificationSettingsRouter } from './notificationSettings'
import { notificationTokenRouter } from './notificationToken'
import { plaidRouter } from './plaid'
import { propertyRouter } from './property'
import { quilttRouter } from './quiltt'
import { recurringTransactionRouter } from './recurringTransaction'
import { registerRouter } from './register'
import rentalUnitRouter from './rentalUnit/rentalUnitRoutes'
import { resetPasswordRouter } from './resetPassword'
import { ruleRouter } from './rule'
import { setPasswordRouter } from './setPassword'
import { stripeRouter } from './stripe'
import { tagRouter } from './tags'
import tenantRouter from './tenant/tenantRoutes'
import { transactionRouter } from './transaction'
import { userRouter } from './user'
import { userInviteRouter } from './userInvite'
import { webhookRouter } from './webhook'

function authenticateToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return response.sendStatus(401)
  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, payload: any) => {
    if (err) return response.sendStatus(401)
    request.userId = payload.userId
    request.householdId = payload.householdId
    next()
  })
}

const router = Router()
router.use('/accounts', authenticateToken, accountRouter)
router.use('/accept-invitation', acceptInvitationRouter)
router.use('/balance-history', authenticateToken, balanceHistoryRouter)
router.use('/budgets', authenticateToken, budgetRouter)
router.use('/categories', authenticateToken, categoryRouter)
router.use('/change-password', authenticateToken, changePasswordRouter)
router.use('/connections', authenticateToken, connectionRouter)
router.use('/confirm-email', confirmEmailRouter)
router.use('/exchange-rates', authenticateToken, exchangeRateRouter)
router.use('/expenses', authenticateToken, expenseRouter)
router.use('/forgot-password', forgotPasswordRouter)
router.use('/finicity', authenticateToken, finicityRouter)
router.use('/goals', authenticateToken, goalRouter)
router.use('/groups', authenticateToken, groupRouter)
router.use('/household', authenticateToken, householdRouter)
router.use('/invoices', authenticateToken, invoiceRouter)
router.use('/login', loginRouter)
router.use('/merchants', authenticateToken, merchantRouter)
router.use('/mx', authenticateToken, mxRouter)
router.use('/notification-settings', authenticateToken, notificationSettingsRouter)
router.use('/notification-tokens', authenticateToken, notificationTokenRouter)
router.use('/plaid', authenticateToken, plaidRouter)
router.use('/properties', authenticateToken, propertyRouter)
router.use('/quiltt', authenticateToken, quilttRouter)
router.use('/recurring-transactions', authenticateToken, recurringTransactionRouter)
router.use('/reset-password', resetPasswordRouter)
router.use('/register', registerRouter)
router.use('/rentalUnits', authenticateToken, rentalUnitRouter)
router.use('/rules', authenticateToken, ruleRouter)
router.use('/set-password', authenticateToken, setPasswordRouter)
router.use('/stripe', authenticateToken, stripeRouter)
router.use('/tags', authenticateToken, tagRouter)
router.use('/tenants', authenticateToken, tenantRouter)
router.use('/transactions', authenticateToken, transactionRouter)
router.use('/user-invites', authenticateToken, userInviteRouter)
router.use('/users', authenticateToken, userRouter)
router.use('/webhook', webhookRouter)

export { router }
