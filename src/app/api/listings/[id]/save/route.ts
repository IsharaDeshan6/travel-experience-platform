import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// POST /api/listings/[id]/save - Save/Like a listing
export async function POST(
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

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existingSave = await prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: id,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json(
        { message: "Listing already saved", saved: true },
        { status: 200 }
      );
    }

    // Create save
    await prisma.savedListing.create({
      data: {
        userId: session.user.id,
        listingId: id,
      },
    });

    return NextResponse.json(
      { message: "Listing saved successfully", saved: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving listing:", error);
    return NextResponse.json(
      { error: "Failed to save listing" },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id]/save - Unsave/Unlike a listing
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

    // Delete save if it exists
    const deleted = await prisma.savedListing.deleteMany({
      where: {
        userId: session.user.id,
        listingId: id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "Listing was not saved", saved: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Listing unsaved successfully", saved: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsaving listing:", error);
    return NextResponse.json(
      { error: "Failed to unsave listing" },
      { status: 500 }
    );
  }
}
