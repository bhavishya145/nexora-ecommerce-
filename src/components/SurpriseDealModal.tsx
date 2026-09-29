import React, { useState } from 'react';
import { X, Gift, Sparkles, Copy, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface SurpriseDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const SurpriseDealModal: React.FC<SurpriseDealModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { addItem, applyCoupon } = useCart();
  const { showToast } = useToast();

  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dealData, setDealData] = useState<{
    product: Product;
    discountPercentage: number;
    promoCode: string;
    expiresInMinutes: number;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleReveal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/surprise-deal');
      const data = await res.json();
      setDealData(data);
      setRevealed(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      showToast('Could not fetch daily deal right now', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!dealData) return;
    navigator.clipboard.writeText(dealData.promoCode);
    setCopied(true);
    showToast(`Coupon code ${dealData.promoCode} copied!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToCartWithDeal = async () => {
    if (!dealData) return;
    addItem(dealData.product);
    await applyCoupon('WELCOME10'); // or apply discount
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow behind */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!revealed ? (
          <div className="py-6 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-pink-500/25 animate-bounce">
              <Gift className="w-10 h-10 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-heading">
                Daily Mystery Deal
              </h3>
              <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Unlock today's exclusive algorithmic discount voucher valid for 45 minutes on our top hardware.
              </p>
            </div>

            <button
              onClick={handleReveal}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Unlocking Mystery Vault...' : 'Unlock Mystery Deal'}</span>
            </button>
          </div>
        ) : (
          dealData && (
            <div className="py-4 space-y-5 animate-in fade-in zoom-in-95">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-700/60 text-pink-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{dealData.discountPercentage}% OFF UNLOCKED!</span>
              </div>

              <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center gap-3 text-left">
                <img
                  src={dealData.product.images[0]}
                  alt={dealData.product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {dealData.product.brand}
                  </span>
                  <h4 className="text-xs font-semibold text-white truncate">
                    {dealData.product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-bold text-cyan-400">
                      ${(dealData.product.price * (1 - dealData.discountPercentage / 100)).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-neutral-500 line-through">
                      ${dealData.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo code box */}
              <div className="p-3 rounded-2xl bg-neutral-950 border border-dashed border-cyan-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                    Exclusive Coupon Code
                  </span>
                  <span className="text-sm font-bold text-cyan-400 tracking-wider">
                    {dealData.promoCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCartWithDeal}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Claim & Add to Cart</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('product', dealData.product.slug || dealData.product.id);
                  }}
                  className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                >
                  View Gear
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
