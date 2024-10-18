import { DisplayPreference } from 'frontend-types'
import React from 'react'

import { useLocalStorage } from '../hooks/use-local-storage.hook'

type Props = {
  children: React.ReactNode
}

type DisplayContextType = {
  displayPreference: DisplayPreference
  setDisplayPreference: (value: DisplayPreference) => void
}

const DisplayContext = React.createContext<DisplayContextType>({} as DisplayContextType)

export const useDisplayContext = () => React.useContext(DisplayContext)

export const DisplayProvider = (props: Props) => {
  const [displayPreference, setDisplayPreference] = useLocalStorage<DisplayPreference>(
    'displayPreference',
    DisplayPreference.System
  )

  const value = { displayPreference, setDisplayPreference }

  return (
    <div className={`${displayPreference === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-neutral-800 text-black dark:text-[#e3e2e6]">
        <DisplayContext.Provider value={value}>{props.children}</DisplayContext.Provider>
      </div>
    </div>
  )
}
