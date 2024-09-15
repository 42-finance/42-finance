import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { Tooltip } from '../tooltip/tooltip'

type Props = {
  addonAfter?: React.ReactNode
  tooltip?: string
  label: React.ReactNode
  value?: string
}

export const FormInputReadOnly: React.FC<Props> = (props) => {
  const { addonAfter, tooltip, label, value } = props

  const rounded = addonAfter ? 'rounded-none rounded-l-sm' : 'rounded-sm'

  return (
    <div>
      <label className="relative mb-1 flex items-center">
        {label}
        {tooltip && (
          <Tooltip className="ml-1 text-base text-gray-400" color="bg-midnight-blue" body={tooltip}>
            <AiOutlineQuestionCircle />
          </Tooltip>
        )}
      </label>
      <div className="flex">
        <div className="relative w-full">
          <input
            className={`block w-full text-sm p-2 bg-gray-100 text-gray-500 border border-gray-300 ${rounded} focus:outline-none focus:border-midnight-blue focus:ring-midnight-blue/30`}
            data-lpignore="true"
            disabled
            readOnly
            type="text"
            value={value}
          />
        </div>
        {addonAfter && (
          <div className="flex items-center px-3 text-sm text-gray-400 bg-gray-100 border border-l-0 border-gray-300 rounded-r-sm">
            {addonAfter}
          </div>
        )}
      </div>
      <div className="text-xs min-h-[30px] mt-1" />
    </div>
  )
}
