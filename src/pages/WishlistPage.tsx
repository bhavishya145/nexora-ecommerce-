import React from 'react';
import { Heart, ShoppingBag, Trash2, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface WishlistPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlistProducts, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleShareWishlist = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Wishlist link copied to clipboard!', 'success');
  };

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    wishlistProducts.forEach(p => {
      if (p.stock > 0) {
        addItem(p);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      showToast(`Moved ${addedCount} wishlist items to your cart!`, 'success');
    } else {
      showToast('All items in wishlist are currently out of stock', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
              Your Hardware Watchlist ({wishlistProducts.length})
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Track price drops, back-in-stock updates, and reserved lab items
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareWishlist}
              className="px-4 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Wishlist</span>
            </button>
            <button
              onClick={handleMoveAllToCart}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-colors"
            >
              Move All to Cart
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 border border-neutral-800 rounded-3xl bg-neutral-900/20 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Your watchlist is empty</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Click the heart icon on any product in the catalog to save it for future builds.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div
              key={product.id}
              className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div
                  onClick={() => onNavigate('product', product.slug || product.id)}
                  className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 relative cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-500 text-neutral-950 text-[10px] font-bold">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-[11px] text-neutral-500">{product.brand} · {product.category}</div>
                  <h3
                    onClick={() => onNavigate('product', product.slug || product.id)}
                    className="text-xs font-semibold text-white truncate cursor-pointer hover:text-cyan-400 mt-0.5"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-cyan-400 font-heading">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-neutral-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => addItem(product)}
                  disabled={product.stock <= 0}
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
