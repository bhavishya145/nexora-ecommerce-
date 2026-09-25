import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  sizeVariant?: 'feature' | 'standard' | 'compact' | 'horizontal';
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  sizeVariant = 'standard',
  className = ''
}) => {
  const { toggleWishlist, isInWishlist, addToCart, setSelectedProductForModal } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 900);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProductForModal(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Category glow and accent styles
  const getCategoryStyles = () => {
    switch (product.category) {
      case 'TECH':
        return {
          glow: 'group-hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]',
          border: 'group-hover:border-cyan-500/60',
          accent: 'text-cyan-400'
        };
      case 'GAMING':
        return {
          glow: 'group-hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]',
          border: 'group-hover:border-purple-500/60',
          accent: 'text-purple-400'
        };
      case 'FASHION':
        return {
          glow: 'group-hover:shadow-[0_0_35px_rgba(244,63,94,0.25)]',
          border: 'group-hover:border-pink-500/60',
          accent: 'text-pink-400'
        };
      case 'FITNESS':
        return {
          glow: 'group-hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]',
          border: 'group-hover:border-emerald-500/60',
          accent: 'text-emerald-400'
        };
      case 'BEAUTY':
        return {
          glow: 'group-hover:shadow-[0_0_35px_rgba(217,70,239,0.25)]',
          border: 'group-hover:border-fuchsia-500/60',
          accent: 'text-fuchsia-400'
        };
      case 'HOME':
        return {
          glow: 'group-hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]',
          border: 'group-hover:border-amber-500/60',
          accent: 'text-amber-400'
        };
      default:
        return {
          glow: 'group-hover:shadow-[0_0_35px_rgba(59,130,246,0.25)]',
          border: 'group-hover:border-blue-500/60',
          accent: 'text-blue-400'
        };
    }
  };

  const catStyle = getCategoryStyles();

  // Feature Card (large layout in bento)
  if (sizeVariant === 'feature') {
    return (
      <div
        onClick={() => setSelectedProductForModal(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/80 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between ${catStyle.glow} ${className}`}
      >
        {/* Dynamic Category Ambient Light behind */}
        <div 
          aria-hidden="true" 
          className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none group-hover:bg-cyan-500/20 transition-all" 
        />

        {/* Card Header with Category & Badge */}
        <div className="p-6 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold tracking-widest uppercase ${catStyle.accent}`}>
              {product.category}
            </span>
            {product.badge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/10 text-cyan-300 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {product.badge}
              </span>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            aria-label="Add to wishlist"
            className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors border border-white/10 hover:border-rose-400/50"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Visual Canvas */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden flex items-center justify-center px-6">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain max-h-72 transform group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
          />

          {/* Quick View Floating Pill on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button
              onClick={handleQuickView}
              className="pointer-events-auto px-4 py-2 rounded-xl glass-panel-elevated border border-cyan-400/50 text-white font-medium text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>QUICK VIEW</span>
            </button>
          </div>
        </div>

        {/* Card Footer Info */}
        <div className="p-6 relative z-10 bg-gradient-to-t from-[#060810] via-[#090C17]/90 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-amber-400 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              <span className="font-semibold text-slate-200">{product.rating}</span>
            </div>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-400 text-xs">{product.reviewsCount} verified reviews</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-2 mb-4 font-light">
            {product.tagline}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-white font-mono-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 line-through font-mono-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400">
                Save {product.discountPercentage}%
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide flex items-center gap-2 transition-all duration-300 shadow-md ${
                addedAnim
                  ? 'bg-emerald-500 text-slate-950 scale-95'
                  : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Bento Card
  return (
    <div
      onClick={() => setSelectedProductForModal(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-400/70 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between ${catStyle.glow} ${className}`}
    >
      {/* Top Bar on Card */}
      <div className="p-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold tracking-wider uppercase ${catStyle.accent}`}>
            {product.category}
          </span>
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-white/5 text-cyan-300 border border-cyan-500/20">
              <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              {product.badge}
            </span>
          )}
        </div>

        <button
          onClick={handleToggleWishlist}
          aria-label="Add to wishlist"
          className="w-7 h-7 rounded-lg glass-panel flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors border border-white/10 hover:border-rose-400/40"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Visual Image container */}
      <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center px-4">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain max-h-48 group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={handleQuickView}
            className="pointer-events-auto px-3 py-1.5 rounded-lg glass-panel-elevated border border-cyan-400/40 text-white font-medium text-xs flex items-center gap-1.5 shadow-xl backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>QUICK VIEW</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 relative z-10 bg-gradient-to-t from-[#060810] via-[#080B15]/90 to-transparent">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-200 font-mono-nums">{product.rating}</span>
          <span className="text-slate-500 text-[10px]">({product.reviewsCount})</span>
        </div>

        <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors mb-1">
          {product.name}
        </h3>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <span className="text-base font-bold text-white font-mono-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 line-through ml-2 font-mono-nums">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400">
            -{product.discountPercentage}%
          </span>
        </div>

        {/* Add to cart button */}
        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 ${
              addedAnim
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED TO CART</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
