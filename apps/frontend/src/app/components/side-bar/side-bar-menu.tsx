import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FaHome, FaRegCreditCard, FaSignOutAlt } from 'react-icons/fa'
import { FaChartSimple, FaMoneyBillTrendUp } from 'react-icons/fa6'
import { IoIosSettings } from 'react-icons/io'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { MenuItem } from './menu-items'

type Props = {
  onCollapse: (collapsed: boolean) => void
}

export const SideBarMenu: React.FC<Props> = ({ onCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setToken } = useUserTokenContext()

  const onLogout = () => {
    setToken(null)
    queryClient.removeQueries()
    sessionStorage.removeItem('lastLocation')
    navigate('/login')
  }

  const menuItems = [
    {
      icon: <FaHome size={22} />,
      key: '/dashboard',
      label: 'Dashboard'
    } as MenuItem,
    {
      icon: <FaRegCreditCard size={22} />,
      key: '/transactions',
      label: 'Transactions'
    } as MenuItem,
    {
      icon: <FaMoneyBillTrendUp size={22} />,
      key: '/budget',
      label: 'Budget'
    } as MenuItem,
    {
      icon: <FaChartSimple size={22} />,
      key: '/reports',
      label: 'Reports'
    } as MenuItem,
    {
      icon: <IoIosSettings size={22} />,
      key: '/settings',
      label: 'Settings'
    } as MenuItem
  ]

  const renderMenuItem = (item: MenuItem) => {
    return (
      <div key={item.key}>
        <Link
          data-testid={item['data-testid']}
          to={item.key}
          onClick={() => onCollapse(true)}
          className={`flex flex-col items-center p-3 w-full ${item.key === location.pathname ? 'text-primary' : 'text-black opacity-75 hover:opacity-100'} hover:no-underline`}
        >
          <span className="mb-[3px]">{item.icon}</span>
          <span className="text-[0.6rem] md:text-[0.75rem]">{item.label}</span>
        </Link>
      </div>
    )
  }

  return (
    <nav className="flex lg:flex-col w-full justify-center lg:overflow-y-auto flex-wrap overflow-x-hidden">
      {menuItems.map((item) => renderMenuItem(item))}
      <div className="hidden lg:flex lg:grow" />
      <div>
        <div
          onClick={onLogout}
          className={`flex flex-col items-center p-3 w-full opacity-75 hover:opacity-100 cursor-pointer`}
        >
          <span className="mb-[3px]">
            <FaSignOutAlt size={22} />
          </span>
          <span className="text-[0.6rem] md:text-[0.75rem]">Sign Out</span>
        </div>
      </div>
    </nav>
  )
}
