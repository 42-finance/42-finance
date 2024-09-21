import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditNotificationSettingRequest, editNotificationSetting } from 'frontend-api'
import { NotificationSetting } from 'frontend-types'
import { mapNotificationSettingDescription, mapNotificationSettingType } from 'frontend-utils'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { NotificationType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { Checkbox } from '../common/checkbox/checkbox'
import { CurrencyInput } from '../common/currency-input'

type Props = {
  type: NotificationType
  value: NotificationSetting | null
}

export const NotificationSettingItem: React.FC<Props> = ({ type, value }) => {
  const queryClient = useQueryClient()
  const { currencyCode } = useUserTokenContext()

  const [sendPushNotification, setSendPushNotification] = useState(value?.sendPushNotification ?? false)
  const [sendEmail, setSendEmail] = useState(value?.sendEmail ?? false)
  const [minimumAmount, setMinimumAmount] = useState(value?.minimumAmount?.toString() ?? '0')

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: EditNotificationSettingRequest) => {
      const res = await editNotificationSetting(type, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.NotificationSettings] })
      }
    }
  })

  const showMinimumAmount = type === NotificationType.NewExpense || type === NotificationType.NewDeposit

  const onValueChanged = (sendPushNotification: boolean, sendEmail: boolean, minimumAmount: number | null) => {
    setSendPushNotification(sendPushNotification)
    setSendEmail(sendEmail)
    mutate({
      sendPushNotification,
      sendEmail,
      minimumAmount: showMinimumAmount ? minimumAmount : null
    })
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-gray-200 first:border-t border-b last:border-0 p-4">
      <div className="flex flex-col mr-4">
        <div className="font-semibold mb-1">{mapNotificationSettingType(type)}</div>
        <div className="text-outline text-sm">{mapNotificationSettingDescription(type)}</div>
        {showMinimumAmount && (
          <div className="mt-2">
            <TextField
              label="Minimum amount"
              variant="filled"
              onChange={(e) => setMinimumAmount(e.target.value)}
              value={minimumAmount}
              InputProps={{
                inputComponent: CurrencyInput as any,
                inputProps: { currencyCode },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => onValueChanged(sendPushNotification, sendEmail, Number(minimumAmount))}>
                      <FaCheck size={20} className="" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
        )}
      </div>
      <div className="flex items-center bg-gray-50 p-2.5 border border-gray-200 rounded-sm mt-2 md:mt-0">
        <Checkbox
          className="text-xs leading-6 whitespace-nowrap"
          checked={sendPushNotification}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged(e.target.checked, sendEmail, Number(minimumAmount))
          }}
        >
          Push Notification
        </Checkbox>
        <Checkbox
          className="ml-4 text-xs leading-6"
          checked={sendEmail}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged(sendPushNotification, e.target.checked, Number(minimumAmount))
          }}
        >
          Email
        </Checkbox>
      </div>
    </div>
  )
}
