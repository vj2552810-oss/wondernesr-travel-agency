"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: string;
  originalPrice: string | null;
  images: string[];
  duration: string | null;
  location: string | null;
  travelType: string | null;
  highlights: string[] | null;
  included: string[] | null;
  featured: boolean | null;
  bestSeller: boolean | null;
  maxGuests: number | null;
  rating: string | null;
  reviewCount: number | null;
}

interface Review {
  id: number;
  authorName: string;
  rating: number;
  title: string | null;
  content: string;
  travelDate: string | null;
  travelType: string | null;
  verified: boolean | null;
  createdAt: Date;
}

interface Props {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
  categoryName: string;
}

export default function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
  categoryName,
}: Props) {
  const { addItem, isLoading } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [guests, setGuests] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const images = product.images || [];
  const discount = product.originalPrice
    ? Math.round(
        ((parseFloat(product.originalPrice) - parseFloat(product.price)) /
          parseFloat(product.originalPrice)) *
          100
      )
    : 0;

  const travelTypeLabel =
    product.travelType === "family"
      ? "👨‍👩‍👧‍👦 Perfect for Families"
      : product.travelType === "couple"
      ? "💑 Ideal for Couples"
      : product.travelType === "solo"
      ? "🎒 Great for Solo Travelers"
      : "";

  const avgRating = product.rating ? parseFloat(product.rating) : 0;
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleAddToCart = () => {
    addItem(product.id, guests, travelDate);
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href="/packages" className="hover:text-brand-600 transition-colors">
              Packages
            </Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
              <img
                src={images[selectedImage] || ""}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {product.bestSeller && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                  Best Seller
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                  Save {discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedImage === idx
                        ? "border-brand-500 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Travel Type */}
            <div className="flex items-center gap-3 mb-3">
              {categoryName && (
                <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full">
                  {categoryName}
                </span>
              )}
              {travelTypeLabel && (
                <span className="text-sm text-gray-500">{travelTypeLabel}</span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(avgRating) ? "text-amber-400" : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{avgRating}</span>
                <span className="text-sm text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.duration && (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">🕐</span>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Duration</span>
                    <span className="text-sm font-semibold text-gray-900">{product.duration}</span>
                  </div>
                </div>
              )}
              {product.location && (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">📍</span>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Location</span>
                    <span className="text-sm font-semibold text-gray-900">{product.location}</span>
                  </div>
                </div>
              )}
              {product.maxGuests && (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">👥</span>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Max Guests</span>
                    <span className="text-sm font-semibold text-gray-900">{product.maxGuests} people</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                <span className="text-lg">✅</span>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Cancellation</span>
                  <span className="text-sm font-semibold text-gray-900">Free up to 30 days</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-brand-50 to-warm-50 rounded-2xl p-6 mb-6 border border-brand-100">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${parseFloat(product.price).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through mb-0.5">
                    ${parseFloat(product.originalPrice).toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full mb-0.5">
                    SAVE ${(parseFloat(product.originalPrice!) - parseFloat(product.price)).toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">per person • all-inclusive</span>

              {/* Booking Options */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  >
                    {Array.from({ length: product.maxGuests || 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full mt-4 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl font-semibold text-lg hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg shadow-brand-600/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Book This Package"}
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">About This Trip</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">Trip Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 py-2">
                      <svg className="w-5 h-5 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            {product.included && product.included.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">What&apos;s Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.included.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-100">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                  Traveler Reviews
                </h2>
                <p className="text-gray-500 mt-1">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"} from verified travelers
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
                <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xl font-bold text-gray-900">{avgRating}</span>
              </div>
            </div>

            <div className="space-y-6">
              {displayedReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                        {review.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.authorName}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {review.travelDate && <span>{review.travelDate}</span>}
                          {review.travelType && (
                            <>
                              <span>•</span>
                              <span>{review.travelType}</span>
                            </>
                          )}
                          {review.verified && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium">✓ Verified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "text-amber-400" : "text-gray-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {showAllReviews ? "Show Less" : `Show All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-100 pb-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              You Might Also Love
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as Parameters<typeof ProductCard>[0]["product"]} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
