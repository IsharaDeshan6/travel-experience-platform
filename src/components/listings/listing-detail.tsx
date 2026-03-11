"use client";

import { useState } from "react";
import Image from "next/image";
import { ListingWithAuthor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ListingDetailProps {
  listing: ListingWithAuthor;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

export function ListingDetail({
  listing,
  onEdit,
  onDelete,
  isOwner = false,
}: ListingDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = listing.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Image Carousel */}
      <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-100 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <Image
          src={images[currentImageIndex] || "/placeholder.jpg"}
          alt={`${listing.title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
            
            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Category */}
          <div className="animate-slide-in-left">
            <Badge className="mb-3 shadow-md hover:shadow-lg transition-shadow">{listing.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {listing.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <span className="text-lg">{listing.location}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium">
                  {listing.duration || "Flexible"}
                </p>
              </div>
            </div>
            {listing.maxGuests && (
              <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Max Guests</p>
                  <p className="font-medium">{listing.maxGuests}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Listed</p>
                <p className="font-medium">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              About This Experience
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {listing.description}
            </p>
          </div>

          {/* Host Info */}
          <Card className="animate-fade-in border-2 border-gray-100 hover:border-blue-200 transition-colors duration-200" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hosted by</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <User className="h-5 w-5 mr-3" />
                  <span>{listing.author.name}</span>
                </div>
                <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{listing.author.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 shadow-xl border-2 border-gray-100 animate-slide-in-right">
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LKR {listing.price}</span>
                  <span className="text-gray-600 ml-2">per person</span>
                </div>
              </div>

              {!isOwner && (
                <Button className="w-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105" size="lg">
                  Reserve Experience
                </Button>
              )}

              {isOwner && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full hover:scale-105 transition-transform duration-200"
                    onClick={onEdit}
                  >
                    Edit Listing
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full hover:scale-105 transition-transform duration-200"
                    onClick={onDelete}
                  >
                    Delete Listing
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span className="text-green-500">✓</span> Instant confirmation
                </p>
                <p className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span className="text-green-500">✓</span> Free cancellation up to 24 hours
                </p>
                <p className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span className="text-green-500">✓</span> Experienced local guides
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
