// src/utils/imageFallback.ts

/**
 * Returns a valid image URL or a fallback if the provided one is missing/invalid.
 *
 * @param image - The original image URL (can be undefined or empty).
 * @param fallback - The fallback image URL to use if image is not valid.
 * @returns A safe image URL string.
 */
export function getImageOrFallback(
  image?: string,
  fallback: string = "/placeholder-project.jpg"
): string {
  if (!image || image.trim() === "") {
    return fallback;
  }
  return image;
}
