import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ApiQuery,
  DeleteUserInviteRequest,
  deleteHouseholdUser,
  deleteUserInvite,
  getHouseholdUsers
} from 'frontend-api'
import { HouseholdUser, User } from 'frontend-types'
import { getInitials, lightColors, mapUserPermission } from 'frontend-utils'
import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa6'
import { UserPermission } from 'shared-types'

import { Avatar } from '../common/avatar'
import { Button } from '../common/button/button'
import { Card } from '../common/card/card'
import { confirmModal } from '../common/confirm-modal/confirm-modal'
import { IconButton } from '../common/icon-button/icon-button'
import { Tooltip } from '../common/tooltip/tooltip'
import { InviteUserModal } from '../modals/invite-user-modal'

export const SettingsMembers = () => {
  const queryClient = useQueryClient()

  const [showInviteUserModal, setShowInviteUserModal] = useState(false)

  const { data: householdUsers = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.HouseholdUsers],
    queryFn: async () => {
      const res = await getHouseholdUsers()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { mutate: deleteUserInviteMutation, isPending: submittingDeleteUserInvite } = useMutation({
    mutationFn: async (request: DeleteUserInviteRequest) => {
      const res = await deleteUserInvite(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.HouseholdUsers] })
      }
    }
  })

  const deleteInvite = async (householdUser: HouseholdUser) => {
    if (
      await confirmModal({
        content: `Are you sure you want to delete this invitation?`
      })
    ) {
      deleteUserInviteMutation({ email: householdUser.email })
    }
  }

  const { mutate: deleteHouseholdUserMutation, isPending: submittingDeleteHouseholdUser } = useMutation({
    mutationFn: async (userId: number) => {
      const res = await deleteHouseholdUser(userId)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.HouseholdUsers] })
      }
    }
  })

  const deleteUser = async (user: User) => {
    if (
      await confirmModal({
        content: `Are you sure you want to remove this user from this household?`
      })
    ) {
      deleteHouseholdUserMutation(user.id)
    }
  }

  return (
    <>
      <Card
        title="Members"
        className="mt-4"
        extra={
          <Button type="primary" onClick={() => setShowInviteUserModal(true)}>
            Invite User
          </Button>
        }
      >
        <div>
          {householdUsers.map((householdUser) => (
            <div className="border-t first:border-0">
              {householdUser.user ? (
                <div className="flex items-center p-5">
                  <Avatar className="mr-4">
                    <div>{getInitials(householdUser.user.name)}</div>
                  </Avatar>
                  <div className="grow">
                    <div className="text-base">{householdUser.user.name}</div>
                    <div className="text-outline">{mapUserPermission(householdUser.permission)}</div>
                  </div>
                  {householdUser.permission !== UserPermission.Owner && (
                    <Tooltip body="Delete" color="bg-red-600">
                      <IconButton
                        danger
                        icon={<AiOutlineDelete />}
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteUser(householdUser.user)
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              ) : (
                <div className="flex items-center p-5">
                  <Avatar className="mr-4">
                    <FaUser size={24} color={lightColors.onPrimary} />
                  </Avatar>
                  <div className="grow">
                    <div className="text-base">{householdUser.email}</div>
                    <div className="text-outline">{mapUserPermission(householdUser.permission)} - Pending</div>
                  </div>
                  <Tooltip body="Delete" color="bg-red-600">
                    <IconButton
                      danger
                      icon={<AiOutlineDelete />}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteInvite(householdUser)
                      }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      {showInviteUserModal && (
        <InviteUserModal
          onClose={() => {
            setShowInviteUserModal(false)
          }}
        />
      )}
    </>
  )
}
