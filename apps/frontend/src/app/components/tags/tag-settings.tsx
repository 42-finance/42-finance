import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MuiButton
} from '@mui/material'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteTag, getTags } from 'frontend-api'
import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { StringParam, useQueryParams } from 'use-query-params'

import { Badge } from '../common/badge'
import { Button } from '../common/button/button'
import { Card } from '../common/card/card'
import { IconButton } from '../common/icon-button/icon-button'
import { ActivityIndicator } from '../common/loader/activity-indicator'
import { Tooltip } from '../common/tooltip/tooltip'
import { AddTagModal } from '../modals/add-tag-modal'
import { EditTagModal } from '../modals/edit-tag-modal'

export const TagSettings = () => {
  const queryClient = useQueryClient()

  const [query] = useQueryParams({
    search: StringParam
  })

  const { search } = query

  const [editTagId, setEditTagId] = useState<number | null>(null)
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null)
  const [showAddTag, setShowAddTag] = useState(false)

  const { data: tags = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Tags, search],
    queryFn: async () => {
      const res = await getTags({ search })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async (tagId: number) => {
      const res = await deleteTag(tagId)
      if (res.ok && res.parsedBody?.payload) {
        setDeleteTagId(null)
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Tags] })
        toast.success('Tag deleted')
      }
    }
  })

  if (fetching && tags.length === 0) {
    return (
      <div className="mt-8">
        <ActivityIndicator />
      </div>
    )
  }

  return (
    <>
      <Card
        title="Tags"
        className="mt-4"
        extra={
          <Button type="primary" onClick={() => setShowAddTag(true)}>
            Add Tag
          </Button>
        }
      >
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center p-4 border-t first:border-0 cursor-pointer"
            onClick={() => setEditTagId(tag.id)}
          >
            <div className="flex items-center grow hover:opacity-75">
              <Badge className="mr-2" color={tag.color} />
              <div className="text-base">{tag.name}</div>
              <div className="ml-4 mt-[2px] text-outline">{tag.transactionCount} transactions</div>
            </div>
            <Tooltip body="Delete" color="bg-red-600">
              <IconButton
                danger
                icon={<AiOutlineDelete />}
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteTagId(tag.id)
                }}
              />
            </Tooltip>
          </div>
        ))}
      </Card>
      {showAddTag && (
        <AddTagModal
          onClose={() => {
            setShowAddTag(false)
          }}
        />
      )}
      {editTagId && (
        <EditTagModal
          tagId={editTagId}
          onClose={() => {
            setEditTagId(null)
          }}
        />
      )}
      <Dialog open={deleteTagId != null} onClose={() => setDeleteTagId(null)}>
        <DialogTitle>Delete Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this tag?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteTagId(null)}>No</MuiButton>
          <LoadingButton onClick={() => deleteMutation(deleteTagId as number)} loading={submittingDelete}>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
