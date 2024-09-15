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
import { ApiQuery, deleteRule, getRules } from 'frontend-api'
import { formatDollars, mapAmountFilter, mapNameFilter, mapTransactionAmountType } from 'frontend-utils'
import { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { AmountFilter } from 'shared-types'
import { BooleanParam, NumberParam, StringParam, useQueryParams } from 'use-query-params'

import { Button } from '../common/button/button'
import { Card } from '../common/card/card'
import { IconButton } from '../common/icon-button/icon-button'
import { ActivityIndicator } from '../common/loader/activity-indicator'
import { Tooltip } from '../common/tooltip/tooltip'
import { AddRuleModal } from '../modals/add-rule-modal'
import { EditRuleModal } from '../modals/edit-rule-modal'

export const SettingsRules = () => {
  const queryClient = useQueryClient()

  const [query] = useQueryParams({
    add: BooleanParam,
    merchantName: StringParam,
    newCategoryId: NumberParam,
    search: StringParam
  })

  const { add, merchantName, newCategoryId, search } = query

  const [showAddRule, setShowAddRule] = useState<boolean>(false)
  const [editRuleId, setEditRuleId] = useState<number | null>(null)
  const [deleteRuleId, setDeleteRuleId] = useState<number | null>(null)

  const { data: rules = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Rules, search],
    queryFn: async () => {
      const res = await getRules({ search })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteRule(deleteRuleId as number)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Rules] })
        setDeleteRuleId(null)
        toast.success('Rule deleted')
      }
    }
  })

  useEffect(() => {
    if (add) {
      setShowAddRule(true)
    }
  }, [add])

  if (fetching && rules.length === 0) {
    return (
      <div className="mt-8">
        <ActivityIndicator />
      </div>
    )
  }

  return (
    <>
      <Card
        title="Rules"
        className="mt-4"
        extra={
          <Button type="primary" onClick={() => setShowAddRule(true)}>
            Add Rule
          </Button>
        }
      >
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="border-t first:border-0 hover:opacity-75 cursor-pointer"
            onClick={() => setEditRuleId(rule.id)}
          >
            <div className="flex p-4">
              <div className="grow">
                {rule.account && (
                  <div className="text-base">
                    If account equals {rule.account.name} (...{rule.account.mask})
                  </div>
                )}
                {rule.amountType && rule.amountFilterType && rule.amountValue != null && (
                  <div className="text-base">
                    If transaction is a {mapTransactionAmountType(rule.amountType).toLowerCase()} and the amount is{' '}
                    {mapAmountFilter(rule.amountFilterType).toLowerCase()} {formatDollars(rule.amountValue)}
                    {rule.amountFilterType === AmountFilter.Between ? ` and ${formatDollars(rule.amountValue2)}` : ''}
                  </div>
                )}
                {rule.category && (
                  <div className="text-base">
                    If category equals {rule.category.icon} {rule.category.name}"
                  </div>
                )}
                {rule.merchantValueFilter && rule.merchantName && (
                  <div className="text-base">
                    If name {mapNameFilter(rule.merchantValueFilter).toLowerCase()} "{rule.merchantName}"
                  </div>
                )}
                {rule.merchantValueFilter && rule.merchantOriginalStatement && (
                  <div className="text-base">
                    If original statement {mapNameFilter(rule.merchantValueFilter).toLowerCase()} "
                    {rule.merchantOriginalStatement}"
                  </div>
                )}
                {rule.newMerchantName && <div className="text-outline">Rename merchant to {rule.newMerchantName}</div>}
                {rule.newCategory && <div className="text-outline">Recategorize to {rule.newCategory.name}</div>}
                {rule.needsReview != null && (
                  <div className="text-outline">
                    Set review status to {rule.needsReview ? 'needs review' : 'reviewed'}
                  </div>
                )}
                {rule.hideTransaction != null && (
                  <div className="text-outline">
                    Set transaction visibility to {rule.hideTransaction ? 'hidden' : 'visible'}
                  </div>
                )}
              </div>
              <Tooltip body="Delete" color="bg-red-600">
                <IconButton
                  danger
                  icon={<AiOutlineDelete />}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteRuleId(rule.id)
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </Card>
      {editRuleId && (
        <EditRuleModal
          ruleId={editRuleId}
          onClose={() => {
            setEditRuleId(null)
          }}
        />
      )}
      {showAddRule && (
        <AddRuleModal
          onClose={() => {
            setShowAddRule(false)
          }}
          merchantName={merchantName || undefined}
          newCategoryId={newCategoryId || undefined}
        />
      )}
      <Dialog open={deleteRuleId != null} onClose={() => setDeleteRuleId(null)}>
        <DialogTitle>Delete rule?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this rule?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setDeleteRuleId(null)}>No</MuiButton>
          <LoadingButton onClick={() => deleteMutation()} loading={submittingDelete}>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
