import type {
  Category,
  CategoryObject,
  Discount,
  PricingRule,
  ProductSet,
  Tax,
  TransformedDiscount,
  TransformedPricingRule,
  TransformedProductSet,
  TransformedTax,
} from '@/shared/types/catalog'

// Types for data transformation

/**
 * Transforms raw tax objects into structured tax data
 */
export function transformTaxes(taxes: Tax[]): TransformedTax[] {
  return taxes.map((tax) => ({
    id: tax.id,
    name: tax.tax_data.name,
    percentage: Number.parseFloat(tax.tax_data.percentage),
    enabled: tax.tax_data.enabled,
  }))
}
/**
 * Transforms raw discount objects into structured discount data
 */
export function transformDiscounts(discounts: Discount[]): TransformedDiscount[] {
  return discounts.map((discount) => {
    const { id, discount_data } = discount
    const base = {
      id,
      name: discount_data.name,
      type: discount_data.discount_type,
      modify_tax_basis: discount_data.modify_tax_basis,
    }

    if (discount_data.percentage !== undefined) {
      return {
        ...base,
        percentage: Number.parseFloat(discount_data.percentage),
      }
    }
    if (discount_data.amount_money?.amount !== undefined) {
      return {
        ...base,
        amount: discount_data.amount_money.amount,
      }
    }
    return base
  })
}

/**
 * Transforms raw pricing rule objects into structured pricing rule data
 */
export function transformPricingRules(pricingRules: PricingRule[]): TransformedPricingRule[] {
  return pricingRules.map((pricing_rule) => ({
    id: pricing_rule.id,
    discount_id: pricing_rule.pricing_rule_data.discount_id,
    match_products_id: pricing_rule.pricing_rule_data.match_products_id,
  }))
}

/**
 * Transforms raw product set objects into structured product set data
 */
export function transformProductSets(productSets: ProductSet[]): TransformedProductSet[] {
  return productSets.map((product_set) => ({
    id: product_set.id,
    all_products: product_set.product_set_data.all_products || false,
    product_ids_all: product_set.product_set_data.product_ids_all || undefined,
    product_ids_any: product_set.product_set_data.product_ids_any || undefined,
  }))
}

/**
 * Transforms raw category objects into structured category data
 */
export function transformCategories(categories: Category[]): CategoryObject[] {
  return categories.map((category) => ({
    id: category.id,
    name: category.category_data?.name,
  }))
}

/**
 * Creates a map from discount IDs to product set IDs
 */
export function createDiscountToProductSetMap(pricingRules: TransformedPricingRule[]) {
  return pricingRules.map((rule) => ({
    discount_id: rule.discount_id,
    product_set_id: rule.match_products_id,
  }))
}
