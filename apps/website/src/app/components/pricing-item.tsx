import { useState } from 'react'

type Props = {
  title: string
  price: string
  yearlyPrice: string
  body: string
  showToggle?: boolean
}

export const PricingItem: React.FC<Props> = ({ title, price, yearlyPrice, body, showToggle }) => {
  const [selectedDuration, setSelectedDuration] = useState('monthly')

  return (
    <div className="flex flex-col w-full gap-4 p-6 rounded-lg border shadow-md">
      <div className="flex justify-between items-center h-[40px]">
        <div className="text-2xl font-semibold">{title}</div>
        {showToggle && (
          <div className="flex bg-gray-200 rounded-full p-1 gap-2 cursor-pointer">
            <div
              className={`flex items-center justify-center rounded-full h-[40px] w-[70px] md:w-[90px] ${selectedDuration === 'monthly' ? 'bg-white' : ''}`}
              onClick={() => setSelectedDuration('monthly')}
            >
              Monthly
            </div>
            <div
              className={`flex items-center justify-center rounded-full h-[40px] w-[70px] md:w-[90px] text-center ${selectedDuration === 'yearly' ? 'bg-white' : ''}`}
              onClick={() => setSelectedDuration('yearly')}
            >
              Yearly
            </div>
          </div>
        )}
      </div>
      <div className="text-xl font-semibold">{selectedDuration === 'monthly' ? price : yearlyPrice}</div>
      <div>
        <div className="text-base">All 42 Finance features</div>
        <div className="text-base">{body}</div>
      </div>
      <a
        href="https://app.42f.io/register"
        className="bg-black px-12 py-3 rounded-lg no-underline text-white text-center text-lg"
      >
        Get Started
      </a>
    </div>
  )
}
