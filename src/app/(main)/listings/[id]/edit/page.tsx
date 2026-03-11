"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/container";
import { ListingForm } from "@/components/listings/listing-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateListing } from "@/actions/listings";
import { ListingWithAuthor } from "@/types";
import { toast } from "sonner";

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [listing, setListing] = useState<ListingWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      async function fetchListing() {
        try {
          const response = await fetch(`/api/listings/${resolvedParams.id}`);
          if (response.ok) {
            const data = await response.json();
            
            // Check if user is the owner
            if (data.userId !== session?.user?.id) {
              toast.error("You can only edit your own listings");
              router.push(`/listings/${resolvedParams.id}`);
              return;
            }
            
            setListing(data);
          } else {
            toast.error("Listing not found");
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching listing:", error);
          toast.error("Failed to load listing");
          router.push("/dashboard");
        } finally {
          setLoading(false);
        }
      }

      fetchListing();
    }
  }, [status, router, resolvedParams.id, session?.user?.id]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    location: string;
    price: string;
    images: string[];
    category: string;
    duration?: string;
    maxGuests?: string;
  }) => {
    if (!listing) return;

    const result = await updateListing(listing.id, {
      title: data.title,
      description: data.description,
      location: data.location,
      price: parseFloat(data.price),
      images: data.images,
      category: data.category,
      duration: data.duration,
      maxGuests: data.maxGuests ? parseInt(data.maxGuests) : undefined,
    });

    if (result.success) {
      toast.success("Listing updated successfully!");
      router.push(`/listings/${listing.id}`);
    } else {
      toast.error(result.error || "Failed to update listing");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="py-20">
        <Container>
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (status === "unauthenticated" || !listing) {
    return null;
  }

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/listings/${listing.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listing
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Edit Travel Experience
            </h1>
            <p className="text-gray-600">
              Update the details of your travel experience listing.
            </p>
          </div>

          {/* Form */}
          <ListingForm
            onSubmit={handleSubmit}
            submitLabel="Update Listing"
            initialData={{
              title: listing.title,
              description: listing.description,
              location: listing.location,
              price: Number(listing.price),
              images: listing.images,
              category: listing.category,
              duration: listing.duration || "",
              maxGuests: listing.maxGuests || undefined,
            }}
          />
        </div>
      </Container>
    </div>
  );
}
