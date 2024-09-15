import { Category } from 'frontend-types'
import { AiOutlineDelete } from 'react-icons/ai'
import { FaRegEyeSlash } from 'react-icons/fa6'

import { IconButton } from '../common/icon-button/icon-button'
import { Tooltip } from '../common/tooltip/tooltip'

type Props = {
  category: Category
  onSelected: (category: Category) => void
  onDelete: (category: Category) => void
  onEnable: (category: Category) => void
}

export const CategoryItem: React.FC<Props> = ({ category, onSelected, onDelete, onEnable }) => {
  return (
    <div
      onClick={() => {
        onSelected(category)
      }}
      className="grow items-stretch cursor-pointer hover:opacity-75 border-b last:border-0"
    >
      <div className="flex w-full items-center p-4 ">
        <div
          className="mr-2"
          style={{
            opacity: category.mapToCategoryId ? 0.5 : 1
          }}
        >
          {category.icon}
        </div>
        <div
          className="grow"
          style={{
            opacity: category.mapToCategoryId ? 0.5 : 1
          }}
        >
          {category.name}
        </div>
        {category.mapToCategoryId ? (
          <Tooltip body="Enable">
            <IconButton
              icon={<FaRegEyeSlash />}
              onClick={(e) => {
                e.stopPropagation()
                onEnable(category)
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip body="Delete" color="bg-red-600">
            <IconButton
              danger
              icon={<AiOutlineDelete />}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(category)
              }}
            />
          </Tooltip>
        )}
      </div>
    </div>
  )
}
