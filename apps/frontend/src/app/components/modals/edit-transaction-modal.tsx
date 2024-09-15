import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Button as MuiButton
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteSplitTransactions, deleteTransaction, getTransaction } from 'frontend-api'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { SplitTransaction } from '../transaction/split-transaction'
import { TransactionInfo } from '../transaction/transaction-info'

export const EditTransactionModal: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [showSplitTransaction, setShowSplitTransaction] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteSplitsDialog, setShowDeleteSplitsDialog] = useState(false)
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)

  const { data: transaction } = useQuery({
    queryKey: [ApiQuery.Transaction, id],
    queryFn: async () => {
      const res = await getTransaction(id as string)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    }
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteTransaction(id as string)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        onClose()
        toast.success('Transaction deleted')
      }
    }
  })

  const { mutate: deleteSplitsMutation, isPending: submittingDeleteSplits } = useMutation({
    mutationFn: async () => {
      if (transaction?.splitTransactionId) {
        const res = await deleteSplitTransactions(transaction.splitTransactionId)
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
          navigate(-1)
        }
      }
    }
  })

  const open = Boolean(anchorElement)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(null)
  }

  const onDelete = () => {
    handleClose()
    setShowDeleteDialog(true)
  }

  const onSplit = () => {
    handleClose()
    setShowSplitTransaction(true)
  }

  const onClose = () => {
    navigate(-1)
  }

  if (transaction && showSplitTransaction) {
    return (
      <SplitTransaction
        transactionId={transaction.splitTransactionId ?? transaction.id}
        onClose={() => setShowSplitTransaction(false)}
      />
    )
  }

  return (
    <Modal
      title={transaction?.merchant?.name ?? 'Loading...'}
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      bodyPadding="p-0"
      headerExtra={
        <>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <BsThreeDots className="w-7 h-7" color="white" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorElement}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            {transaction?.splitTransactionId ? (
              <>
                <MenuItem onClick={onSplit}>Edit transaction splits</MenuItem>
                <MenuItem onClick={() => setShowDeleteSplitsDialog(true)} className="!text-red-600">
                  Delete transaction splits
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={onSplit}>Split transaction</MenuItem>
            )}
            <MenuItem onClick={onDelete} className="!text-red-600">
              Delete transaction
            </MenuItem>
          </Menu>
        </>
      }
    >
      {!transaction && (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
      {transaction && <TransactionInfo transaction={transaction} />}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete transaction?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this transaction?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setShowDeleteDialog(false)}>No</MuiButton>
          <LoadingButton onClick={() => deleteMutation()} loading={submittingDelete}>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog open={showDeleteSplitsDialog} onClose={() => setShowDeleteSplitsDialog(false)}>
        <DialogTitle>Delete transaction splits?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the transaction splits? The original transaction will be restored.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setShowDeleteSplitsDialog(false)}>No</MuiButton>
          <LoadingButton onClick={() => deleteSplitsMutation()} loading={submittingDeleteSplits}>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Modal>
  )
}
