import type {
  InventoryData,
  InventoryMap,
  InventoryObject,
  Item,
} from "@/shared/types/catalog";

/**
 * Builds a map from variation ID to inventory info for quick lookup
 */
export function buildInventoryMap(inventoryData: InventoryData) {
  const map: InventoryMap = {};

  if (inventoryData?.counts) {
    for (const count of inventoryData.counts) {
      map[count.catalog_object_id] = {
        state: count.state,
        quantity: count.quantity,
        catalog_object_id: count.catalog_object_id,
      };
    }
  }

  return map;
}

/**
 * Builds a map from item ID to inventory info for cart functionality
 */
export function buildCartInventoryInfo(
  items: Item[],
  inventoryMap: InventoryMap
): InventoryMap {
  const map: InventoryMap = {};

  items.forEach((item) => {
    const variationId = item.item_data?.variations?.[0]?.id;
    if (variationId && inventoryMap[variationId]) {
      map[item.id] = inventoryMap[variationId];
    }
  });

  return map;
}
