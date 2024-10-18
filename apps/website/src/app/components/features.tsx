import { BsBarChartFill } from 'react-icons/bs'
import { FaCalendar } from 'react-icons/fa'
import { FaMoneyBillTrendUp, FaRegCreditCard } from 'react-icons/fa6'
import { FiTarget } from 'react-icons/fi'
import { MdRule } from 'react-icons/md'

import budget from '../../assets/images/budget.png'
import goals from '../../assets/images/goals.png'
import plaid from '../../assets/images/plaid-feature.png'
import recurring from '../../assets/images/recurring.png'
import report from '../../assets/images/report-feature.png'
import rules from '../../assets/images/rules.png'
import { FeatureItem } from './feature-item'

const iconSize = 40

export const Features = () => {
  const features = [
    {
      image: plaid,
      icon: <FaRegCreditCard color="white" size={iconSize} />,
      heading: 'Bank Connectivity',
      description:
        'Connect to more than 12,000 financial institutions to automatically sync all of your account balances and transactions without having to import data from spreadsheets ever again.'
    },
    {
      image: rules,
      icon: <MdRule color="white" size={iconSize} />,
      heading: 'Flexible Transaction Rules',
      description:
        'Create custom rules to update your transactions merchant, category and more automatically to minimize tedious manual updates.'
    },
    {
      image: budget,
      icon: <FaMoneyBillTrendUp color="white" size={iconSize} />,
      heading: 'Flexible Budgeting Tools',
      description:
        'Create a budget for your categories or groups to keep your spending in check and receive notifications if you go over your allocated amount.'
    },
    {
      image: report,
      icon: <BsBarChartFill color="white" size={iconSize} />,
      heading: 'Powerful Reporting',
      description:
        'View your spending, income and cash flow with easy to read charts and graphs. View spending breakdowns by category, group or merchant to easily find areas you are overspending.'
    },
    // {
    //   image: transactionsImage,
    //   icon: <FaRegCreditCard color="white" size={iconSize} />,
    //   heading: 'Collaborate With Family',
    //   description:
    //     'You can invite any number of family members to collaborate with their own login so you can stay in sync with everyones accounts and spending.'
    // },
    {
      image: goals,
      icon: <FiTarget color="white" size={iconSize} />,
      heading: 'Savings & Debt Goals',
      description:
        'Setup goals to track your savings or debt and set target dates or budget an allocated amount every month to each goal.'
    },
    {
      image: recurring,
      icon: <FaCalendar color="white" size={iconSize} />,
      heading: 'Recurring Transactions',
      description:
        'Our system will automatically detect recurring transactions and send you notifications when an expected payment is coming up.'
    }
  ]

  return (
    <section id="features" className="border-t pt-16 mt-16">
      <div className="flex flex-col max-w-screen-xl mx-auto justify-center items-center">
        <div className="flex justify-center">
          <div className="bg-black rounded-lg text-white py-3 px-4 lg:px-12 text-xl">Features</div>
        </div>
        {features.map((feature, index) => (
          <FeatureItem
            image={feature.image}
            icon={feature.icon}
            heading={feature.heading}
            description={feature.description}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  )
}
