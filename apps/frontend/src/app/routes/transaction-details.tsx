import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteTransaction, getTransaction } from 'frontend-api'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { TransactionInfo } from '../components/transaction/transaction-info'

export const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: transaction, isFetching } = useQuery({
    queryKey: [ApiQuery.Transaction, id],
    queryFn: async () => {
      const res = await getTransaction(id as string)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    }
  })

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async () => {
      const res = await deleteTransaction(id as string)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        toast.success('Transaction deleted')
      }
    }
  })

  return (
    <>
      <div className="sticky top-0 z-50">{isFetching && <LinearProgress />}</div>
      {transaction && (
        <>
          <TransactionInfo transaction={transaction} />
          <Dialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>Delete transaction?</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete this transaction?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)}>No</Button>
              <Button onClick={() => deleteMutation()}>Yes</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  )
}
