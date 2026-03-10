"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getListings(category?: string | null) {
  try {
    const where = category ? { category } : {};

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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: listings };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { success: false, error: "Failed to fetch listings" };
  }
}

export async function getListingById(id: string) {
  try {
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
      return { success: false, error: "Listing not found" };
    }

    return { success: true, data: listing };
  } catch (error) {
    console.error("Error fetching listing:", error);
    return { success: false, error: "Failed to fetch listing" };
  }
}

export async function getUserListings() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const listings = await prisma.listing.findMany({
      where: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: listings };
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return { success: false, error: "Failed to fetch listings" };
  }
}

export async function createListing(data: {
  title: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  duration?: string;
  maxGuests?: number;
}) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate required fields
    if (!data.title || !data.description || !data.location || !data.price || !data.imageUrl || !data.category) {
      return { success: false, error: "Missing required fields" };
    }

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category,
        duration: data.duration,
        maxGuests: data.maxGuests,
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

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, data: listing };
  } catch (error) {
    console.error("Error creating listing:", error);
    return { success: false, error: "Failed to create listing" };
  }
}

export async function updateListing(
  id: string,
  data: {
    title?: string;
    description?: string;
    location?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    duration?: string;
    maxGuests?: number;
  }
) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if listing exists and user is the owner
    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return { success: false, error: "Listing not found" };
    }

    if (existingListing.userId !== session.user.id) {
      return { success: false, error: "Forbidden: You can only update your own listings" };
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data,
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

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/listings/${id}`);

    return { success: true, data: updatedListing };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { success: false, error: "Failed to update listing" };
  }
}

export async function deleteListing(id: string) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if listing exists and user is the owner
    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return { success: false, error: "Listing not found" };
    }

    if (existingListing.userId !== session.user.id) {
      return { success: false, error: "Forbidden: You can only delete your own listings" };
    }

    await prisma.listing.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Listing deleted successfully" };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return { success: false, error: "Failed to delete listing" };
  }
}
