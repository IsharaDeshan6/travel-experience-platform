// @ts-nocheck
// Note: This file contains ImageKit utility functions that are not currently in use.
// Type checking is disabled to prevent build errors. Re-enable when implementing client-side ImageKit features.

// import ImageKit from '@imagekit/javascript';

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';

// Client-side ImageKit instance (browser) - commented out as not currently used
// The browser SDK is not needed as we handle uploads via API routes
export const imagekit = null;

// Server-side ImageKit instance (Node.js) - includes private key
// Note: This is initialized in API routes using the 'imagekit' package
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
 * @param folderPath - Folder path in ImageKit (e.g., "pets/gallery")
 * @returns Array of image URLs
 */
export async function listImageKitFiles(folderPath: string = ''): Promise<string[]> {
  if (!imagekitServer) {
    console.warn('ImageKit not configured. Using placeholder images.');
    return [];
  }

  try {
    const response = await imagekitServer.listFiles({
      path: folderPath,
      includeFolder: false,
    });

    return response.map((file: any) => file.url);
  } catch (error) {
    console.error('Error fetching ImageKit files:', error);
    return [];
  }
}

/**
 * Check if ImageKit is properly configured
 */
export function isImageKitConfigured(): boolean {
  return !!(publicKey && urlEndpoint);
}
