'use client'
import FilterDrawerContainer from '@/containers/filter'
import { hasValidQuery } from '@/containers/product/useProductList'
import { useCartStore } from '@/shared/store/useCartStore'
import type { ProductSectionProps } from '@/shared/types/catalog'
import React from 'react'
import { css } from '~/styled-system/css'
import { Box, Grid, HStack } from '~/styled-system/jsx'
import CartDrawer from '../cart/CartDrawer'
import SearchBar from '../search/SearchBar'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './skeletons/ProductGridSkeleton'

/**
 * Section component for displaying a grid of products with filtering, search, and cart drawer.
 * Handles data loading, error states, and product mapping.
 */

/* @compile */
export default function ProductSection({
  accessToken,
  cartInventoryInfo,
  variationIds,
  categoryObjects,
  params,
  setParams,
  dataIsPending,
  error,
  items,
  taxes_data,
  inventoryMap,
  imageMap,
  discountApplications,
  fetchedDiscounts,
  fetchedTaxes,
}: ProductSectionProps) {
  // * Get cart store actions for saving fetched data
  const { setFetchedTaxes, setFetchedDiscounts } = useCartStore()

  // * Save fetched taxes and discounts to cart store when they change
  React.useEffect(() => {
    if (fetchedTaxes && fetchedTaxes.length > 0) {
      setFetchedTaxes(fetchedTaxes)
    }
  }, [fetchedTaxes, setFetchedTaxes])

  React.useEffect(() => {
    if (fetchedDiscounts && fetchedDiscounts.length > 0) {
      // Transform catalog Discount format to cart store Discount format
      const transformedDiscounts = fetchedDiscounts.map((discount) => ({
        discount_id: discount.id,
        discount_name: discount.discount_data.name,
        discount_value:
          discount.discount_data.percentage || discount.discount_data.amount_money?.amount || 0,
      }))
      setFetchedDiscounts(transformedDiscounts)
    }
  }, [fetchedDiscounts, setFetchedDiscounts])

  // * Render the main product section layout
  return (
    <Box className={css({ w: 'full', mt: 'layout.section.sm' })}>
      {/* cart drawer */}
      <CartDrawer
        accessToken={accessToken}
        cartInventoryInfo={cartInventoryInfo}
        itemVariationIds={variationIds}
      />
      <HStack align="center" justify="center" gap="gap.inline.lg" mb="layout.section.sm">
        {/* filter button and search bar */}
        <FilterDrawerContainer
          categoryObjects={categoryObjects}
          setParams={(newParams) => setParams({ ...params, ...newParams })}
          prevParams={params}
        />
        <SearchBar
          setParams={(newParams) => setParams({ ...params, ...newParams })}
          prevParams={params}
        />
      </HStack>
      {/* {hasValidQuery(params.query) && dataIsPending && <DashboardLoader />} */}
      {hasValidQuery(params.query) && dataIsPending && <ProductGridSkeleton />}

      {!dataIsPending && !error && items.length === 0 && (
        <Box style={{ textAlign: 'center', margin: '2rem 0', color: 'gray' }}>No items found</Box>
      )}

      <Grid
        gap="gap.component.sm"
        w="full"
        className={css({
          gridTemplateColumns: ['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)'], // responsive: 1/2/3 columns
        })}
      >
        {items.map((item) => {
          // * Extract product and variation details
          const name = item.item_data?.name ?? 'Name unknown'
          const variation = item.item_data?.variations?.[0]?.item_variation_data
          const variationId = item.item_data?.variations?.[0]?.id
          const price = variation?.price_money?.amount ?? null
          const imageId = item.item_data?.image_ids?.[0]
          const imageUrl = imageId ? imageMap[imageId] : '/placeholder.jpg'
          const is_taxable = item.item_data?.is_taxable
          const tax_ids = item.item_data?.tax_ids
          const categoryId = item.item_data?.categories?.[0]?.id

          // * Match tax ids with taxes_data
          const matchedTaxes = (tax_ids ?? []).map((tax_id: string) => {
            const tax = taxes_data.find((t) => t.tax_id === tax_id)
            return tax ? { name: tax.name, percentage: tax.percentage, tax_id: tax.tax_id } : null
          })

          // * Build discounts array for each item
          const discounts = discountApplications
            .filter((app) => {
              if (app.applied_product_ids.includes(item.id)) return true
              if (categoryId && app.applied_product_ids.includes(categoryId)) return true
              return false
            })
            .map((app) => ({
              discount_id: app.discount_id,
              discount_name: app.discount_name,
              discount_value: app.discount_value,
            }))

          // * Inventory management
          const inventory = variationId ? inventoryMap[variationId] : undefined
          const state = inventory?.state ?? 'Unknown'
          const quantity = inventory?.quantity ?? '-'

          return (
            <Box
              bg="gray.100"
              key={item.id}
              className={css({
                borderRadius: 'md',
                p: { base: 'padding.block.sm', md: 'padding.block.md' },
                boxShadow: 'md',
              })}
            >
              <ProductCard
                id={item.id}
                name={name}
                price={price}
                imageUrl={imageUrl}
                state={state}
                quantity={quantity}
                is_taxable={is_taxable}
                variationId={variationId}
                discounts={discounts}
                taxes={matchedTaxes.filter(
                  (tax): tax is { tax_id: string; name: string; percentage: string | number } =>
                    tax !== null,
                )}
              />
            </Box>
          )
        })}
      </Grid>
    </Box>
  )
}
