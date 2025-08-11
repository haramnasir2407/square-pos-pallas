import type { CategoryObject, ParamsType } from "@/shared/types/catalog";

/**
 * Toggles a category in the selected list
 * @param category - The category to toggle
 * @param selected - Current selected categories
 * @returns Updated selected categories array
 */
export const toggleCategory = (
  category: CategoryObject,
  selected: CategoryObject[]
): CategoryObject[] => {
  return selected.some((c) => c.id === category.id)
    ? selected.filter((c) => c.id !== category.id)
    : [...selected, category];
};

/**
 * Checks if a category is selected
 * @param category - The category to check
 * @param selected - Current selected categories
 * @returns True if category is selected, false otherwise
 */
export const isCategorySelected = (
  category: CategoryObject,
  selected: CategoryObject[]
): boolean => {
  return selected.some((c) => c.id === category.id);
};

/**
 * Clears all selected categories
 * @returns Empty array
 */
export const clearSelectedCategories = (): CategoryObject[] => {
  return [];
};

/**
 * Gets category IDs from category objects
 * @param categories - Array of category objects
 * @returns Array of category IDs
 */
export const getCategoryIds = (categories: CategoryObject[]): string[] => {
  return categories.map((category) => category.id);
};

/**
 * Gets category names from category objects
 * @param categories - Array of category objects
 * @returns Array of category names
 */
export const getCategoryNames = (categories: CategoryObject[]): string[] => {
  return categories.map((category) => category.name);
};

/**
 * Builds the filter params object for category filtering.
 * @param {CategoryObj[]} selected - Selected categories.
 * @param {Record<string, any>} prevParams - Previous params object.
 * @returns {Record<string, any>} The new params object for setParams.
 */
export function buildCategoryFilterParams(
  selected: CategoryObject[],
  prevParams: ParamsType
): ParamsType {
  if (selected && selected.length > 0) {
    return {
      ...prevParams,
      query: {
        ...(typeof prevParams.query === "object" && prevParams.query !== null
          ? prevParams.query
          : {}),
        set_query: {
          attribute_values: selected.map((category) => category.id),
          attribute_name: "categories",
        },
      },
    };
  }
  return {
    types: "item, image, category, tax, discount, pricing_rule, product_set",
    query: {
      ...(typeof prevParams.query === "object" && prevParams.query !== null
        ? prevParams.query
        : {}),
      set_query: undefined,
    },
  };
}
