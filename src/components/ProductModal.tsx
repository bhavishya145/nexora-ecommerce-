import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  Heart, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  ChevronRight,
  Truck
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { 
    selectedProductForModal, 
    setSelectedProductForModal, 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    setIsCheckoutOpen,
    products 
  } = useApp();

  const product = selectedProductForModal;

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes ? product.sizes[0] : '');
      setQuantity(1);
      setAddedNotice(false);
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setSelectedProductForModal(null);
    setIsCheckoutOpen(true);
  };

  // Related products from same category or different
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl rounded-3xl glass-panel-elevated border border-white/15 overflow-hidden shadow-2xl my-8 bg-[#090C19]/95 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForModal(null)}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Large Product Visual */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-[#0F1428] via-[#0A0D1D] to-[#070914] relative border-b lg:border-b-0 lg:border-r border-white/10">
            {/* Top metadata */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                {product.category} ARCHIVE
              </span>
              {product.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Main Showcase Image */}
            <div className="my-8 relative aspect-square w-full max-w-md mx-auto flex items-center justify-center">
              <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 to-violet-500/15 rounded-full blur-[50px] pointer-events-none" 
              />
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] z-10"
              />
            </div>

            {/* Quick Micro specs highlight */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div className="p-2.5 rounded-xl glass-panel text-left">
                <span className="text-[10px] text-slate-400 uppercase block font-mono">Quantum Origin</span>
                <span className="text-xs font-semibold text-white">NEXORA Certified</span>
              </div>
              <div className="p-2.5 rounded-xl glass-panel text-left">
                <span className="text-[10px] text-slate-400 uppercase block font-mono">Hardware Security</span>
                <span className="text-xs font-semibold text-emerald-400">Encrypted Proof</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Details */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Rating & Wishlist */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span className="text-sm font-bold text-white font-mono-nums">{product.rating}</span>
                  </div>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{product.reviewsCount} verified reviews</span>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Toggle wishlist"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-white/10 hover:border-rose-400/50 text-xs font-medium text-slate-300 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'text-rose-500 fill-rose-500' : ''}`} />
                  <span>{inWishlist ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-light mb-6">
                {product.tagline}
              </p>

              {/* Pricing & Stock */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 mb-6 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-slate-500 line-through font-mono-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    Save {product.discountPercentage}% (₹{(product.originalPrice - product.price).toLocaleString('en-IN')})
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    In Stock
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Ready for Dispatch</span>
                </div>
              </div>

              {/* Variant Selections */}
              {/* Color Selection */}
              <div className="mb-5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Chassis Tone: <span className="text-white font-semibold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                            : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection if available */}
              {product.sizes && (
                <div className="mb-5">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                    Select Sizing: <span className="text-white font-semibold">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-12 h-9 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950 shadow-md font-extrabold'
                              : 'glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-white/30'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center glass-panel rounded-xl border border-white/10 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white font-mono-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
                    addedNotice
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/15 border border-white/20 text-white'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO CART</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 sm:text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* "Why You'll Love It" Section (4 Pillars) */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 mb-8">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  WHY YOU'LL LOVE IT
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span>Fast Delivery</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>Secure Payment</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                    <span>Easy Returns (14D)</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span>Verified Product</span>
                  </div>
                </div>
              </div>

              {/* Tabs for Specifications & Reviews */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`text-xs font-bold pb-1.5 transition-colors border-b-2 ${
                      activeTab === 'specs'
                        ? 'text-cyan-400 border-cyan-400'
                        : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`text-xs font-bold pb-1.5 transition-colors border-b-2 ${
                      activeTab === 'reviews'
                        ? 'text-cyan-400 border-cyan-400'
                        : 'text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    Reviews ({product.reviewsCount})
                  </button>
                </div>

                {activeTab === 'specs' ? (
                  <div className="space-y-2 text-xs">
                    {product.specs.map((sp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1.5 border-b border-white/5 font-mono-nums"
                      >
                        <span className="text-slate-400">{sp.label}</span>
                        <span className="text-slate-200 font-medium">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">Aarav K.</span>
                        <div className="flex text-amber-400">
                          {'★'.repeat(5)}
                        </div>
                      </div>
                      <p className="text-slate-300 font-light">
                        "The neural soundstage on this is unlike anything from traditional audio gear. Pristine craftsmanship and sub-second LiFi connectivity."
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">Dr. Elena Rostova</span>
                        <div className="flex text-amber-400">
                          {'★'.repeat(5)}
                        </div>
                      </div>
                      <p className="text-slate-300 font-light">
                        "Ergonomics are top notch. Battery longevity easily exceeded the claimed 72 hours under constant heavy usage."
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Related Products Carousel */}
              <div className="border-t border-white/10 pt-6 mt-6">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  CUSTOMERS ALSO EXPLORED
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedProductForModal(rel)}
                      className="group p-2.5 rounded-xl glass-panel border border-white/10 hover:border-cyan-400 transition-all cursor-pointer text-left"
                    >
                      <div className="w-full aspect-square rounded-lg bg-black/40 overflow-hidden mb-2 flex items-center justify-center p-1">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-[11px] font-semibold text-white truncate">{rel.name}</p>
                      <p className="text-[10px] font-mono text-cyan-400 font-bold">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
