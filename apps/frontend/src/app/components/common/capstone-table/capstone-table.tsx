import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'
import { MdCloudOff } from 'react-icons/md'

import { useScrollLeft } from '../../../hooks/use-scroll-left'
import { Checkbox } from '../checkbox/checkbox'
import { Loader } from '../loader/loader'
import { Pagination } from '../pagination/pagination'

type Column<DataSource> = {
  title: string
  dataIndex: string
  key: string
  align?: 'left' | 'center' | 'right'
  sorter?: boolean
  sortOrder?: 'ASC' | 'DESC' | null
  width?: string
  render?: (value: any, record: DataSource, index?: number) => React.ReactNode
}

export type Columns<DataSource> = Column<DataSource>[]

export type CapstoneTableOptions = {
  limit: number
  order?: 'ASC' | 'DESC'
  page: number
  sort: string
}

export interface TableRowSelection {
  selectedRowKeys: number[]
  onChange?: (selectedRowKeys: number[]) => void
}

interface Props<T> {
  columns: Columns<T>
  data?: T[]
  limit?: number
  loading: boolean
  onChange?: (options: CapstoneTableOptions) => void
  onRowClick?: (key: T) => void
  order?: 'ASC' | 'DESC'
  page?: number
  pagination?: boolean
  rowClassName?: (record: T) => string
  rowSelection?: TableRowSelection
  sort?: string
  totalRows?: number
  stickyHeader?: boolean
}

export const CapstoneTable = <T extends { [key: string]: any }>({
  columns,
  data,
  loading,
  limit = 1000,
  onChange,
  onRowClick,
  order,
  page = 1,
  rowClassName,
  rowSelection,
  sort = '',
  totalRows,
  pagination = true,
  stickyHeader = false
}: Props<T>) => {
  const { scrollLeft, maxScroll, scrollRef } = useScrollLeft<HTMLDivElement>()
  const allRowKeys = data?.map((d) => d.key) || []
  const allRowsSelected = allRowKeys.every((r) => rowSelection?.selectedRowKeys.includes(r))

  const headerRef = useRef<HTMLTableSectionElement>(null)
  const [headerTop, setHeaderTop] = useState<number | null>(null)

  useEffect(() => {
    if (headerRef.current && headerTop == null) {
      const rect = headerRef.current.getBoundingClientRect()
      setHeaderTop(rect.top)
    }
  }, [headerRef.current, headerTop])

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && headerTop != null) {
        const scroll = window.scrollY
        if (scroll > headerTop) {
          const translation = Math.floor(Math.abs(scroll - headerTop))
          headerRef.current.style.setProperty('transform', `translateY(${translation}px)`)
        } else {
          headerRef.current.style.removeProperty('transform')
        }
      }
    }

    if (stickyHeader) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headerTop])

  const handleHeaderClick = <U extends { [key: string]: any }>(column: Column<U>) => {
    if (!column.sorter) {
      return
    }

    column.sortOrder = column.sortOrder === 'ASC' ? 'DESC' : 'ASC'

    onChange?.({
      limit,
      order: column.sortOrder,
      page: 1,
      sort: column.key
    })
  }

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, record: T) => {
    if ((event.target as any).tagName === 'TD' && record.key) {
      onRowClick?.(record)
    }
  }

  const handlePaginationChange = (p: number) => {
    onChange?.({
      limit,
      order,
      page: p,
      sort
    })
  }

  const handleLimitChange = (l: number) => {
    onChange?.({
      limit: l,
      order,
      page: 1,
      sort
    })
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    if (!rowSelection || !data) {
      return
    }

    let selectedRowKeys = [...rowSelection.selectedRowKeys]

    if (event.target.checked) {
      selectedRowKeys.push(...data.map((d) => d.key).filter((d) => !selectedRowKeys.includes(d)))
    } else {
      selectedRowKeys = selectedRowKeys.filter((r) => !data.map((d) => d.key).includes(r))
    }

    rowSelection?.onChange?.(selectedRowKeys)
  }

  const handleSelectRow = (event: React.ChangeEvent<HTMLInputElement>, record: T) => {
    event.stopPropagation()

    if (!rowSelection) {
      return
    }

    let selectedRowKeys = [...rowSelection.selectedRowKeys]

    if (event.target.checked) {
      selectedRowKeys.push(parseInt(record.key))
    } else {
      selectedRowKeys = selectedRowKeys.filter((key) => key !== parseInt(record.key))
    }

    rowSelection?.onChange?.(selectedRowKeys)
  }

  const renderTableCell = (column: Column<T>, record: T) => {
    if (column.render) {
      return column.render(record[column.dataIndex], record)
    }
    return record[column.dataIndex]
  }

  return (
    <div className="relative">
      <div
        className={`relative ${
          scrollLeft < maxScroll
            ? "after:content-[''] after:absolute after:pointer-events-none after:w-[30px] after:z-10 after:top-0 after:bottom-0 after:right-0 after:shadow-[inset_-10px_0_8px_-8px_rgba(0,0,0,0.15)]"
            : ''
        } ${
          scrollLeft > 0
            ? "before:content-[''] before:absolute before:pointer-events-none before:w-[30px] before:z-10 before:top-0 before:bottom-0 before:left-0 before:shadow-[inset_10px_0_8px_-8px_rgba(0,0,0,0.15)]"
            : ''
        }`}
      >
        <div
          className={`border border-cool-grey ${
            pagination ? 'rounded-t-[4px]' : 'rounded-[4px]'
          } overflow-x-auto text-midnight-blue`}
          ref={scrollRef}
        >
          <table className="border-collapse w-full text-sm text-left">
            <thead className="border-b border-cool-grey whitespace-nowrap bg-white" ref={headerRef}>
              <tr className="h-[57px]">
                {rowSelection && (
                  <th key="select" scope="col">
                    <Checkbox className="p-3" checked={allRowsSelected} onChange={handleSelectAll} />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.dataIndex}
                    scope="col"
                    className={`px-4 py-2 font-semibold ${
                      column.sorter && 'cursor-pointer'
                    } ${column.sortOrder && 'bg-gray-50'}`}
                    onClick={() => handleHeaderClick(column)}
                    style={{ width: column.width }}
                  >
                    <span className="flex items-center -mr-2 pr-2">
                      <span className={`flex-1 ${column.align && `text-${column.align}`}`}>{column.title}</span>
                      {column.sorter && (
                        <span className="text-[11px] ml-2.5 text-gray-300">
                          <AiOutlineCaretUp
                            className={`h-[11px] -mb-[3px] ${column.sortOrder === 'ASC' && 'text-midnight-blue'}`}
                          />
                          <AiOutlineCaretDown
                            className={`h-[11px] -mt-[3px] ${column.sortOrder === 'DESC' && 'text-midnight-blue'}`}
                          />
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {data?.map((record: T, index) => (
                <tr
                  key={`tr-${index}`}
                  onClick={(e) => handleRowClick(e, record)}
                  className={`h-[53px] border-b last:border-0 ${
                    onRowClick
                      ? record.key !== null
                        ? 'cursor-pointer hover:bg-midnight-blue/10'
                        : ''
                      : 'cursor-default'
                  } ${rowClassName?.(record as T) ?? ''}`}
                >
                  {rowSelection && (
                    <td>
                      <Checkbox
                        className="p-3"
                        checked={rowSelection.selectedRowKeys?.some((val) => val === record.key)}
                        onChange={(e) => handleSelectRow(e, record)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={`td-${column.dataIndex}`}
                      className={`px-4 py-2.5 whitespace-nowrap ${
                        column.sortOrder && 'bg-gray-50/30'
                      } ${column.align && `text-${column.align}`}`}
                    >
                      {renderTableCell(column, record)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {!loading && (!data || data.length === 0) && (
        <>
          <div className="absolute inset-0 z-10 flex items-center justify-center pt-9">
            <div className="flex flex-col items-center text-gray-300">
              <div className="text-4xl mb-1">
                <MdCloudOff />
              </div>
              No Data
            </div>
          </div>
          <div className="min-h-[200px]" />
        </>
      )}
      {loading && (
        <>
          <div
            className={`absolute inset-0 bg-white/70 z-10 flex items-center ${
              !data || data.length === 0 ? 'pt-9' : 'pb-10'
            }`}
          >
            <Loader />
          </div>
          {(!data || data.length === 0) && <div className="min-h-[200px]" />}
        </>
      )}
      {pagination && (
        <Pagination
          page={page}
          limit={limit}
          totalRows={totalRows}
          onChange={handlePaginationChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  )
}
