import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// GET /api/listings/saved - Get user's saved listings
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const savedListings = await prisma.savedListing.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        listing: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                savedByUsers: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const listings = savedListings.map((saved) => saved.listing);

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching saved listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved listings" },
      { status: 500 }
    );
  }
}
