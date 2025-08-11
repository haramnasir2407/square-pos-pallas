import { useState } from 'react'
import type { CategoryObject, ParamsType } from '@/shared/types/catalog'
import {
  buildCategoryFilterParams,
  clearSelectedCategories,
  toggleCategory,
} from '@/shared/utils/filterUtils'

export const useFilterDrawer = ({
  prevParams,
  setParams,
}: {
  setParams: (params: ParamsType) => void
  prevParams: ParamsType
}) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<CategoryObject[]>([])

  const onApply = () => {
    setParams(buildCategoryFilterParams(selected, prevParams))
    setOpen(false)
  }

  const onClear = () => {
    setSelected(clearSelectedCategories())
    setParams(buildCategoryFilterParams([], prevParams))
    setOpen(false)
  }

  const handleToggle = (category: CategoryObject) => {
    setSelected((prev) => toggleCategory(category, prev))
  }

  return {
    open,
    setOpen,
    selected,
    onApply,
    onClear,
    handleToggle,
  }
}
