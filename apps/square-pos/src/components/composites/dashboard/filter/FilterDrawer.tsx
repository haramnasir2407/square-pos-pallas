import { ButtonVariant } from '@/components/primitives/derived/ButtonVariant'
import { Checkbox } from '@/components/primitives/ui/checkbox'
import Drawer from '@/components/primitives/ui/drawer'
import { Label } from '@/components/primitives/ui/label'
import { FaFilter } from 'react-icons/fa'
import {
  body,
  checkbox,
  close,
  content,
  footer,
  label,
  title,
  trigger,
} from './styles/FilterDrawer.styles'

export function FilterDrawer({
  open,
  setOpen,
  categoryObjects,
  selected,
  onToggle,
  onApply,
  onClear,
}: FilterDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={setOpen} side="left">
      <Drawer.Trigger className={trigger}>
        <FaFilter style={{ fontSize: 'md' }} />
        <span>Filter</span>
      </Drawer.Trigger>
      <Drawer.Content className={content}>
        <Drawer.Close className={close}>&times;</Drawer.Close>
        <Drawer.Title className={title}>Filter by Category</Drawer.Title>
        <Drawer.Body className={body}>
          {categoryObjects.map((category) => (
            <Label key={category.id} className={label}>
              <Checkbox
                size="sm"
                checked={selected.some((sel) => sel.id === category.id)}
                onCheckedChange={() => onToggle(category)}
                className={checkbox}
              />
              {category.name}
            </Label>
          ))}
        </Drawer.Body>
        <Drawer.Footer className={footer}>
          <ButtonVariant
            variant="primary"
            bg="gray.700"
            hover={{ bg: 'gray.600' }}
            onClick={onApply}
            disabled={selected.length === 0}
          >
            Apply Filter
          </ButtonVariant>
          <ButtonVariant
            variant="outlined"
            bg="gray.200"
            hover={{ bg: 'gray.300' }}
            onClick={onClear}
            // disabled={selected.length === 0}
          >
            Clear Filter
          </ButtonVariant>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  )
}
