import Link from "next/link";
import Image from "next/image";
import { ListingWithAuthor } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface ListingCardProps {
  listing: ListingWithAuthor;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-200 hover:-translate-y-2 hover:border-blue-200">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg">
              {listing.category}
            </Badge>
          </div>
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {listing.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0 group-hover:text-blue-600 transition-colors duration-200" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                ${listing.price}
              </span>
              <span className="text-sm text-gray-600 ml-1">per person</span>
            </div>
            {listing.duration && (
              <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200">
                {listing.duration}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
