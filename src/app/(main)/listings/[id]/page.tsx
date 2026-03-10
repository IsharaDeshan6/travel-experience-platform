"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ListingDetail } from "@/components/listings/listing-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockListings } from "@/lib/mock-data";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Find the listing from mock data
  const listing = mockListings.find((l) => l.id === resolvedParams.id);

  // TODO: Replace with actual ownership check from session in Phase 8
  const isOwner = false;

  const handleEdit = () => {
    alert("Edit functionality will be implemented in Phase 9");
    // router.push(`/listings/${listing?.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    // TODO: Implement actual delete logic in Phase 9
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Delete functionality will be implemented in Phase 9");
    router.push("/dashboard");
  };

  if (!listing) {
    return (
      <div className="py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Listing Not Found</h1>
            <p className="text-gray-600 mb-8">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Link>
        </Button>

        {/* Listing Detail */}
        <ListingDetail
          listing={listing}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isOwner={isOwner}
        />
      </Container>
    </div>
  );
}
