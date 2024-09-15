import React from 'react'

type Props = {
  children?: React.ReactNode | React.ReactNode[]
  title?: React.ReactNode
  breadcrumbs?: React.ReactNode
  extra?: React.ReactNode
}

export const DetailsContainer: React.FC<Props> = ({
  children,
  title,
  breadcrumbs,
  extra,
}) => {
  return (
    <div>
      {breadcrumbs && (
        <div className="bg-white py-5 pr-6 pl-6 shadow-[inset_0_-1px_5px_rgba(0,0,0,0.05)]">
          {breadcrumbs}
        </div>
      )}
      <div className="flex flex-wrap justify-between items-center py-6 px-6 min-h-[24px]">
        {title && (
          <div
            data-testid="page-title"
            className="text-midnight-blue text-3xl font-semibold my-1.5 mr-2.5 leading-7"
          >
            {title}
          </div>
        )}
        {extra && <div className="my-1.5">{extra}</div>}
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
  )
}
