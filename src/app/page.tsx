"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { ListingWithAuthor } from "@/types";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingWithAuthor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchListings = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
      });

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const response = await fetch(`/api/listings?${params}`);
      if (response.ok) {
        const data = await response.json();
        setListings(prev => reset ? data.listings : [...prev, ...data.listings]);
        setHasMore(data.pagination.hasMore);
        setTotalCount(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setInitialLoading(false);
    }
  }, [selectedCategory, debouncedSearch]);

  // Reset and fetch on filter/search change
  useEffect(() => {
    setPage(1);
    setListings([]);
    setHasMore(true);
    fetchListings(1, true);
  }, [selectedCategory, debouncedSearch, fetchListings]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current && !initialLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchListings(nextPage, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, initialLoading, page, fetchListings]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 md:py-32 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <Container className="relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-center gap-2 mb-6 animate-slide-in-left">
              <Sparkles className="h-6 w-6 animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Discover the World
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              Amazing Travel Experiences
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                Await You
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              Book unique adventures, cultural experiences, and unforgettable
              moments around the globe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" variant="secondary" asChild className="text-lg hover:scale-105 transition-transform duration-200">
                <Link href="#experiences">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Experiences
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg hover:scale-105 transition-transform duration-200"
              >
                <Link href="/listings/create">Share Your Experience</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Search Bar */}
      <section className="py-6 bg-white border-b">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-8 border-b sticky top-16 z-40 backdrop-blur-sm bg-gray-50/95">
        <Container>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 hover:scale-105 transition-all duration-200 hover:shadow-md"
              onClick={() => setSelectedCategory(null)}
            >
              All {totalCount > 0 && `(${totalCount})`}
            </Badge>
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 hover:scale-105 transition-all duration-200 hover:shadow-md"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      {/* Listings Section */}
      <section id="experiences" className="py-12 md:py-16">
        <Container>
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {selectedCategory
                ? `${selectedCategory} Experiences`
                : debouncedSearch
                ? `Search Results`
                : "Explore All Experiences"}
            </h2>
            <p className="text-gray-600">
              {initialLoading ? "Loading..." : `${totalCount} experience${totalCount !== 1 ? "s" : ""} available`}
            </p>
          </div>

          {initialLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <ListingGrid listings={listings} />
              
              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="py-8 flex justify-center">
                {loading && (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                )}
                {!loading && !hasMore && listings.length > 0 && (
                  <p className="text-gray-500 text-sm">You&apos;ve reached the end</p>
                )}
              </div>
            </>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <Container className="relative z-10">
          <div className="text-center max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have an amazing experience to share?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of hosts sharing their unique travel experiences
              with travelers from around the world
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg hover:scale-105 transition-transform duration-200 shadow-xl">
              <Link href="/listings/create">Become a Host</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
