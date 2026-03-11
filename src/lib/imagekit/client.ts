// Note: This file contains ImageKit utility functions for client-side usage.
// Currently using API routes for uploads, but these utilities can be used for transformations.

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

// Client-side ImageKit instance (browser) - using API routes instead
export const imagekit = null;

// Server-side ImageKit instance (Node.js) - see server.ts
export const imagekitServer = null;

/**
 * Get optimized image URL from ImageKit
 * @param path - Image path in ImageKit (e.g., "pets/dog1.jpg")
 * @param transformations - ImageKit transformation options
 * @returns Optimized image URL
 */
export function getImageKitUrl(
  path: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: 'at_max' | 'at_least' | 'maintain_ratio' | 'force';
    focus?: 'center' | 'auto' | 'face';
  }
): string {
  if (!urlEndpoint) {
    // Fallback to placeholder if ImageKit not configured
    return `https://via.placeholder.com/${transformations?.width || 800}x${transformations?.height || 600}`;
  }

  const transformation: string[] = [];

  if (transformations) {
    if (transformations.width) transformation.push(`w-${transformations.width}`);
    if (transformations.height) transformation.push(`h-${transformations.height}`);
    if (transformations.quality) transformation.push(`q-${transformations.quality}`);
    if (transformations.format) transformation.push(`f-${transformations.format}`);
    if (transformations.crop) transformation.push(`c-${transformations.crop}`);
    if (transformations.focus) transformation.push(`fo-${transformations.focus}`);
  }

  const transformStr = transformation.length > 0 ? `tr:${transformation.join(',')}` : '';
  return `${urlEndpoint}/${transformStr}/${path}`;
}

/**
 * List all files in a specific folder from ImageKit
 * Note: This function is a placeholder. Use API routes for actual file listing.
 * @param _folderPath - Folder path in ImageKit (e.g., "pets/gallery")
 * @returns Array of image URLs
 */
export async function listImageKitFiles(_folderPath: string = ''): Promise<string[]> {
  if (!imagekitServer) {
    console.warn('ImageKit not configured. Using placeholder images.');
    return [];
  }

  return [];
}

/**
 * Check if ImageKit is properly configured
 */
export function isImageKitConfigured(): boolean {
  return !!(publicKey && urlEndpoint);
}
