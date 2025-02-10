import React from 'react'

import appStore from '../../assets/images/app-store.svg'
import cashFlow from '../../assets/images/cash-flow.png'
import googlePlay from '../../assets/images/google-play.svg'
import netWorth from '../../assets/images/net-worth.png'
import report from '../../assets/images/report.png'
import transactions from '../../assets/images/transactions.png'

export const Header: React.FC = () => {
  return (
    <section className="pt-[100px] md:pt-[160px] lg:pt-[200px] relative overflow-hidden">
      <div className="max-w-(--breakpoint-2xl) mx-auto px-4 md:px-12 gap-6 grid lg:grid-cols-2">
        <div className="">
          <div className="my-8 mr-0 lg:mr-5 text-center lg:text-left text-3xl md:text-[64px] font-semibold leading-[1.25] tracking-wide">
            Empower Your Money. Simplify Your Future.
          </div>
          <div className="lg:max-w-[575px] mb-8 lg:mb-12 text-center lg:text-left text-xl">
            Take control of your financial journey with our all-in-one personal finance app. Whether you're budgeting,
            saving for big goals, or tracking investments, we provide the tools you need to manage your money
            effortlessly.
            {/* From real-time insights to personalized financial tips, our app helps you stay on
                top of your finances with confidence. Simplify your life, make smarter financial choices, and watch your
                wealth grow—one step at a time. Your future is within reach, and it all starts with making your money
                work smarter for you. */}
          </div>
          <div className="flex space-x-8 justify-center">
            <a
              href="https://apps.apple.com/us/app/42finance/id6498875911"
              target="_blank"
              className="rounded-md bg-transparent p-0 text-sm font-semibold text-white shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:text-neutral-900 dark:focus-visible:outline-neutral-400"
            >
              <img src={appStore} className="h-16" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.fortytwofinance.app"
              target="_blank"
              className="rounded-md bg-transparent p-0 text-sm font-semibold text-white shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:text-neutral-900 dark:focus-visible:outline-neutral-400"
            >
              <img src={googlePlay} className="h-16" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 relative">
          <img src={transactions} className="z-10 rounded-xl my-auto row-span-2" />
          <div className="grid grid-rows-2 gap-4">
            <img src={netWorth} className="z-10 rounded-xl" />
            <img src={cashFlow} className="z-10 rounded-xl" />
          </div>
          <img src={report} className="z-10 rounded-xl my-auto row-span-2" />
          <div
            className="bg-slate-200 opacity-50 rounded-full w-full h-[75%] absolute"
            style={{
              filter: 'blur(90px)'
            }}
          />
        </div>
      </div>
    </section>
  )
}
