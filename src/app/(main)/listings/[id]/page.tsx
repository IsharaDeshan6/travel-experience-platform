"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/container";
import { ListingDetail } from "@/components/listings/listing-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ListingWithAuthor } from "@/types";
import { deleteListing } from "@/actions/listings";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<ListingWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setListing(data);
        } else {
          setListing(null);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [resolvedParams.id]);

  const isOwner = listing && session?.user?.id === listing.userId;

  const handleEdit = () => {
    router.push(`/listings/${listing?.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    if (!listing) return;

    const result = await deleteListing(listing.id);
    
    if (result.success) {
      router.push("/dashboard");
    } else {
      alert(result.error || "Failed to delete listing");
    }
  };

  if (loading) {
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
