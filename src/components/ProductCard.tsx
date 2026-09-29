import React from 'react';
import { Star, Heart, ShoppingBag, Scale, Zap, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: string, param?: string) => void;
  matchScore?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, matchScore }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-neutral-700 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl">
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden cursor-pointer" onClick={() => onNavigate('product', product.slug || product.id)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating Quick Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            title={isCompared ? 'In comparison' : 'Compare product'}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isCompared
                ? 'bg-purple-600 text-white'
                : 'bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Subtle Discount / Deal Tag */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-cyan-500/90 text-neutral-950 text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
            -{product.discountPercentage}%
          </div>
        )}

        {/* Match score if provided */}
        {matchScore && (
          <div className="absolute bottom-3 left-3 bg-neutral-950/90 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{matchScore}% Match</span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed Metadata Line with typographic separators (anti-slop rule) */}
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1.5">
          <span className="text-neutral-300 font-medium">{product.brand}</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{product.category}</span>
          {product.sustainability && (
            <>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <Shield className="w-3 h-3" />
                <span>Eco {product.sustainability.ecoScore}</span>
              </span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onNavigate('product', product.slug || product.id)}
          className="text-sm font-semibold text-neutral-100 hover:text-cyan-400 line-clamp-1 transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Product Tagline */}
        <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
          {product.tagline}
        </p>

        {/* Rating and Stock Alert */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-neutral-500 text-[11px]">({product.reviewCount})</span>
          </div>

          {isOutOfStock ? (
            <span className="text-[11px] font-medium text-rose-400">Sold out</span>
          ) : isLowStock ? (
            <span className="text-[11px] font-medium text-amber-400">Only {product.stock} left</span>
          ) : (
            <span className="text-[11px] text-neutral-500">In stock</span>
          )}
        </div>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white font-heading">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.shippingInfo.freeShipping && (
              <span className="text-[10px] text-neutral-400">Free Priority Shipping</span>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
