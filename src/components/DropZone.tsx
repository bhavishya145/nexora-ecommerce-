import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Clock, Sparkles, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export const DropZone: React.FC = () => {
  const { products, addToCart, setSelectedProductForModal } = useApp();

  // Filter products marked as drops (e.g., Vortex Quantum OLED Deck and Spectra Aero Drone)
  const dropProducts = products.filter((p) => p.isDrop || (p.stockLeft && p.stockLeft < 20));

  // Countdown timer state: 04 : 18 : 32 : 09
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 32,
    seconds: 9
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  return (
    <section id="drops" className="py-24 relative px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 right-10 w-96 h-96 bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 left-10 w-80 h-80 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Drop Header Banner */}
      <div className="rounded-3xl glass-panel-elevated border border-rose-500/30 p-8 sm:p-12 mb-12 relative overflow-hidden">
        {/* Subtle animated scanline / pulse */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold tracking-widest uppercase mb-4">
              <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>NEXORA DROPS // ULTRA-LIMITED RELEASES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              THE NEXT DROP IS APPROACHING.
            </h2>
            <p className="text-slate-300 text-sm font-light leading-relaxed max-w-md">
              Encrypted batch drops with serialized hardware authentication. Once the countdown strikes zero, vault reservations lock permanently.
            </p>
          </div>

          {/* Large Countdown Clock */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>GLOBAL VAULT UNLOCK TIMER</span>
            </span>

            <div className="flex items-center gap-2 sm:gap-4 font-mono-nums">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl glass-panel border border-cyan-400/40 flex items-center justify-center text-2xl sm:text-4xl font-extrabold text-white shadow-lg shadow-cyan-500/10">
                  {formatDigit(timeLeft.days)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Days</span>
              </div>

              <span className="text-2xl font-bold text-cyan-400 mb-4">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl glass-panel border border-violet-400/40 flex items-center justify-center text-2xl sm:text-4xl font-extrabold text-white shadow-lg shadow-violet-500/10">
                  {formatDigit(timeLeft.hours)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Hours</span>
              </div>

              <span className="text-2xl font-bold text-violet-400 mb-4">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl glass-panel border border-pink-400/40 flex items-center justify-center text-2xl sm:text-4xl font-extrabold text-white shadow-lg shadow-pink-500/10">
                  {formatDigit(timeLeft.minutes)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Mins</span>
              </div>

              <span className="text-2xl font-bold text-pink-400 mb-4">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl glass-panel border border-rose-500/40 flex items-center justify-center text-2xl sm:text-4xl font-extrabold text-rose-300 shadow-lg shadow-rose-500/20 animate-pulse">
                  {formatDigit(timeLeft.seconds)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Limited Product Cards with Glowing Borders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {dropProducts.map((product) => {
          const stock = product.stockLeft || 12;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProductForModal(product)}
              className="group relative rounded-3xl glass-panel-elevated border border-rose-500/30 hover:border-cyan-400/80 transition-all duration-300 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 cursor-pointer hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]"
            >
              {/* Product Visual */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden bg-[#0A0D1A] border border-white/10 shrink-0 flex items-center justify-center p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                />

                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/80 text-white text-[9px] font-extrabold uppercase tracking-wider">
                    LIMITED
                  </span>
                </div>
              </div>

              {/* Card Meta & Controls */}
              <div className="flex-1 flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                      {product.category}
                    </span>
                    <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1 font-mono-nums">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      ONLY {stock} LEFT
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 font-light">
                    {product.tagline}
                  </p>
                </div>

                {/* Stock progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono-nums">
                    <span>Vault Allocation</span>
                    <span className="text-rose-400 font-semibold">{stock} units remaining</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(15, (stock / 20) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <span className="text-xl font-extrabold text-white font-mono-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 line-through ml-2 font-mono-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-500/30 transition-all active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>GET IT NOW</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
