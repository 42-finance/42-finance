import { Dialog } from '@headlessui/react'
import {
  ConfirmDialogProps,
  confirmable,
  createConfirmation,
} from 'react-confirm'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

import { Button } from '../button/button'

type Props = {
  cancelLabel?: React.ReactNode
  content: React.ReactNode
  okLabel?: React.ReactNode
}

const ConfirmModal: React.FC<ConfirmDialogProps<Props, boolean>> = ({
  cancelLabel = 'Cancel',
  content,
  okLabel = 'OK',
  show,
  proceed,
}) => {
  return (
    <Dialog open={show} onClose={() => null}>
      <div className="fixed z-40 inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed overflow-auto z-50 inset-0 p-4">
        <Dialog.Panel
          className={`modal relative mx-auto top-20 rounded-xs w-full max-w-md`}
        >
          <div className="mb-5 bg-white">
            <div className="p-6 flex items-center">
              <span className="text-2xl mr-4 text-red-500">
                <AiOutlineExclamationCircle />
              </span>
              {content}
            </div>
            <div className="border-t px-4 py-2 flex justify-end">
              <Button
                data-testid="confirm-cancel"
                onClick={() => proceed(false)}
              >
                {cancelLabel}
              </Button>
              <Button
                data-testid="confirm-ok"
                className="ml-2"
                danger
                type="primary"
                onClick={() => proceed(true)}
              >
                {okLabel}
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export const confirmModal = ({ cancelLabel, content, okLabel }: Props) =>
  createConfirmation(confirmable(ConfirmModal))({
    cancelLabel,
    content,
    okLabel,
  })
