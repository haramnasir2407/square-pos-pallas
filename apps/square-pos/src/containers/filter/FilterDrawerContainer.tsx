import { FilterDrawer } from '@/components/composites/dashboard/filter/FilterDrawer'
import { useFilterDrawer } from './useFilterDrawer'

// CSR
export default function FilterDrawerContainer({
  setParams,
  prevParams,
  categoryObjects,
}: FilterButtonProps) {
  const { open, setOpen, selected, onApply, onClear, handleToggle } = useFilterDrawer({
    setParams,
    prevParams,
  })

  return (
    <FilterDrawer
      open={open}
      setOpen={setOpen}
      categoryObjects={categoryObjects}
      selected={selected}
      onToggle={handleToggle}
      onApply={onApply}
      onClear={onClear}
    />
  )
}
