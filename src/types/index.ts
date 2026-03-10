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
  price: number;
  imageUrl: string;
  category: string;
  duration?: string | null;
  maxGuests?: number | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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
