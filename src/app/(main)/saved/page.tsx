"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { ListingWithAuthor } from "@/types";

export default function SavedListingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [savedListings, setSavedListings] = useState<ListingWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      async function fetchSavedListings() {
        try {
          const response = await fetch("/api/listings/saved");
          if (response.ok) {
            const data = await response.json();
            setSavedListings(data);
          }
        } catch (error) {
          console.error("Error fetching saved listings:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchSavedListings();
    }
  }, [status, router]);

  const handleUnsave = (listingId: string) => {
    setSavedListings(prev => prev.filter(listing => listing.id !== listingId));
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

  return (
    <div className="py-12">
      <Container>
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Saved Experiences
            </h1>
            <p className="text-gray-600">
              Your favorite travel experiences
            </p>
          </div>
        </div>

        {/* Listings Grid */}
        {savedListings.length > 0 ? (
          <ListingGrid 
            listings={savedListings} 
            savedListingIds={savedListings.map(l => l.id)}
            onSaveToggle={(listingId, isSaved) => {
              if (!isSaved) {
                handleUnsave(listingId);
              }
            }}
          />
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved experiences yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring and save your favorite travel experiences
            </p>
            <Button asChild>
              <Link href="/">
                Explore Experiences
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
