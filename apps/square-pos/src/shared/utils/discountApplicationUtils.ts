import type {
  DiscountApplication,
  TransformedDiscount,
  TransformedProductSet,
} from '@/shared/types/catalog'

/**
 * Calculates discount value from discount data
 */
export function calculateDiscountValue(discount: TransformedDiscount): string | number | null {
  if (discount.percentage !== undefined) {
    return `${discount.percentage}%`
  }
  if (discount.amount !== undefined) {
    return discount.amount
  }
  return null
}

/**
 * Determines which product IDs a discount applies to based on product set rules
 */
export function determineAppliedProductIds(
  productSet: TransformedProductSet,
  allItemIds: string[],
  productSetsData: TransformedProductSet[],
): string[] {
  let applied_product_ids: string[] = []

  if (productSet.all_products) {
    // Applies to all items
    applied_product_ids = allItemIds
  } else if (productSet.product_ids_any && productSet.product_ids_any.length > 0) {
    // Applies to these product/category IDs
    applied_product_ids = productSet.product_ids_any
  } else if (productSet.product_ids_all && productSet.product_ids_all.length > 0) {
    // Look up the first product set in product_sets_data
    const nestedSet = productSetsData.find((ps) => ps.id === productSet.product_ids_all?.[0])
    if (nestedSet?.product_ids_any && nestedSet.product_ids_any.length > 0) {
      const firstId = nestedSet.product_ids_any[0]
      if (firstId !== undefined) {
        applied_product_ids = [firstId]
      }
    }
  }

  return applied_product_ids
}

/**
 * Creates discount applications by mapping discounts to products through pricing rules and product sets
 */
export function createDiscountApplications(
  discountToProductSetMap: Array<{
    discount_id: string
    product_set_id: string
  }>,
  discountsData: TransformedDiscount[],
  productSetsData: TransformedProductSet[],
  allItemIds: string[],
): DiscountApplication[] {
  return discountToProductSetMap.map(({ discount_id, product_set_id }) => {
    // Get discount name
    const discount = discountsData.find((d) => d.id === discount_id)
    const discount_name = discount ? discount.name : ''

    // Calculate discount value
    const discount_value = discount ? calculateDiscountValue(discount) : null

    // Find the product set
    const productSet = productSetsData.find((ps) => ps.id === product_set_id)

    let applied_product_ids: string[] = []

    if (productSet) {
      applied_product_ids = determineAppliedProductIds(productSet, allItemIds, productSetsData)
    }

    return {
      discount_id,
      discount_name,
      discount_value,
      applied_product_ids,
    }
  })
}
