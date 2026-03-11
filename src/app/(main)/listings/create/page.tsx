"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/container";
import { ListingForm } from "@/components/listings/listing-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createListing } from "@/actions/listings";
import { toast } from "sonner";

export default function CreateListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSubmit = async (data: { title: string; description: string; location: string; price: number; images: string[]; category: string; duration?: string; maxGuests?: number }) => {
    console.log("handleSubmit called with data:", data);
    
    const result = await createListing({
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      images: data.images,
      category: data.category,
      duration: data.duration,
      maxGuests: data.maxGuests,
    });

    console.log("createListing result:", result);

    if (result.success) {
      toast.success("Listing created successfully!");
      router.push("/dashboard");
    } else {
      toast.error(result.error || "Failed to create listing");
    }
  };

  if (status === "loading") {
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

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Explore
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Create a Travel Experience
            </h1>
            <p className="text-gray-600">
              Share your unique travel experience with the world. Fill in the
              details below to create your listing.
            </p>
          </div>

          {/* Form */}
          <ListingForm onSubmit={handleSubmit} submitLabel="Create Listing" />
        </div>
      </Container>
    </div>
  );
}
