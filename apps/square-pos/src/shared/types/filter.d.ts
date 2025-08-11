/**
 * Props for the FilterButton component.
 */
interface FilterButtonProps {
  setParams: (params: ParamsType) => void
  prevParams: ParamsType
  categoryObjects: CategoryObject[]
}

/**
 * Props for the FilterDrawer component.
 * @property {boolean} open - Whether the drawer is open.
 * @property {() => void} onClose - Function to close the drawer.
 * @property {(selectedCategories: CategoryObj[]) => void} onApply - Function to apply selected categories.
 * @property {CategoryObj[]} categoryObjects - List of available category objects.
 */

interface FilterDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
  categoryObjects: CategoryObject[]
  selected: CategoryObject[]
  onToggle: (category: CategoryObject) => void
  onApply: () => void
  onClear: () => void
}
