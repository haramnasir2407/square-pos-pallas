'use client'

import Form from '@/components/primitives/ui/form'
import { Input } from '@/components/primitives/ui/input'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { ParamsType } from '@/shared/types/catalog'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { css } from '~/styled-system/css'

// Props for the SearchBar component.
interface SearchBarProps {
  setParams: (params: ParamsType) => void
  prevParams: ParamsType
}

/**
 * Search bar component for filtering products by keyword with debounce.
 * Updates params when the user types at least 3 characters.
 */
export default function SearchBar({ setParams, prevParams }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState('')
  // Debounced search input value
  const debouncedSearch = useDebounce(searchInput, 500)

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependency prevParams, setParams
  useEffect(() => {
    if (debouncedSearch.length >= 3) {
      setParams({
        ...prevParams,
        query: {
          ...(typeof prevParams.query === 'object' && prevParams.query ? prevParams.query : {}),
          text_query: {
            keywords: [debouncedSearch],
          },
        },
      })
    } else {
      // If less than 3 chars, show initial product listing, remove search query
      setParams({
        types: 'item, image, category, tax, discount, pricing_rule, product_set',
        query: {
          ...(typeof prevParams.query === 'object' && prevParams.query ? prevParams.query : {}),
          text_query: undefined,
        },
      })
      setSearchInput('')
    }
  }, [debouncedSearch])

  const form = useForm()

  return (
    // * pallas ui form and input components
    <Form.Provider form={form} onSubmit={(e) => e.preventDefault()}>
      <Form.Item>
        <Form.Control>
          <Input shape="default" size="lg">
            <Input.Text
              className={css({
                fontSize: 'sm',
              })}
              placeholder="Search products..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </Input>
        </Form.Control>
      </Form.Item>
    </Form.Provider>
  )
}
