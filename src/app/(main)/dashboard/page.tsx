"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockListings } from "@/lib/mock-data";

export default function DashboardPage() {
  // TODO: Replace with actual user's listings from database in Phase 9
  // For now, show all listings from first user as a demo
  const userListings = mockListings.slice(0, 3);

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              My Listings
            </h1>
            <p className="text-gray-600">
              Manage your travel experience listings
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link href="/listings/create">
              <Plus className="h-5 w-5" />
              Create New Listing
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <p className="text-sm text-blue-600 font-medium mb-1">
              Total Listings
            </p>
            <p className="text-3xl font-bold text-blue-900">
              {userListings.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <p className="text-sm text-green-600 font-medium mb-1">
              Active
            </p>
            <p className="text-3xl font-bold text-green-900">
              {userListings.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
            <p className="text-sm text-purple-600 font-medium mb-1">
              Total Views
            </p>
            <p className="text-3xl font-bold text-purple-900">
              1,234
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>Demo Mode:</strong> This dashboard is showing mock data.
            Once you implement authentication (Phase 8) and connect to the
            backend (Phase 9), it will show your actual listings.
          </p>
        </div>

        {/* Listings Grid */}
        {userListings.length > 0 ? (
          <ListingGrid listings={userListings} />
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first travel experience listing to get started
            </p>
            <Button asChild>
              <Link href="/listings/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Listing
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
