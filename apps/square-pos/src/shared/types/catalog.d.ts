import type { CartItem } from '../context/CartContext'
import { buildCartInventoryInfo } from '../utils/inventoryUtils'

/**
 * Props for the ProductCard component.
 */
interface ProductCardProps {
  id: string
  name: string
  price: number | null
  imageUrl: string | undefined
  state?: string
  quantity?: string | number
  is_taxable?: boolean | undefined
  itemTaxRate?: number
  variationId?: string
  discounts?: Array<{
    discount_name: string
    discount_value: string | number | null
  }>
  taxes?: Array<{ name: string; percentage: string | number | null }>
}
/**
 * Props for the Product Section hook
 */
export type UseProductSectionDataProps = {
  accessToken: string
  products?: ProductCatalog
  inventory?: InventoryData
}

/**
 * Props for the ProductSection component.
 */
export type ProductSectionContainerProps = {
  accessToken: string
  products?: ProductCatalog
  inventory?: InventoryData
}

export type ProductSectionProps = {
  items: Item[]
  dataIsPending: boolean
  error: Error | null
  taxes_data: TransformedTax[]
  cartInventoryInfo: Record<string, InventoryObject>
  accessToken: string
  variationIds: string[]
  categoryObjects: CategoryObject[]
  params: ParamsType
  setParams: React.Dispatch<React.SetStateAction<ParamsType>>
  inventoryMap: InventoryMap
  imageMap: ImageMap
  discountApplications: DiscountApplication[]
}

export type UseProductSectionDataReturn = {
  params: ParamsType
  setParams: React.Dispatch<React.SetStateAction<ParamsType>>
  dataIsPending: boolean
  error: Error | null
  discountsError: Error | null
  pricingRulesError: Error | null
  productSetsError: Error | null
  items: Item[]
  taxes_data: TransformedTax[]
  cartInventoryInfo: Record<string, InventoryObject>
  inventoryMap: InventoryMap
  imageMap: ImageMap
  variationIds: string[]
  categoryObjects: CategoryObject[]
  discountApplications: DiscountApplication[]
  // catalogObjects: CatalogObject[]
}

interface SignInPageUIProps {
  session: Session | null
  status: string
  isProcessing: boolean
  error: string | null
  hasOAuthCode: string | null
}

/**
 * Props for the ProductCard component
 */
interface ProductCardProps {
  id: string
  name: string
  price: number | null
  imageUrl: string
  state?: string
  quantity?: string | number
  is_taxable?: boolean | undefined
  itemTaxRate?: number
  variantId?: string
  discounts?: Array<{
    discount_name: string
    discount_value: string | number | null
  }>
  taxes?: Array<{ name: string; percentage: string | number }>
}
/**
 * discount hook
 */
export interface UseDiscountsReturn {
  discounts: Discount[]
  isLoading: boolean
  error: Error | null
}

/**
 *  product set hook
 */
export interface UseProductSetsReturn {
  productSets: ProductSet[]
  isLoading: boolean
  error: Error | null
}

/**
 *  pricing rule hook
 */
export interface UsePricingRulesReturn {
  pricingRules: PricingRule[]
  isLoading: boolean
  error: Error | null
}

// * params
export interface ParamsType {
  types: string
  query?: {
    set_query?: {
      attribute_values: string[]
      attribute_name: string
    }
    text_query?: {
      keywords: string[]
    }
  }
  // limit
  // cursor
}

// * Catalog object
export interface CatalogObject {
  id: string
  type: 'ITEM' | 'IMAGE' | 'CATEGORY' | 'TAX' | 'DISCOUNT' | 'PRICING_RULE' | 'PRODUCT_SET'
}

// * ProductCatalog
export interface ProductCatalog {
  objects: CatalogObject[]
  related_objects: CatalogObject[]
  latest_time: string
}

// * Item
export interface Item extends CatalogObject {
  id: string
  type: 'ITEM'
  item_data: ItemData
}

export interface ItemData {
  name: string
  variations: ItemVariation[]
  image_ids: string[]
  is_taxable: boolean
  tax_ids: string[]
  categories: ItemCategory[]
}

export interface ItemVariation {
  id: string
  type: 'ITEM_VARIATION'
  item_variation_data: ItemVariationData
}

export interface ItemVariationData {
  price_money: Money
}

export interface Money {
  amount: number
  currency: string
}

export interface ItemCategory {
  id: string
}

// * inventory
export interface InventoryObject {
  state: string
  quantity: string
  catalog_object_id: string
}

export interface InventoryData {
  counts: InventoryObject[]
}

export interface InventoryMap {
  [variationId: string]: InventoryObject
}

// * category
export interface Category extends CatalogObject {
  id: string
  type: 'CATEGORY'
  category_data: {
    name: string
  }
}

export interface CategoryObject {
  id: string
  name: string
}

// * Tax
export interface Tax extends CatalogObject {
  id: string
  type: 'TAX'
  tax_data: TaxData
}

export interface TaxData {
  name: string
  percentage: string
  enabled: boolean
}

export interface TransformedTax {
  id: string
  name: string
  percentage: string | number
  enabled: boolean
}

// * Discount
export interface Discount extends CatalogObject {
  id: string
  type: 'DISCOUNT'
  discount_data: DiscountData
}

export interface DiscountData {
  name: string
  discount_type: string
  modify_tax_basis: string
  percentage?: string
  amount_money?: {
    amount: number
  }
}

export interface TransformedDiscount {
  id: string
  name: string
  type: string
  modify_tax_basis: string
  percentage?: number
  amount?: number
}

export interface DiscountApplication {
  discount_id: string
  discount_name: string
  discount_value: string | number | null
  applied_product_ids: string[]
}

// * Image
export interface Image extends CatalogObject {
  id: string
  type: 'IMAGE'
  image_data: {
    url: string
  }
}

export interface ImageMap {
  [imageId: string]: string
}

// * PricingRule
export interface PricingRule extends CatalogObject {
  id: string
  pricing_rule_data: {
    discount_id: string
    match_products_id: string
  }
}

export interface TransformedPricingRule {
  id: string
  discount_id: string
  match_products_id: string
}

// * ProductSet
export interface ProductSet extends CatalogObject {
  id: string
  product_set_data: {
    all_products?: boolean
    product_ids_all?: string[]
    product_ids_any?: string[]
  }
}

export interface TransformedProductSet {
  id: string
  all_products: boolean
  product_ids_all?: string[]
  product_ids_any?: string[]
}
