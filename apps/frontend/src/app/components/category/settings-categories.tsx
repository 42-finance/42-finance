import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, editCategory, getGroups } from 'frontend-api'
import { Category, Group } from 'frontend-types'
import { useMemo, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { CategoryType } from 'shared-types'
import { StringParam, useQueryParams } from 'use-query-params'

import { Button } from '../common/button/button'
import { Card } from '../common/card/card'
import { confirmModal } from '../common/confirm-modal/confirm-modal'
import { IconButton } from '../common/icon-button/icon-button'
import { ActivityIndicator } from '../common/loader/activity-indicator'
import { Tooltip } from '../common/tooltip/tooltip'
import { AddCategoryModal } from '../modals/add-category-modal'
import { AddGroupModal } from '../modals/add-group-modal'
import { DeleteCategoryModal } from '../modals/delete-category-modal'
import { DeleteGroupModal } from '../modals/delete-group-modal'
import { EditCategoryModal } from '../modals/edit-category-modal'
import { EditGroupModal } from '../modals/edit-group-modal'
import { CategoryItem } from './category-item'

export const SettingsCategories = () => {
  const queryClient = useQueryClient()

  const [query] = useQueryParams({
    search: StringParam
  })

  const { search } = query

  const [editCategoryId, setEditCategoryId] = useState<number | null>(null)
  const [editGroupId, setEditGroupId] = useState<number | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null)
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false)
  const [showAddGroup, setShowAddGroup] = useState<boolean>(false)

  const { data: groups = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.GroupsList, search],
    queryFn: async () => {
      const res = await getGroups({ search, showHidden: true })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { mutate: editMutation } = useMutation({
    mutationFn: async (categoryId: number) => {
      const res = await editCategory(categoryId, { mapToCategoryId: null })
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.GroupsList] })
      }
    }
  })

  const onEnable = async (category: Category) => {
    if (await confirmModal({ content: 'Are you sure you want to enable this category?' })) {
      editMutation(category.id)
    }
  }

  const incomeGroups = useMemo(() => groups.filter((g) => g.type === CategoryType.Income), [groups])

  const expenseGroups = useMemo(() => groups.filter((g) => g.type === CategoryType.Expense), [groups])

  const transferGroups = useMemo(() => groups.filter((g) => g.type === CategoryType.Transfer), [groups])

  const renderCategories = (title: string, groups: Group[]) => {
    return (
      <Card
        title={title}
        className="mt-4"
        extra={
          <div className="flex gap-2">
            <Button type="primary" onClick={() => setShowAddGroup(true)}>
              Add Group
            </Button>
            <Button type="primary" onClick={() => setShowAddCategory(true)}>
              Add Category
            </Button>
          </div>
        }
      >
        {groups.map((group) => (
          <div key={group.id} className="border-t first:border-t-0">
            <div className="flex items-center p-4 border-b">
              <div className="font-bold grow">{group.name}</div>
              <Tooltip body="Delete" color="bg-red-600">
                <IconButton
                  danger
                  icon={<AiOutlineDelete />}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteGroup(group)
                  }}
                />
              </Tooltip>
            </div>
            {group.categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onSelected={(category) => setEditCategoryId(category.id)}
                onDelete={(category) => setDeleteCategory(category)}
                onEnable={onEnable}
              />
            ))}
          </div>
        ))}
      </Card>
    )
  }

  if (fetching && groups.length === 0) {
    return (
      <div className="mt-8">
        <ActivityIndicator />
      </div>
    )
  }

  return (
    <>
      {renderCategories('Income', incomeGroups)}
      {renderCategories('Expense', expenseGroups)}
      {renderCategories('Transfer', transferGroups)}
      {editCategoryId && (
        <EditCategoryModal
          categoryId={editCategoryId}
          onClose={() => {
            setEditCategoryId(null)
          }}
        />
      )}
      {editGroupId && (
        <EditGroupModal
          groupId={editGroupId}
          onClose={() => {
            setEditGroupId(null)
          }}
        />
      )}
      {deleteCategory && (
        <DeleteCategoryModal
          onClose={() => setDeleteCategory(null)}
          categoryId={deleteCategory.id}
          categoryIcon={deleteCategory.icon}
          categoryName={deleteCategory.name}
        />
      )}
      {deleteGroup && (
        <DeleteGroupModal
          onClose={() => setDeleteGroup(null)}
          groupId={deleteGroup.id}
          groupName={deleteGroup.name}
          categoryCount={deleteGroup.categories.length}
        />
      )}
      {showAddCategory && <AddCategoryModal onClose={() => setShowAddCategory(false)} />}
      {showAddGroup && <AddGroupModal onClose={() => setShowAddGroup(false)} />}
    </>
  )
}
