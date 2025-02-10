import { BsGraphUpArrow } from 'react-icons/bs'
import { FaCreditCard, FaHome } from 'react-icons/fa'
import { IoIosLink } from 'react-icons/io'

import { RoadmapItem } from './roadmap-item'

const iconSize = 32

export const Roadmap = () => {
  return (
    <section id="roadmap" className="border-t pt-16 mt-16">
      <div className="max-w-(--breakpoint-lg) mx-auto">
        <div className="gap-[24px] text-center flex flex-col justify-center items-center">
          <div className="bg-black rounded-lg text-white py-3 px-12 text-xl">Roadmap</div>
        </div>
        <div className="grid md:grid-rows-2 md:grid-cols-2 gap-6 mt-12 px-4">
          <RoadmapItem
            title="Rental Properties"
            description="We are adding rental property management tools to track your tenants, rent payments, cash flow, expenses and more."
            icon={<FaHome color="white" size={iconSize} />}
          />
          <RoadmapItem
            title="Budgeting Improvements"
            description="We are working on improving our budgeting tools to add flexibility and customization options to make us the ultimate budgeting solution."
            icon={<BsGraphUpArrow color="white" size={iconSize} />}
          />
          <RoadmapItem
            title="Bill Tracking"
            description="You will be able to track your credit card bills, subscriptions and more so you never miss a payment again."
            icon={<FaCreditCard color="white" size={iconSize} />}
          />
          <RoadmapItem
            title="More Aggregation Integrations"
            description="We are working with more data aggregation providers such as MX and Finicity so that every account you have is available to connect with us."
            icon={<IoIosLink color="white" size={iconSize} />}
          />
        </div>
      </div>
    </section>
  )
}
