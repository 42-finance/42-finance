import React, { PropsWithChildren, ReactNode } from 'react'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'

import { Card } from '../card/card'
import { Tooltip } from '../tooltip/tooltip'

type Props = {
  title: string
  titleTextSize?: string
  className?: string
  headerClassName?: string
  extra?: ReactNode
  dataTestId?: string
}

export const CollapsibleCard: React.FC<PropsWithChildren<Props>> = ({
  title,
  titleTextSize,
  className,
  headerClassName,
  extra,
  dataTestId,
  children,
}) => {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <Card
      data-testid={dataTestId}
      title={
        <div
          className="flex items-center cursor-pointer"
          data-testid={`expand-${dataTestId}`}
          onClick={() => (expanded ? setExpanded(false) : setExpanded(true))}
        >
          <span className="mr-2">{title}</span>
          {expanded && <AiOutlineUp className="text-lg" />}
          {!expanded && (
            <Tooltip className="text-sm font-normal" body="Click to expand">
              <span>
                <AiOutlineDown className="text-lg" />
              </span>
            </Tooltip>
          )}
        </div>
      }
      titleTextSize={titleTextSize}
      className={`${className} mb-6`}
      headerClassName={headerClassName}
      bodyStyle={{ padding: expanded ? 24 : 0 }}
      extra={extra}
    >
      {expanded && <>{children}</>}
    </Card>
  )
}
