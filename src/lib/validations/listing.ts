import { z } from "zod";

export const listingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters"),
  
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(999999, "Price must not exceed 999,999"),
  
  images: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
  
  category: z
    .string()
    .min(1, "Category is required"),
  
  duration: z
    .string()
    .max(50, "Duration must not exceed 50 characters")
    .optional()
    .nullable(),
  
  maxGuests: z
    .number()
    .int("Must be a whole number")
    .positive("Must be at least 1 guest")
    .max(1000, "Maximum guests cannot exceed 1000")
    .optional()
    .nullable(),
});

export const createListingSchema = listingSchema;

export const updateListingSchema = listingSchema.partial();

export type ListingInput = z.infer<typeof listingSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
