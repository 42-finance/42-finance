import { FaArrowUp, FaBitcoin, FaCarSide, FaHouseChimney } from 'react-icons/fa6'

import PlaidIcon from '../../../assets/images/plaid.png'
import { Card } from '../common/card/card'
import { ActivityIndicator } from '../common/loader/activity-indicator'

type Props = {
  onSelected: (type: string) => void
  loading: boolean
}

export const AddAccountOptions: React.FC<Props> = ({ onSelected, loading }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card onClick={() => onSelected('plaid')} className="cursor-pointer hover:opacity-75 col-span-2 md:col-span-1">
        <div className="flex flex-col items-center p-6">
          {loading ? <ActivityIndicator /> : <img src={PlaidIcon} className="h-[50px]" />}
          <div className="mt-4">Banks & Credit Cards</div>
        </div>
      </Card>
      <Card onClick={() => onSelected('crypto')} className="cursor-pointer hover:opacity-75 col-span-2 md:col-span-1">
        <div className="flex flex-col items-center p-6">
          <FaBitcoin size={50} />
          <div className="mt-4">Crypto</div>
        </div>
      </Card>
      <Card onClick={() => onSelected('vehicle')} className="cursor-pointer hover:opacity-75 col-span-2 md:col-span-1">
        <div className="flex flex-col items-center p-6">
          <FaCarSide size={50} />
          <div className="mt-4">Vehicle</div>
        </div>
      </Card>
      <Card onClick={() => onSelected('property')} className="cursor-pointer hover:opacity-75 col-span-2 md:col-span-1">
        <div className="flex flex-col items-center p-6">
          <FaHouseChimney size={50} />
          <div className="mt-4">Property</div>
        </div>
      </Card>
      <Card onClick={() => onSelected('manual')} className="cursor-pointer hover:opacity-75 col-span-2">
        <div className="flex flex-col items-center p-6">
          <FaArrowUp size={50} />
          <div className="mt-4">Manual Account</div>
        </div>
      </Card>
    </div>
  )
}
