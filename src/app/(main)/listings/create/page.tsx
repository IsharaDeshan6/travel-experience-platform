"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ListingForm } from "@/components/listings/listing-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateListingPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    // TODO: Implement actual API call in Phase 9
    console.log("Creating listing:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(
      "Listing creation will be connected to the backend in Phase 9. For now, this is just a UI demonstration."
    );

    // Redirect to home page
    router.push("/");
  };

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

          {/* Info Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This form is fully functional but not yet
              connected to the database. Backend integration will be completed
              in Phase 7-9.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
