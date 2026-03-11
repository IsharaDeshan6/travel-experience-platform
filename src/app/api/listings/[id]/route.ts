import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateListingSchema } from "@/lib/validations";
import ImageKit from "imagekit";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

async function deleteImageFromImageKit(imageUrl: string): Promise<void> {
  if (!privateKey || !publicKey || !urlEndpoint) {
    console.error("ImageKit not configured, skipping image deletion");
    return;
  }

  const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  try {
    // List files to find the fileId
    const files = await imagekit.listFiles({
      searchQuery: `name="${imageUrl.split('/').pop()}"`,
    });

    if (files && files.length > 0) {
      const file = files[0];
      if ('fileId' in file) {
        await imagekit.deleteFile(file.fileId);
      }
    }
  } catch (error) {
    console.error("Error deleting image from ImageKit:", error);
    throw error;
  }
}

// GET /api/listings/[id] - Fetch single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

// PUT /api/listings/[id] - Update listing (owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if listing exists and user is the owner
    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (existingListing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own listings" },
        { status: 403 }
      );
    }

    // Validate with Zod (partial update)
    const validationResult = updateListingSchema.safeParse({
      ...body,
      price: body.price ? (typeof body.price === 'string' ? parseFloat(body.price) : body.price) : undefined,
      maxGuests: body.maxGuests ? (typeof body.maxGuests === 'string' ? parseInt(body.maxGuests) : body.maxGuests) : undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // If images are being updated, delete removed images from ImageKit
    if (validatedData.images) {
      const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
      const oldImages = existingListing.images;
      const newImages = validatedData.images;
      
      // Find images that were removed
      const removedImages = oldImages.filter(img => !newImages.includes(img));
      
      // Delete removed images from ImageKit
      for (const imageUrl of removedImages) {
        if (imageUrl.includes(urlEndpoint)) {
          try {
            await deleteImageFromImageKit(imageUrl);
          } catch (error) {
            console.error("Error deleting image from ImageKit:", error);
            // Continue with update even if image deletion fails
          }
        }
      }
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.description && { description: validatedData.description }),
        ...(validatedData.location && { location: validatedData.location }),
        ...(validatedData.price && { price: validatedData.price }),
        ...(validatedData.images && { images: validatedData.images }),
        ...(validatedData.category && { category: validatedData.category }),
        ...(validatedData.duration !== undefined && { duration: validatedData.duration }),
        ...(validatedData.maxGuests !== undefined && { maxGuests: validatedData.maxGuests }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id] - Delete listing (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if listing exists and user is the owner
    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (existingListing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own listings" },
        { status: 403 }
      );
    }

    // Delete all images from ImageKit if they exist
    if (existingListing.images && existingListing.images.length > 0) {
      for (const imageUrl of existingListing.images) {
        if (imageUrl.includes(urlEndpoint)) {
          try {
            await deleteImageFromImageKit(imageUrl);
          } catch (error) {
            console.error("Error deleting image from ImageKit:", error);
            // Continue with listing deletion even if image deletion fails
          }
        }
      }
    }

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Listing deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
