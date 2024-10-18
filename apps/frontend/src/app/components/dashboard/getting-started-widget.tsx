import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditUserRequest, editUser, getUser } from 'frontend-api'
import { getFirstName } from 'frontend-utils'
import { ReactNode } from 'react'
import { AiOutlineAppstore } from 'react-icons/ai'
import { CiBank } from 'react-icons/ci'
import { FaCheck, FaDollarSign, FaMoneyBillTrendUp, FaRegCreditCard } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

import { Button } from '../common/button/button'
import { Card } from '../common/card/card'

export const GettingStartedWidget = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: [ApiQuery.User],
    queryFn: async () => {
      const res = await getUser()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditUserRequest) => {
      const res = await editUser(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.User] })
      }
    }
  })

  const renderItem = (title: string, icon: ReactNode, complete: boolean, onClick: () => void) => {
    return (
      <div className="flex items-center p-4 hover:opacity-75 cursor-pointer" onClick={onClick}>
        <div className="mr-2 bg-primary rounded-full w-7 h-7 flex items-center justify-center">{icon}</div>
        <div className="text-base text-outline grow">{title}</div>
        <div
          className={`flex items-center justify-center rounded-full mr-3 w-5 h-5 ${complete ? 'bg-primary' : 'bg-outline'}`}
        >
          {complete && <FaCheck color="white" />}
        </div>
      </div>
    )
  }

  if (!user?.accountSetup || user.hideGettingStarted) {
    return null
  }

  if (
    user.accountSetup.accounts &&
    user.accountSetup.categories &&
    user.accountSetup.budget &&
    user.accountSetup.currency
  ) {
    return null
  }

  return (
    <Card title="Getting Started">
      <div className="flex flex-col">
        <div className="text-lg m-4">
          Welcome {getFirstName(user.name)}, complete the following steps to finish setting up your account
        </div>
        <div className="border-t" />
        {renderItem(
          'Purchase subscription',
          <FaRegCreditCard size={18} color="white" />,
          user.accountSetup.subscription,
          () => navigate('/settings?setting=subscription')
        )}
        <div className="border-t" />
        {renderItem('Add an account', <CiBank size={20} color="white" />, user.accountSetup.accounts, () => {})}
        <div className="border-t" />
        {renderItem(
          'Add a custom category',
          <AiOutlineAppstore size={20} color="white" />,
          user.accountSetup.categories,
          () => navigate('/settings?setting=categories')
        )}
        <div className="border-t" />
        {renderItem('Create a budget', <FaMoneyBillTrendUp size={16} color="white" />, user.accountSetup.budget, () =>
          navigate('/budget')
        )}
        <div className="border-t" />
        {renderItem(
          'Update preferred currency',
          <FaDollarSign size={18} color="white" />,
          user.accountSetup.currency,
          () => navigate('/settings')
        )}
        <div className="border-t" />
        <div className="self-end mr-4">
          <Button
            type="link"
            className="py-2"
            onClick={() => {
              mutate({
                hideGettingStarted: true
              })
            }}
            disabled={submitting}
            loading={submitting}
          >
            Hide Widget
          </Button>
        </div>
      </div>
    </Card>
  )
}
