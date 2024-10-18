import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getMerchants } from 'frontend-api'
import { lightColors } from 'frontend-utils'
import _ from 'lodash'
import { useState } from 'react'
import { FaBuilding } from 'react-icons/fa6'
import { StringParam, useQueryParams } from 'use-query-params'

import { Avatar } from '../common/avatar'
import { Card } from '../common/card/card'
import { ActivityIndicator } from '../common/loader/activity-indicator'
import { EditMerchantModal } from '../modals/edit-merchant-modal'

export const SettingsMerchants = () => {
  const [query] = useQueryParams({
    search: StringParam
  })

  const { search } = query

  const [editMerchantId, setEditMerchantId] = useState<number | null>(null)

  const { data: merchants = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Merchants, search],
    queryFn: async () => {
      const res = await getMerchants({ search })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  if (fetching && merchants.length === 0) {
    return (
      <div className="mt-8">
        <ActivityIndicator />
      </div>
    )
  }

  return (
    <>
      <Card title="Merchants" className="mt-4">
        {merchants.map((merchant) => (
          <div
            className="border-t first:border-0 hover:opacity-75 cursor-pointer"
            onClick={() => setEditMerchantId(merchant.id)}
          >
            <div className="flex w-full items-center p-4">
              {_.isEmpty(merchant.icon) ? (
                <Avatar className="mr-4 bg-surface">
                  <FaBuilding size={20} color={lightColors.outline} />
                </Avatar>
              ) : (
                <Avatar className="mr-4">
                  <img src={merchant.icon} />
                </Avatar>
              )}
              <div>
                <div className="text-base">{merchant.name}</div>
                <div className="text-outline">{merchant.transactionCount} transactions</div>
              </div>
            </div>
          </div>
        ))}
      </Card>
      {editMerchantId && (
        <EditMerchantModal
          merchantId={editMerchantId}
          onClose={() => {
            setEditMerchantId(null)
          }}
        />
      )}
    </>
  )
}
