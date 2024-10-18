import React from 'react'

import logo from '../../../assets/images/42f.svg'
import { Card } from './card/card'

type Props = {
  children: React.ReactNode
  contentMaxWidth?: string
}

export const AnonymousLayout: React.FC<Props> = ({ children, contentMaxWidth = 'max-w-[470px]' }) => {
  return (
    <div className="flex w-full h-screen grow text-gray-300 bg-white overflow-hidden">
      <div className="flex w-full overflow-y-auto justify-center">
        <div className={`flex flex-col w-full ${contentMaxWidth} md:px-12 h-screen`}>
          <div className="grow" />
          <Card className="hidden md:block p-6">
            <div className="flex flex-col">
              <img className="w-[75px] mb-[80px] mt-[40px] self-center" src={logo} alt="42F" />
              {children}
            </div>
          </Card>
          <div className="md:hidden flex flex-col mx-4">
            <img className="w-[75px] mb-[80px] mt-[40px] self-center" src={logo} alt="42F" />
            {children}
          </div>
          <div className="grow" />
        </div>
      </div>
    </div>
  )
}
