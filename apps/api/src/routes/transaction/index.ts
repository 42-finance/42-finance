import { Router } from 'express'
import multer from 'multer'

import { createTransaction } from './createTransaction'
import { deleteAttachment } from './deleteAttachment'
import { deleteSplitTransactions } from './deleteSplitTransactions'
import { deleteTransaction } from './deleteTransaction'
import deleteTransactions from './deleteTransactions'
import { exportTransactions } from './exportTransactions'
import { getTransaction } from './getTransaction'
import { getTransactions } from './getTransactions'
import { getTransactionsStats } from './getTransactionsStats'
import { splitTransaction } from './splitTransaction'
import { updateTransaction } from './updateTransaction'
import updateTransactions from './updateTransactions'
import { uploadAttachment } from './uploadAttachment'

const upload = multer({
  limits: {
    fileSize: 10_000_000
  },
  storage: multer.memoryStorage()
})

const transactionRouter = Router()
transactionRouter.get('/', getTransactions)
transactionRouter.get('/stats', getTransactionsStats)
transactionRouter.get('/export', exportTransactions)
transactionRouter.get('/:id', getTransaction)
transactionRouter.post('/', createTransaction)
transactionRouter.patch('/', updateTransactions)
transactionRouter.patch('/:id/split', splitTransaction)
transactionRouter.delete('/:id/split', deleteSplitTransactions)
transactionRouter.patch('/:id', updateTransaction)
transactionRouter.delete('/', deleteTransactions)
transactionRouter.delete('/:id', deleteTransaction)
transactionRouter.delete('/:id/attachment', deleteAttachment)
transactionRouter.post('/:id/attachment', upload.array('files'), uploadAttachment)
export { transactionRouter }
