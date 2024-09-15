import React from 'react'

type Props = {
  children?: React.ReactNode | React.ReactNode[]
  title?: React.ReactNode
  breadcrumbs?: React.ReactNode
  extra?: React.ReactNode
}

export const TableContainer: React.FC<Props> = ({
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
      <div className="flex flex-wrap justify-between items-center py-6 pr-6 pl-6">
        <div
          className="text-midnight-blue text-3xl font-semibold mr-2.5"
          data-testid="page-title"
        >
          {title}
        </div>
        <div className="table-extra">{extra}</div>
      </div>
      <div className="pl-6 pr-6 pb-6">{children}</div>
    </div>
  )
}
