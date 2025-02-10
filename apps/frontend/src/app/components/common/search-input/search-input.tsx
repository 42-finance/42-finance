import { useRef } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

type Props = {
  'data-testid'?: string
  defaultValue?: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}

export const SearchInput: React.FC<Props> = ({ 'data-testid': dataTestId, defaultValue, onChange, placeholder }) => {
  const ref = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    if (ref.current) {
      ref.current.value = ''
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        className="h-[40px] pl-7 pr-7 py-[5px] text-sm w-full sm:w-60 bg-white text-gray-900 placeholder:text-gray-300 border border-gray-300 rounded-[4px] focus:outline-hidden focus:border-midnight-blue focus:ring-midnight-blue/30"
        data-testid={dataTestId}
        onChange={onChange}
        placeholder={placeholder}
        defaultValue={defaultValue || ''}
        type="text"
      />
      <div className="absolute left-2 top-3">
        <AiOutlineSearch />
      </div>
      {ref.current?.value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="absolute right-0 top-0 py-1.5 px-2 text-gray-300 hover:text-gray-400 cursor-default"
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
            className="fill-current stroke-none mt-[3px]"
          >
            <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" />
          </svg>
        </button>
      )}
    </div>
  )
}
