import React from 'react';
import { X, Trash2, ShoppingBag, Scale, Star, Check } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

interface CompareModalProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ onNavigate }) => {
  const { compareProducts, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();
  const { addItem } = useCart();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Product Specifications Comparison ({compareProducts.length}/4)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {compareProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-x-auto p-6">
          {compareProducts.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs">
              <Scale className="w-10 h-10 mx-auto mb-3 text-neutral-700" />
              <p className="text-sm font-semibold text-neutral-300">No products in comparison queue</p>
              <p className="mt-1">Click the scale icon on any product card in the catalog to compare up to 4 models.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(200px,1fr))] min-w-[700px] gap-4">
              {/* Labels Column */}
              <div className="space-y-6 pt-36 text-xs font-semibold text-neutral-400 border-r border-neutral-800/80 pr-4">
                <div className="h-8 flex items-center">Price</div>
                <div className="h-8 flex items-center">Rating</div>
                <div className="h-8 flex items-center">Brand</div>
                <div className="h-8 flex items-center">Category</div>
                <div className="h-8 flex items-center">Stock Availability</div>
                <div className="h-8 flex items-center">Eco Sustainability</div>
                <div className="h-8 flex items-center">Warranty & Trial</div>
                <div className="h-10 flex items-center">Actions</div>
              </div>

              {/* Product Columns */}
              {compareProducts.map(p => (
                <div key={p.id} className="space-y-6 relative flex flex-col">
                  {/* Top card */}
                  <div className="h-36 flex flex-col items-center text-center relative group">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      title="Remove from comparison"
                      className="absolute top-0 right-0 p-1 rounded-full bg-neutral-800 hover:bg-rose-900/60 text-neutral-400 hover:text-rose-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      onClick={() => {
                        setIsCompareOpen(false);
                        onNavigate('product', p.slug || p.id);
                      }}
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-950 mb-2 cursor-pointer hover:scale-105 transition-transform"
                    />
                    <h4
                      onClick={() => {
                        setIsCompareOpen(false);
                        onNavigate('product', p.slug || p.id);
                      }}
                      className="text-xs font-semibold text-white truncate max-w-full hover:text-cyan-400 cursor-pointer"
                    >
                      {p.name}
                    </h4>
                  </div>

                  {/* Price */}
                  <div className="h-8 flex items-center text-sm font-bold text-cyan-400 font-heading">
                    ${p.price.toFixed(2)}
                  </div>

                  {/* Rating */}
                  <div className="h-8 flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{p.rating.toFixed(1)}</span>
                    <span className="text-neutral-500">({p.reviewCount} reviews)</span>
                  </div>

                  {/* Brand */}
                  <div className="h-8 flex items-center text-xs text-neutral-300">
                    {p.brand}
                  </div>

                  {/* Category */}
                  <div className="h-8 flex items-center text-xs text-neutral-300">
                    {p.category}
                  </div>

                  {/* Stock */}
                  <div className="h-8 flex items-center text-xs">
                    {p.stock > 0 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {p.stock} units ready
                      </span>
                    ) : (
                      <span className="text-rose-400">Out of Stock</span>
                    )}
                  </div>

                  {/* Sustainability */}
                  <div className="h-8 flex items-center text-xs text-emerald-300">
                    Grade {p.sustainability.ecoScore} · Zero Carbon
                  </div>

                  {/* Warranty */}
                  <div className="h-8 flex items-center text-xs text-neutral-400">
                    2-Year Lab Warranty · 30-Day Trial
                  </div>

                  {/* Add to Cart button */}
                  <div className="h-10 flex items-center">
                    <button
                      onClick={() => addItem(p)}
                      disabled={p.stock <= 0}
                      className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
