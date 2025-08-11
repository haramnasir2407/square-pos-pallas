import { useDiscounts } from '@/containers/product/useDiscounts'
import { usePricingRules } from '@/containers/product/usePricingRules'
import { hasValidQuery, useProductList } from '@/containers/product/useProductList'
import { useProductSets } from '@/containers/product/useProductSets'
import { useMemo, useState } from 'react'
import {
  extractCategories,
  extractDiscounts,
  extractImages,
  extractItemIds,
  extractItems,
  extractPricingRules,
  extractProductSets,
  extractTaxes,
  extractVariationIds,
} from '../../shared/utils/dataExtractionUtils'
import {
  createDiscountToProductSetMap,
  transformCategories,
  transformDiscounts,
  transformPricingRules,
  transformProductSets,
  transformTaxes,
} from '../../shared/utils/productDataTransformers'

import type {
  ParamsType,
  ProductCatalog,
  UseProductSectionDataProps,
  UseProductSectionDataReturn,
} from '@/shared/types/catalog'
import { createDiscountApplications } from '@/shared/utils/discountApplicationUtils'
import { buildImageMap } from '../../shared/utils/imageUtils'
import { buildCartInventoryInfo, buildInventoryMap } from '../../shared/utils/inventoryUtils'

/**
 * Custom hook to manage and aggregate all product section data for the dashboard.
 * Handles fetching, transforming, and mapping of products, inventory, discounts, pricing rules, and categories.
 * Uses server-side data if provided, otherwise fetches client-side.
 */
export function useProductSectionData({
  accessToken,
  products,
  inventory,
}: UseProductSectionDataProps): UseProductSectionDataReturn {
  // * set params for fetching products
  const [params, setParams] = useState<ParamsType>({
    types: 'item, image, category, tax, discount, pricing_rule, product_set',
  })

  // * custom hook for fetching products - only run when there's a query
  const { data, isPending: dataIsPending, error } = useProductList(accessToken, params)

  // * custom hook for fetching discounts
  const { error: discountsError, discounts: fetchedDiscounts } = useDiscounts(accessToken)

  // * custom hook for fetching pricing rules
  const { error: pricingRulesError, pricingRules: fetchedPricingRules } =
    usePricingRules(accessToken)

  // * custom hook for fetching product sets
  const { error: productSetsError, productSets: fetchedProductSets } = useProductSets(accessToken)

  // * use server-side products if provided, otherwise use client-fetched data
  const productData = useMemo(() => {
    // * if search/filter then use client rendered data
    if (hasValidQuery(params?.query)) {
      return data
    }
    return products
  }, [data, products, params.query])

  // * Memoize data extraction to prevent recalculation on every render
  const items = useMemo(() => extractItems(productData), [productData])
  const taxes = useMemo(() => extractTaxes(productData), [productData])
  const variationIds = useMemo(() => extractVariationIds(items), [items])
  const categories = useMemo(() => extractCategories(products as ProductCatalog), [products])
  const allItemIds = useMemo(() => extractItemIds(items), [items])
  const images = useMemo(() => extractImages(productData), [productData])
  const imageMap = useMemo(() => buildImageMap(images), [images])

  // * use fetched discounts if available, otherwise fall back to product data
  const discounts = fetchedDiscounts.length > 0 ? fetchedDiscounts : extractDiscounts(productData)

  // * retrieve the pricing rule and products sets array
  const pricing_rules =
    fetchedPricingRules.length > 0 ? fetchedPricingRules : extractPricingRules(productData)

  const product_sets =
    fetchedProductSets.length > 0 ? fetchedProductSets : extractProductSets(productData)

  // * Memoize data transformations to prevent recalculation
  const taxes_data = useMemo(() => transformTaxes(taxes), [taxes])
  const discounts_data = useMemo(() => transformDiscounts(discounts), [discounts])
  const pricing_rules_data = useMemo(() => transformPricingRules(pricing_rules), [pricing_rules])
  const product_sets_data = useMemo(() => transformProductSets(product_sets), [product_sets])
  const categoryObjects = useMemo(() => transformCategories(categories), [categories])

  // * Memoize discount mappings and applications
  const discountToProductSetMap = useMemo(
    () => createDiscountToProductSetMap(pricing_rules_data),
    [pricing_rules_data],
  )

  const discountApplications = useMemo(
    () =>
      createDiscountApplications(
        discountToProductSetMap,
        discounts_data,
        product_sets_data,
        allItemIds,
      ),
    [discountToProductSetMap, discounts_data, product_sets_data, allItemIds],
  )

  // * use server-side inventory if provided, otherwise use client-fetched data
  const inventoryData = inventory

  // * build a map from variation id to inventory info, for quick lookup
  const inventoryMap = buildInventoryMap(inventoryData ?? { counts: [] })

  // * builds a map from item id to { state, quantity }, used in cart drawer
  const cartInventoryInfo = buildCartInventoryInfo(items, inventoryMap)

  return {
    params,
    setParams,
    dataIsPending,
    error,
    discountsError,
    pricingRulesError,
    productSetsError,
    items,
    taxes_data,
    cartInventoryInfo,
    inventoryMap,
    imageMap,
    variationIds,
    discountApplications,
    categoryObjects,
  }
}
