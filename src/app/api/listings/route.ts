import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { createListingSchema } from "@/lib/validations";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// GET /api/listings - Fetch all listings with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ListingWhereInput = {};
    
    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.listing.count({ where });

    // Fetch listings
    const listings = await prisma.listing.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Serialize listings - convert Decimal to number
    const serializedListings = listings.map(listing => ({
      ...listing,
      price: listing.price.toNumber(),
    }));

    return NextResponse.json({
      listings: serializedListings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create new listing (requires auth)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate with Zod
    const validationResult = createListingSchema.safeParse({
      ...body,
      price: typeof body.price === 'string' ? parseFloat(body.price) : body.price,
      maxGuests: body.maxGuests ? (typeof body.maxGuests === 'string' ? parseInt(body.maxGuests) : body.maxGuests) : null,
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

    const listing = await prisma.listing.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        price: validatedData.price,
        images: validatedData.images,
        category: validatedData.category,
        duration: validatedData.duration || null,
        maxGuests: validatedData.maxGuests || null,
        userId: session.user.id,
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

    // Serialize listing - convert Decimal to number
    const serializedListing = {
      ...listing,
      price: listing.price.toNumber(),
    };

    return NextResponse.json(serializedListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
