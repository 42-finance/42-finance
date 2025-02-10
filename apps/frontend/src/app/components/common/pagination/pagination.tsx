import { BiChevronsLeft, BiChevronsRight } from 'react-icons/bi'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import Select, { SingleValue, createFilter } from 'react-select'

type NumericSelectOption = {
  value: number
  label: string
}

const SKIP_BACK = 'SKIP_BACK'
const SKIP_FORWARDS = 'SKIP_FORWARDS'

const range = (from: number, to: number, step: number = 1) => {
  let i = from
  const r = []
  while (i <= to) {
    r.push(i)
    i += step
  }
  return r
}

type Props = {
  limit: number
  onChange: (page: number) => void
  onLimitChange: (limit: number) => void
  page: number
  pageNeighbours?: number
  totalRows?: number
}

export const Pagination: React.FC<Props> = ({
  limit,
  onChange,
  onLimitChange,
  page,
  pageNeighbours = 1,
  totalRows,
}) => {
  if (!totalRows) {
    return null
  }
  const btnClass =
    'flex items-center justify-center min-w-[40px] h-[40px] px-0.5 bg-white border border-gray-300 rounded-xs hover:text-lighter-green hover:border-lighter-green transition-all'
  const btnClassActive =
    'flex items-center justify-center min-w-[40px] h-[40px] px-0.5 text-lighter-green font-semibold bg-white border border-lighter-green rounded-xs'
  const btnClassDisabled =
    'flex items-center justify-center min-w-[40px] h-[40px] px-0.5 bg-white border border-gray-300 rounded-xs text-gray-200 cursor-not-allowed'
  const skipBtnClass =
    'flex items-center justify-center text-xl text-gray-300 w-[40px] h-[40px] bg-white hover:text-lighter-green transition-all'
  const pages = totalRows != null ? Math.ceil(totalRows / limit) : 0
  const pageSet = (page - 1) * limit
  const firstItem = pageSet + 1
  const lastItem = pageSet + limit < totalRows ? pageSet + limit : totalRows

  const limitOptions: NumericSelectOption[] = [
    10, 15, 20, 25, 30, 50, 75, 100,
  ].map((o: number) => ({
    value: o,
    label: `${o} / page`,
  }))

  const handlePageChange = (value: number) => {
    const currentPage = Math.max(1, Math.min(value, pages))
    onChange(currentPage)
  }

  const handleLimitChange = (option: SingleValue<NumericSelectOption>) => {
    if (option) {
      onLimitChange(option.value)
    }
  }

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (pages > totalBlocks) {
      const leftBound = page - pageNeighbours
      const rightBound = page + pageNeighbours
      const beforeLastPage = pages - 1
      const startPage = leftBound > 2 ? leftBound : 2
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage
      let result: (string | number)[] = range(startPage, endPage)
      const pagesCount = result.length
      const singleSpillOffset = totalNumbers - pagesCount - 1
      const leftSpill = startPage > 2
      const rightSpill = endPage < beforeLastPage

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1)
        result = [SKIP_BACK, ...extraPages, ...result]
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset)
        result = [...result, ...extraPages, SKIP_FORWARDS]
      } else if (leftSpill && rightSpill) {
        result = [SKIP_BACK, ...result, SKIP_FORWARDS]
      }

      return [1, ...result, pages]
    }

    return range(1, pages)
  }

  const renderPages = () => {
    const pagesToShow = fetchPageNumbers()
    return pagesToShow.map((p, index) => {
      if (p === SKIP_BACK)
        return (
          <li key={index}>
            <button
              type="button"
              className={skipBtnClass}
              aria-label="Skip Backwards"
              onClick={() => handlePageChange(page - pageNeighbours * 2 - 1)}
            >
              <span aria-hidden="true">
                <BiChevronsLeft />
              </span>
              <span className="sr-only">Skip Backwards</span>
            </button>
          </li>
        )

      if (p === SKIP_FORWARDS)
        return (
          <li key={index}>
            <button
              type="button"
              className={skipBtnClass}
              aria-label="Skip Forwards"
              onClick={() => handlePageChange(page + pageNeighbours * 2 + 1)}
            >
              <span aria-hidden="true">
                <BiChevronsRight />
              </span>
              <span className="sr-only">Skip Forwards</span>
            </button>
          </li>
        )

      return (
        <li key={index}>
          <button
            type="button"
            aria-label={`Page ${p}`}
            className={page === p ? btnClassActive : btnClass}
            onClick={() => handlePageChange(p as number)}
          >
            {p}
          </button>
        </li>
      )
    })
  }

  return (
    <div className="flex flex-wrap justify-center items-center border border-t-0 border-cool-grey rounded-b-[4px] py-2.5 px-4">
      <div className="hidden mr-4 min-w-[115px] lg:block">
        <label className="sr-only" htmlFor="limit">
          Row Limit
        </label>
        <Select<NumericSelectOption>
          classNamePrefix={'react-select'}
          filterOption={createFilter({
            ignoreAccents: false,
            matchFrom: 'any',
            stringify: (option) => `${option.label}`,
          })}
          inputId="limit"
          onChange={handleLimitChange}
          options={limitOptions}
          value={limitOptions.filter((option) => option.value === limit)}
        />
      </div>
      <div className="hidden mr-4 whitespace-nowrap lg:block">{`${firstItem}-${lastItem} of ${totalRows}`}</div>
      <nav aria-label="Page navigation">
        <ul className="flex flex-wrap items-center space-x-2 m-0">
          <li>
            <button
              type="button"
              aria-label="Go to previous page"
              disabled={page === 1}
              className={`${
                page === 1 ? btnClassDisabled : btnClass
              } hidden md:flex`}
              onClick={() => handlePageChange(page - 1)}
            >
              <span className="sr-only">Previous</span>
              <BsChevronLeft />
            </button>
          </li>
          {renderPages()}
          <li>
            <button
              type="button"
              aria-label="Go to next page"
              disabled={page === pages}
              className={`${
                page === pages ? btnClassDisabled : btnClass
              } hidden md:flex`}
              onClick={() => handlePageChange(page + 1)}
            >
              <span className="sr-only">Next</span>
              <BsChevronRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
