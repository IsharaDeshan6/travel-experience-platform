import ImageKit from "@imagekit/nodejs";

// Server-side ImageKit instance with private key
// @ts-expect-error - ImageKit types may not be fully compatible
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
} as any);

/**
 * Get file ID from ImageKit URL
 * @param imageUrl - Full ImageKit URL
 * @returns File ID or null
 */
export function getFileIdFromUrl(imageUrl: string): string | null {
  try {
    // ImageKit URL format: https://ik.imagekit.io/{urlEndpoint}/path/filename.jpg
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
    if (!imageUrl.includes(urlEndpoint)) {
      return null; // Not an ImageKit URL
    }

    // Extract file path from URL
    const filePath = imageUrl.split(urlEndpoint)[1];
    return filePath || null;
  } catch (error) {
    console.error("Error extracting file ID from URL:", error);
    return null;
  }
}

/**
 * Delete file from ImageKit
 * @param fileIdOrUrl - File ID or full URL
 * @returns Success status
 */
export async function deleteImageKitFile(fileIdOrUrl: string): Promise<boolean> {
  try {
    let fileId = fileIdOrUrl;

    // If it's a URL, extract the file path
    if (fileIdOrUrl.startsWith("http")) {
      const filePath = getFileIdFromUrl(fileIdOrUrl);
      if (!filePath) {
        console.error("Could not extract file path from URL");
        return false;
      }

      // List files to get fileId by path
      // @ts-expect-error - ImageKit listFiles method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listResponse: any = await (imagekit as any).listFiles({
        path: filePath.split("/").slice(0, -1).join("/") || "/",
        searchQuery: `name = "${filePath.split("/").pop()}"`,
      });

      if (listResponse.length === 0) {
        console.error("File not found in ImageKit");
        return false;
      }

      fileId = listResponse[0].fileId;
    }

    // @ts-expect-error - ImageKit deleteFile method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (imagekit as any).deleteFile(fileId);
    return true;
  } catch (error) {
    console.error("Error deleting ImageKit file:", error);
    return false;
  }
}

/**
 * Check if ImageKit is properly configured
 */
export function isImageKitConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  );
}
