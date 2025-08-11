/**
 * API Constants - Centralized configuration for all API endpoints
 */

export const API_CONFIG = {
  // Base URLs
  SQUARE_BASE_URL: "https://connect.squareupsandbox.com",
  // SQUARE_BASE_URL: "https://connect.squareup.com",
  SQUARE_VERSION: "2025-06-18",

  // API Endpoints
  ENDPOINTS: {
    // Catalog
    CATALOG_SEARCH: "/v2/catalog/search",
    CATALOG_BATCH_UPSERT: "/v2/catalog/batch-upsert",
    CATALOG_IMAGES: "/v2/catalog/images",

    // Orders
    ORDERS: "/v2/orders",
    ORDERS_CALCULATE: "/v2/orders/calculate",

    // Inventory
    INVENTORY_COUNTS: "/v2/inventory/counts/batch-retrieve",

    // Auth
    OAUTH_TOKEN: "/oauth2/token",
  },

  // Object Types for Catalog Search
  OBJECT_TYPES: {
    ITEM: "ITEM",
    CATEGORY: "CATEGORY",
    DISCOUNT: "DISCOUNT",
    PRICING_RULE: "PRICING_RULE",
    PRODUCT_SET: "PRODUCT_SET",
    IMAGE: "IMAGE",
    TAX: "TAX",
  },

  // HTTP Methods
  METHODS: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
  },

  // Headers
  HEADERS: {
    CONTENT_TYPE: "application/json",
    ACCEPT: "application/json",
    SQUARE_VERSION: "2025-06-18",
  },
} as const;

export const LOCAL_API_ENDPOINTS = {
  // Local API routes
  DISCOUNTS: "/api/discounts",
  PRICING_RULES: "/api/pricing-rules",
  PRODUCT_SETS: "/api/product-sets",
  ORDERS: {
    CREATE: "/api/orders/create-order",
    CALCULATE: "/api/orders/calculate-order",
  },
  INVENTORY_COUNTS: "/api/inventory_counts",
  PRODUCTS: {
    SEARCH: "/api/products/searchCatalog",
    BATCH_UPSERT: "/api/products/batchUpsert",
  },
  IMAGES: {
    UPLOAD: "/api/images/uploadImages",
  },
} as const;
