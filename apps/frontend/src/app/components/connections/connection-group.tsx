import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteConnection } from 'frontend-api'
import { Connection } from 'frontend-types'
import {
  formatAccountName,
  formatDateDifference,
  lightColors,
  mapAccountSubType,
  mapConnectionType
} from 'frontend-utils'
import { useMemo } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FaBuilding } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { ConnectionType } from 'shared-types'

import { Avatar } from '../common/avatar'
import { Card } from '../common/card/card'
import { confirmModal } from '../common/confirm-modal/confirm-modal'
import { IconButton } from '../common/icon-button/icon-button'
import { Tooltip } from '../common/tooltip/tooltip'

type Props = {
  connection: Connection
}

export const ConnectionGroup: React.FC<Props> = ({ connection }) => {
  const queryClient = useQueryClient()

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteConnection(connection.id, { keepData: false })
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Connections] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        toast.success('Connection deleted')
      }
    }
  })

  const deleteItem = async () => {
    if (
      await confirmModal({
        content: `Are you sure you want to delete ${connection.institutionName}?`
      })
    ) {
      deleteMutation()
    }
  }

  const lastUpdated = useMemo(
    () =>
      connection.accounts.reduce(
        (acc, value) => {
          if (acc == null || value.updatedAt.getTime() > acc.getTime()) {
            return value.updatedAt
          }
          return acc
        },
        null as Date | null
      ),
    [connection]
  )

  return (
    <Card className="mt-4">
      <div>
        <div className="flex items-center px-4 p-4">
          {connection.institutionLogo == null ? (
            <Avatar className="mr-4 bg-surface">
              <FaBuilding size={20} color={lightColors.outline} />
            </Avatar>
          ) : connection.type === ConnectionType.Plaid ? (
            <Avatar className="mr-4">
              <img src={`data:image/png;base64,${connection.institutionLogo}`} />
            </Avatar>
          ) : (
            <Avatar className="mr-4">
              <img src={connection.institutionLogo} />
            </Avatar>
          )}
          <div className="grow">
            <div className="text-base font-bold">{connection.institutionName}</div>
            <div className="text-outline">
              {mapConnectionType(connection.type)} · Last update {formatDateDifference(lastUpdated ?? new Date())}
            </div>
          </div>
          <Tooltip body="Delete" color="bg-red-600">
            <IconButton
              danger
              icon={<AiOutlineDelete />}
              onClick={(e) => {
                e.stopPropagation()
                deleteItem()
              }}
            />
          </Tooltip>
        </div>
        {connection.accounts.map((account) => (
          <div key={account.id}>
            <div className="p-4 w-full border-t">
              <div className="text-base">{formatAccountName(account)}</div>
              <div className="text-outline">{mapAccountSubType(account.subType)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
