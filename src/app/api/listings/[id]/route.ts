import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

    const {
      title,
      description,
      location,
      price,
      imageUrl,
      category,
      duration,
      maxGuests,
    } = body;

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(location && { location }),
        ...(price && { price: parseFloat(price) }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category }),
        ...(duration && { duration }),
        ...(maxGuests && { maxGuests: parseInt(maxGuests) }),
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
