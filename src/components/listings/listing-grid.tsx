import { ListingCard } from "./listing-card";
import { ListingGridSkeleton } from "./listing-skeleton";
import { EmptyState } from "./empty-state";
import { ListingWithAuthor } from "@/types";

interface ListingGridProps {
  listings: ListingWithAuthor[];
  isLoading?: boolean;
  savedListingIds?: string[];
  onSaveToggle?: (listingId: string, isSaved: boolean) => void;
}

export function ListingGrid({ listings, isLoading, savedListingIds = [], onSaveToggle }: ListingGridProps) {
  if (isLoading) {
    return <ListingGridSkeleton count={6} />;
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No listings found"
        description="There are no travel experiences available at the moment. Check back later or create your own!"
        actionLabel="Create Listing"
        actionHref="/listings/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard 
          key={listing.id} 
          listing={listing} 
          savedListingIds={savedListingIds}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  );
}
