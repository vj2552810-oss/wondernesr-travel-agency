"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const travelTypeLabel = product.travelType === "family" ? "👨‍👩‍👧‍👦 Family" : product.travelType === "couple" ? "💑 Couples" : product.travelType === "solo" ? "🎒 Solo" : "";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.images[0] || ""}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.bestSeller && (
            <span className="px-2.5 py-1 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
              Best Seller
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
              {discount}% Off
            </span>
          )}
        </div>

        {/* Quick Add */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product.id);
          }}
          className="absolute bottom-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-50 hover:text-brand-600"
          title="Add to cart"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        {/* Duration badge */}
        {product.duration && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 shadow-md">
            🕐 {product.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {product.location && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {product.location}
            </span>
          )}
        </div>

        <Link href={`/packages/${product.slug}`}>
          <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors leading-snug mb-1.5">
            {product.name}
          </h3>
        </Link>

        {product.shortDescription && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Rating & Type */}
        <div className="flex items-center gap-3 mb-3">
          {product.rating && parseFloat(product.rating) > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(parseFloat(product.rating!))
                        ? "text-amber-400"
                        : "text-gray-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-medium text-gray-600">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>
          )}
          {travelTypeLabel && (
            <span className="text-xs text-gray-500 ml-auto">{travelTypeLabel}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 block">From</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${parseFloat(product.price).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${parseFloat(product.originalPrice).toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400">per person</span>
          </div>
          <Link
            href={`/packages/${product.slug}`}
            className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
