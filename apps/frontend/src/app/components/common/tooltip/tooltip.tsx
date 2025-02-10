import './tooltip.css'

import Tippy from '@tippyjs/react/headless'
import { Placement } from 'tippy.js'

type Props = {
  body: React.ReactNode | React.ReactNode[]
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  color?: string
  placement?: Placement
}

export const Tooltip: React.FC<Props> = ({
  body,
  children,
  className = '',
  color = 'bg-midnight-blue',
  placement = 'top',
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <Tippy
        interactive={true}
        placement={placement}
        render={(attrs) => (
          <div
            className={`tooltip p-2 leading-tight font-normal text-white ${color} rounded-xs shadow-[0px_1px_7px_2px_rgba(0,0,0,0.2)] max-w-sm`}
            {...attrs}
          >
            {body}
            <div className="arrow" data-popper-arrow="" />
          </div>
        )}
      >
        <div>{children}</div>
      </Tippy>
    </div>
  )
}
