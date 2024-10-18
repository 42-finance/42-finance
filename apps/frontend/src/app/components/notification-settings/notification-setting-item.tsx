import { Checkbox } from '../common/checkbox/checkbox'

type Props = {
  label: string
  value: boolean
  onValueChanged: (value: boolean) => void
  loading: boolean
}

export const NotificationSettingItem: React.FC<Props> = ({ label, value, onValueChanged, loading }) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 border-b border-gray-200 first:border-t first:pt-6 last:mb-0">
      <div className="flex items-center mr-6 pb-6">
        <div>
          <div className="font-semibold">
            <span>{label}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center bg-gray-50 ml-16 mb-6 p-2.5 border border-gray-200 rounded-sm">
        <div>
          <Checkbox
            className="ml-4 text-xs leading-6"
            disabled={loading}
            checked={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault()
              onValueChanged(e.target.checked)
            }}
          >
            Push Notifications
          </Checkbox>
          <Checkbox
            className="ml-4 text-xs leading-6"
            disabled={loading}
            checked={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault()
              onValueChanged(e.target.checked)
            }}
          >
            Emails
          </Checkbox>
        </div>
      </div>
    </div>
  )
}
