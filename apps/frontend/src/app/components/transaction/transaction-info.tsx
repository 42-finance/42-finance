import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MuiButton,
  Snackbar,
  Switch,
  TextField
} from '@mui/material'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ApiQuery,
  EditTransactionRequest,
  deleteAttachment,
  editTransaction,
  getGroups,
  uploadAttachment
} from 'frontend-api'
import { Tag, Transaction } from 'frontend-types'
import { dateToLocal, dateToUtc, formatAccountName, formatDollars } from 'frontend-utils'
import _ from 'lodash'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AiOutlineCloudUpload, AiOutlineDelete } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

import { debounce } from '../../utils/debounce/debounce.utils'
import { IconButton } from '../common/icon-button/icon-button'
import { ActivityIndicator } from '../common/loader/activity-indicator'
import { SelectGroup } from '../common/select/select-group'
import { SingleDatePicker } from '../common/single-date-picker'
import { Tooltip } from '../common/tooltip/tooltip'
import { SelectTags } from '../tags/select-tags'

type Props = {
  transaction: Transaction
}

export const TransactionInfo: React.FC<Props> = ({ transaction }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [updatedCategoryId, setUpdatedCategoryId] = useState<number | null>(null)
  const [attachmentFiles, setAttachmentFiles] = useState<(File & { preview: string })[]>([])
  const [deleteAttachmentId, setDeleteAttachmentId] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    mutateAttachment(acceptedFiles)
    setAttachmentFiles((files) => [
      ...files,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const { mutate } = useMutation({
    mutationFn: async (request: EditTransactionRequest) => {
      const res = await editTransaction(transaction.id, request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
      }
    }
  })

  const { mutate: mutateAttachment } = useMutation({
    mutationFn: async (files: File[]) => {
      const data = new FormData()
      for (const file of files) {
        data.append('files', file)
      }
      const res = await uploadAttachment(transaction.id, data)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        const filenames = files.map((f) => f.name)
        setAttachmentFiles((attachmentFiles) => attachmentFiles.filter((a) => !filenames.includes(a.name)))
      }
    }
  })

  const { mutate: mutateDeleteAttachment, isPending: pendingDeleteAttachment } = useMutation({
    mutationFn: async (attachment: string) => {
      const res = await deleteAttachment(transaction.id, attachment)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        setDeleteAttachmentId(null)
      }
    }
  })

  const renderDetail = (title: string, detail: ReactNode, height: string = 'h-[75px]', className: string = '') => {
    return (
      <div className={`flex items-center px-4 ${height} ${className} border-b`}>
        <div className="text-outline grow">{title}</div>
        {detail}
      </div>
    )
  }

  const { data: groups = [], isFetching: fetchingGroups } = useQuery({
    queryKey: [ApiQuery.Groups],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const groupItems = useMemo(
    () =>
      groups.map((g) => ({
        label: g.name,
        options: g.categories.map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))
      })),
    [groups]
  )

  const updatedCategory = useMemo(
    () => (updatedCategoryId ? groups.flatMap((g) => g.categories).find((c) => c.id === updatedCategoryId) : null),
    [groups, updatedCategoryId]
  )

  const renderUploader = () => (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        className={`flex items-center p-4 border border-dashed ${
          isDragActive ? 'border-lighter-green bg-lighter-green/10' : 'border-gray-300 bg-gray-100'
        } hover:border-lighter-green cursor-pointer`}
      >
        <AiOutlineCloudUpload size={24} />
        <div className="ml-2">Upload a file</div>
      </div>
    </div>
  )

  const formatAttachment = (attachment: string) => {
    const parts = attachment.split('_')
    return parts[parts.length - 1]
  }

  return (
    <>
      <Snackbar
        open={updatedCategory != null}
        autoHideDuration={5000}
        onClose={() => setUpdatedCategoryId(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={
          <div>
            <div>
              Updated to {updatedCategory?.icon} {updatedCategory?.name}
            </div>
            <div className="text-outline mt-1">Create a rule to do this automatically</div>
          </div>
        }
        action={
          <Button
            onClick={() =>
              navigate(
                `/settings?setting=rules&add=1&merchantName=${transaction.merchant.name}&newCategoryId=${updatedCategory?.id}`
              )
            }
          >
            CREATE
          </Button>
        }
        ContentProps={{
          classes: {
            root: 'bg-white! text-black!'
          }
        }}
      />
      <div className="flex flex-col">
        <div className="text-center text-3xl py-6 border-b w-full">
          {formatDollars(transaction.amount, transaction.account.currencyCode)}
        </div>
        {renderDetail(
          'Merchant',
          <>
            {!_.isEmpty(transaction.merchant.icon) && (
              <Avatar src={transaction.merchant.icon} className="mr-2" sx={{ width: 32, height: 32 }} />
            )}
            <div className="text-base">{transaction.merchant.name}</div>
          </>
        )}
        {renderDetail('Original Statement', <div className="text-base">{transaction.name}</div>)}
        {renderDetail('History', <div className="text-base">{transaction.historyCount} transactions</div>)}
        {renderDetail('Account', <div className="text-base">{formatAccountName(transaction.account)}</div>)}
        {renderDetail(
          'Category',
          <SelectGroup
            options={groupItems}
            loading={fetchingGroups}
            value={transaction.categoryId}
            onChange={(value) => {
              if (value) {
                transaction.categoryId = value
                mutate({ categoryId: value })
                setUpdatedCategoryId(value)
              }
            }}
          />
        )}
        {renderDetail(
          'Date',
          <SingleDatePicker
            value={dateToLocal(transaction.date)}
            onChange={(date) => {
              if (date) {
                transaction.date = dateToUtc(date)
                mutate({ date: dateToUtc(date) })
              }
            }}
          />
        )}
        {renderDetail(
          'Tags',
          <div className="ml-4 w-[300px] max-w-[300px]">
            <SelectTags
              tagIds={transaction.tags?.map((t) => t.id) ?? []}
              onChange={(tagIds) => {
                transaction.tags = tagIds.map((t) => ({ id: t })) as Tag[]
                mutate({ tagIds })
              }}
            />
          </div>
        )}
        {renderDetail(
          'Needs Review',
          <Switch
            checked={transaction.needsReview}
            onChange={(e) => {
              transaction.needsReview = e.target.checked
              mutate({ needsReview: e.target.checked })
            }}
          />
        )}
        {renderDetail(
          'Hide',
          <Switch
            checked={transaction.hidden}
            onChange={(e) => {
              transaction.hidden = e.target.checked
              mutate({ hidden: e.target.checked })
            }}
          />
        )}
        {renderDetail(
          'Notes',
          <div className="ml-4 w-[300px] max-w-[300px]">
            <TextField
              placeholder="Notes"
              multiline
              defaultValue={transaction.notes}
              onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                transaction.notes = e.target.value
                mutate({ notes: e.target.value })
              }, 500)}
              fullWidth
            />
          </div>,
          '',
          'py-2'
        )}
        {renderDetail(
          'Attachments',
          <div className="flex flex-col gap-2 ml-4 w-[300px] max-w-[300px]">
            <>
              {transaction.attachments.map((file) => (
                <div className="flex items-center p-4 border rounded-md ">
                  <a href={file} className="flex items-center grow text-black">
                    <img key={file} src={file} className="w-12 h-12 rounded-md" />
                    <div className="mx-2">{formatAttachment(file)}</div>
                  </a>
                  <Tooltip body="Delete" color="bg-red-600">
                    <IconButton
                      danger
                      icon={<AiOutlineDelete />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteAttachmentId(file)
                      }}
                    />
                  </Tooltip>
                </div>
              ))}
              {attachmentFiles.map((file) => (
                <div className="flex items-center p-4 border rounded-md">
                  <img
                    key={file.name}
                    src={file.preview}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview)
                    }}
                    className="w-12 h-12 rounded-md"
                  />
                  <div className="mx-2 grow">{file.name}</div>
                  <ActivityIndicator size={30} />
                </div>
              ))}
              {renderUploader()}
            </>
          </div>,
          '',
          'py-2'
        )}
      </div>
      <Dialog open={deleteAttachmentId != null} onClose={() => setDeleteAttachmentId(null)}>
        <DialogTitle>Delete Attachment</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this attachment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteAttachmentId(null)}>No</MuiButton>
          <LoadingButton
            onClick={() => mutateDeleteAttachment(deleteAttachmentId as string)}
            loading={pendingDeleteAttachment}
          >
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
