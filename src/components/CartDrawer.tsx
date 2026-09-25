import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    cartItemCount,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Blurred Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div className="w-screen max-w-md pointer-events-auto relative">
          <div className="h-full flex flex-col glass-panel-elevated bg-[#080B17]/95 border-l border-white/10 shadow-2xl backdrop-blur-2xl text-slate-100">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">YOUR CART</h2>
                  <p className="text-xs text-slate-400 font-mono-nums">
                    {cartItemCount} {cartItemCount === 1 ? 'quantum item' : 'quantum items'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs mb-6">
                    Discover futuristic tech, cyber apparel, and holographic devices in our catalog.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    EXPLORE MARKETPLACE
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="p-4 rounded-2xl glass-panel border border-white/10 flex gap-4 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                            }
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{item.selectedColor}</span>
                          {item.selectedSize && (
                            <>
                              <span>·</span>
                              <span>{item.selectedSize}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center glass-panel rounded-lg border border-white/10 px-1 py-0.5">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                -1
                              )
                            }
                            className="w-6 h-6 rounded text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white font-mono-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                1
                              )
                            }
                            className="w-6 h-6 rounded text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right font-mono-nums">
                          <span className="text-xs font-bold text-white">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary & Checkout Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#060812]">
                <div className="space-y-2 text-xs mb-4 font-mono-nums">
                  <div className="flex justify-between text-slate-400">
                    <span>SUBTOTAL</span>
                    <span className="text-slate-200">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>DISCOUNT</span>
                      <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>DELIVERY</span>
                    <span>
                      {cartDeliveryFee === 0 ? (
                        <span className="text-cyan-400 font-semibold uppercase">FREE (QUANTUM)</span>
                      ) : (
                        `₹${cartDeliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between text-base font-extrabold text-white">
                    <span>TOTAL</span>
                    <span className="text-cyan-400 text-lg">
                      ₹{(cartTotal + cartDeliveryFee).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {cartDiscount > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center mb-4 flex items-center justify-center gap-1.5 font-mono-nums">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>YOU SAVED ₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 active:scale-98 transition-all"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
