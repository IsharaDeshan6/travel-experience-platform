import { Decimal } from "@prisma/client/runtime/library";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number; // API returns as number after serialization
  images: string[];
  category: string;
  duration?: string | null;
  maxGuests?: number | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Internal type for Prisma queries (before serialization)
export type ListingPrisma = Omit<Listing, 'price'> & {
  price: Decimal;
};

export type ListingWithAuthor = Listing & {
  author: Pick<User, "id" | "name" | "email">;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: Record<string, string>;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
