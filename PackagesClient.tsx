"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: string;
  originalPrice: string | null;
  images: string[];
  duration: string | null;
  location: string | null;
  travelType: string | null;
  rating: string | null;
  reviewCount: number | null;
  bestSeller: boolean | null;
  featured: boolean | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  products: Product[];
  categories: Category[];
  initialCategory: string;
  initialTravelType: string;
  initialSort: string;
  initialSearch: string;
}

export default function PackagesClient({
  products,
  categories,
  initialCategory,
  initialTravelType,
  initialSort,
  initialSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/packages?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/packages");
  };

  const hasActiveFilters = initialCategory || initialTravelType || initialSearch;

  const travelTypes = [
    { value: "", label: "All Types", icon: "🌍" },
    { value: "family", label: "Families", icon: "👨‍👩‍👧‍👦" },
    { value: "couple", label: "Couples", icon: "💑" },
    { value: "solo", label: "Solo", icon: "🎒" },
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-brand-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            {initialCategory
              ? categories.find((c) => c.slug === initialCategory)?.name || "All Packages"
              : initialTravelType
              ? `${travelTypes.find((t) => t.value === initialTravelType)?.label || ""} Packages`
              : "All Travel Packages"}
          </h1>
          <p className="text-brand-200 text-lg max-w-2xl">
            {products.length} extraordinary {products.length === 1 ? "journey" : "journeys"} waiting to be discovered
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search destinations, activities..."
                defaultValue={initialSearch}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateFilter("search", (e.target as HTMLInputElement).value);
                  }
                }}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Travel Type Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              {travelTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => updateFilter("travelType", type.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    initialTravelType === type.value
                      ? "bg-brand-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>

            {/* Sort + Filter Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={initialSort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-brand-400 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtersOpen ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                  <select
                    value={initialCategory}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Price Range</label>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          const params = new URLSearchParams(searchParams.toString());
                          params.delete("minPrice");
                          params.delete("maxPrice");
                          router.push(`/packages?${params.toString()}`);
                        } else {
                          const [min, max] = val.split("-");
                          const params = new URLSearchParams(searchParams.toString());
                          params.set("minPrice", min);
                          if (max) params.set("maxPrice", max);
                          else params.delete("maxPrice");
                          router.push(`/packages?${params.toString()}`);
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                    >
                      <option value="">Any Price</option>
                      <option value="0-2000">Under $2,000</option>
                      <option value="2000-4000">$2,000 — $4,000</option>
                      <option value="4000-6000">$4,000 — $6,000</option>
                      <option value="6000-">$6,000+</option>
                    </select>
                  </div>
                </div>

                {/* Clear */}
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2.5 text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors w-full text-center"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {products.map((product, idx) => (
              <div key={product.id} style={{ animationDelay: `${idx * 80}ms` }} className="animate-fade-in-up">
                <ProductCard product={product as Parameters<typeof ProductCard>[0]["product"]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
