import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface CartDrawerProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    shippingFee,
    tax,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim().toUpperCase());
    setIsApplying(false);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white font-heading">
                Shopping Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-neutral-900/60 border-b border-neutral-800/80 text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-neutral-300 font-medium">
                {subtotal >= freeShippingThreshold
                  ? '🎉 Qualified for Free Priority Drone Shipping!'
                  : `Add $${remainingForFreeShipping.toFixed(2)} more for Free Shipping`}
              </span>
              <span className="text-cyan-400 font-semibold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-200">Your cart is empty</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Explore our futuristic collection of planar acoustics, wearables and modular EDC gear.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors inline-block"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/40 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover bg-neutral-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                      {item.variantName && (
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.variantName}</p>
                      )}
                      <div className="text-xs font-bold text-cyan-400 mt-1">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-white text-neutral-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-white px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-white text-neutral-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                          className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-900/60 space-y-4">
              {/* Coupon code input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="font-semibold">{appliedCoupon.code}</span>
                      <span className="text-neutral-400 ml-1.5">(-${appliedCoupon.discountAmount.toFixed(2)})</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {isApplying ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-200 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-neutral-200 font-medium">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-neutral-200 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="text-cyan-400 font-heading">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('checkout');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>30-Day Money Back Guarantee · Encrypted 256-bit Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
