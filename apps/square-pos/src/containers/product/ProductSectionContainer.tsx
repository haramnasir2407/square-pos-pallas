'use client'

// CSR

import ProductSection from '@/components/composites/dashboard/products/ProductSection'
import { useProductSectionData } from '@/containers/product/useProductSectionData'
import type { ProductSectionContainerProps, ProductSectionProps } from '@/shared/types/catalog'
import React from 'react'

export default function ProductSectionContainer({
  accessToken,
  products,
  inventory,
}: ProductSectionContainerProps) {
  const {
    params,
    setParams,
    dataIsPending,
    error,
    items,
    taxes_data,
    cartInventoryInfo,
    inventoryMap,
    imageMap,
    variationIds,
    discountApplications,
    categoryObjects,
  } = useProductSectionData({ accessToken, products, inventory })

  return (
    <ProductSection
      accessToken={accessToken}
      items={items}
      dataIsPending={dataIsPending}
      error={error}
      taxes_data={taxes_data}
      cartInventoryInfo={cartInventoryInfo}
      inventoryMap={inventoryMap}
      imageMap={imageMap}
      variationIds={variationIds}
      discountApplications={discountApplications}
      categoryObjects={categoryObjects}
      params={params}
      setParams={setParams}
    />
  )
}
