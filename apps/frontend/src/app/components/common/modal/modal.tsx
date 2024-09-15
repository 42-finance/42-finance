import { Dialog } from '@headlessui/react'
import { IconButton } from '@mui/material'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

type Props = {
  children: React.ReactNode
  'data-testid'?: string
  bodyBgColor?: string
  bodyPadding?: string
  closable?: boolean
  footer?: React.ReactNode[]
  maxWidth: string
  onClose: () => void
  title: string
  visible?: boolean
  topPosition?: string
  headerExtra?: React.ReactNode
}

export const Modal: React.FC<Props> = ({
  'data-testid': dataTestId,
  bodyBgColor = 'bg-gray-50',
  bodyPadding = 'p-6',
  children,
  closable,
  footer,
  maxWidth = 'max-w-[50rem]',
  onClose,
  title,
  visible = true,
  topPosition = 'top-6',
  headerExtra
}) => {
  const handleClose = () => {
    if (closable !== false) {
      onClose()
    }
  }

  return (
    <Dialog data-testid={dataTestId} open onClose={() => handleClose} className={visible ? '' : 'hidden'}>
      <div className="fixed z-40 inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed overflow-auto z-50 inset-0 p-4">
        <Dialog.Panel className={`modal relative mx-auto ${topPosition} rounded-sm w-full ${maxWidth}`}>
          <div className="mb-5 bg-white">
            <div className="bg-lighter-green font-semibold text-white text-base py-3 pl-5 pr-3 flex justify-between items-center">
              {title}
              <div className="flex">
                {headerExtra}
                <IconButton aria-label="Close" onClick={handleClose}>
                  <span className="text-white text-xl">
                    <AiOutlineClose />
                  </span>
                </IconButton>
              </div>
            </div>
            <div className={`${bodyPadding} ${bodyBgColor}`}>{children}</div>
            {footer && (
              <div className="border-t px-4 py-2 flex justify-end">
                {footer.map((footerItem, index) => (
                  <div key={index} className="ml-2">
                    {footerItem}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
