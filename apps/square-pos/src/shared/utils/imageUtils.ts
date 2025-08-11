import type { Image } from "@/shared/types/catalog";

/**
 * Builds a map from image ID to image URL for quick lookup
 */
export function buildImageMap(images: Image[]): Record<string, string> {
  const imageMap: Record<string, string> = {};

  images.forEach((img) => {
    imageMap[img.id] = img.image_data?.url;
  });

  return imageMap;
}
