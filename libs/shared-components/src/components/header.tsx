import { useContext, useState } from 'react'
import { Fa0, FaArrowLeft } from 'react-icons/fa6'

import { ScrollContext } from '../contexts'

export namespace Header {
  export type Props = {
    title: string
    hasBackButton: boolean
  }
}

export const Header: React.FC<Header.Props> = ({ title, hasBackButton }: Header.Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { yScrollPosition } = useContext(ScrollContext)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white dark:bg-black border-neutral-300 dark:border-neutral-700">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex">
          <a href="#" className="-m-1.5 p-1.5">
            <FaArrowLeft className="fill-neutral-900 dark:fill-white" />
          </a>
        </div>

        <div
          className={`flex text-neutral-900 dark:text-neutral-50 transition-opacity duration-500 ${yScrollPosition > 100 ? 'opacity-100' : 'opacity-0'}`}
        >
          {title}
        </div>

        <div className="flex opacity-0">
          <Fa0 />
        </div>
      </nav>
    </header>
  )
}
