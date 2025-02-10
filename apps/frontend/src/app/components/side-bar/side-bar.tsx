import './side-bar.css'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import logo from '../../../assets/images/42f.svg'
import { AccountList } from '../account/account-list'
import { Button } from '../common/button/button'
import { Card } from '../common/card/card'
import { AddAccountModal } from '../modals/add-account-modal'
import { SideBarMenu } from './side-bar-menu'

export const SideBar = () => {
  const navigate = useNavigate()
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)

  return (
    <div className="flex flex-col">
      <input
        type="checkbox"
        id="menu-open"
        className="hidden"
        checked={sideBarOpen}
        onChange={(e) => setSideBarOpen(e.target.checked)}
      />
      <header
        className="fixed top-0 left-0 right-0 z-20 text-gray-100 flex justify-between lg:hidden border-b bg-[#F5F7FA] dark:bg-neutral-800"
        data-dev-hint="mobile menu bar"
      >
        <button type="button" aria-label="Go to dashboard" onClick={() => navigate('/')} className="block p-4">
          <img className="w-[30px] dark:invert" src={logo} alt="42F" />
        </button>
        <label
          htmlFor="menu-open"
          id="mobile-menu-button"
          className="m-2 p-2 focus:outline-hidden cursor-pointer hover:opacity-75 rounded-xs text-black dark:text-white"
        >
          <svg
            id="menu-open-icon"
            className="h-6 w-6 transition duration-200 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            id="menu-close-icon"
            className="h-6 w-6 transition duration-200 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </label>
      </header>
      <aside
        id="sidebar"
        className="flex flex-col lg:flex-row z-40 fixed inset-y-0 transform lg:translate-x-0 transition duration-200 ease-in-out bg-[#F5F7FA] dark:bg-neutral-800 mt-[62px] lg:mt-0 w-full lg:w-auto"
      >
        <div className="flex lg:flex-col items-center lg:h-full lg:w-[90px] lg:border-r dark:border-neutral-700">
          <Link
            className="hidden lg:flex items-center justify-center cursor-pointer mb-[26px] mt-10"
            data-testid="logo"
            to={'/'}
          >
            <img className="w-[45px] dark:invert" src={logo} alt="42F" />
          </Link>
          <SideBarMenu onCollapse={() => setSideBarOpen(false)} />
        </div>
        <Card
          title="Accounts"
          extra={
            <Button type="primary" onClick={() => setShowAddAccountModal(true)}>
              Add Account
            </Button>
          }
          className="lg:m-4 w-full lg:w-[360px] overflow-y-auto no-scrollbar"
        >
          <AccountList onSelected={() => setSideBarOpen(false)} />
        </Card>
        {showAddAccountModal && <AddAccountModal onClose={() => setShowAddAccountModal(false)} />}
      </aside>
    </div>
  )
}
