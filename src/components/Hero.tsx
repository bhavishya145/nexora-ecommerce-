import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Star, 
  Truck, 
  Flame, 
  Layers, 
  ShieldCheck,
  Eye
} from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onDealsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onDealsClick }) => {
  const { products, setSelectedProductForModal } = useApp();
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Active highlighted orbiting item
  const [activeIndex, setActiveIndex] = useState(0);

  // Take first 4 distinct products for orbit
  const orbitProducts = products.slice(0, 4);

  // Slowly rotate the orbit
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Aurora Glows */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 -right-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-[130px] pointer-events-none" 
      />

      {/* Subtle Grid Matrix Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Super Header Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NEXORA 2030 // QUANTUM COMMERCE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 text-balance">
              SHOP BEYOND <br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
                ORDINARY.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-light">
              Enter a smarter marketplace where discovery, technology and style collide. Curated cybernetic goods, frictionless checkout, and sub-orbital delivery logistics.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreClick}
                className="group relative px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2.5 w-full sm:w-auto"
              >
                <span>ENTER NEXORA</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onDealsClick}
                className="px-6 py-4 rounded-xl glass-panel hover:bg-white/10 border border-white/15 text-slate-200 font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>EXPLORE DEALS</span>
              </button>
            </div>

            {/* Trust proof inline */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base font-mono-nums">18.4K+</span>
                <span>Active Explorers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold text-base font-mono-nums">99.8%</span>
                <span>Sub-orbital Reliability</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-400 font-bold text-base font-mono-nums">0.02s</span>
                <span>Instant Checkout</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D-Inspired Shopping Sphere & Orbit System */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-10">
            
            {/* The Outer Orbit Rings */}
            <div className="relative w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center animate-[spin_40s_linear_infinite]">
              {/* Secondary concentric ring */}
              <div className="absolute inset-8 rounded-full border border-violet-500/20" />
              <div className="absolute inset-20 rounded-full border border-pink-500/20" />
            </div>

            {/* Glowing Central NEXORA Sphere Core */}
            <div className="absolute z-20 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-violet-900 via-indigo-600 to-cyan-500 p-1 shadow-[0_0_80px_rgba(6,182,212,0.4)] flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full bg-[#080A14] flex flex-col items-center justify-center p-4 text-center border border-cyan-400/40 backdrop-blur-md">
                <span className="text-cyan-400 text-xs font-mono font-semibold tracking-wider">CORE</span>
                <span className="text-xl sm:text-2xl font-black text-white tracking-tighter">NEXORA</span>
                <span className="text-[10px] text-slate-400 mt-0.5">2030 NODE</span>
              </div>
            </div>

            {/* Orbiting Products */}
            {orbitProducts.map((product, idx) => {
              // Calculate 4 positions around 360 degrees
              const angleDeg = (orbitAngle + idx * 90) % 360;
              const angleRad = (angleDeg * Math.PI) / 180;
              // Radius of orbit in px
              const radius = 175; // Responsive radius base
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <div
                  key={product.id}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  className="absolute z-30 transition-transform duration-100 ease-linear"
                >
                  <div
                    onClick={() => setSelectedProductForModal(product)}
                    className="group relative cursor-pointer p-2 rounded-2xl glass-panel-elevated border border-white/20 hover:border-cyan-400 shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-110 bg-[#0E1222]/90 flex items-center gap-2.5 backdrop-blur-xl"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900/80 border border-white/10 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="pr-2 max-w-[120px] hidden sm:block">
                      <p className="text-[11px] font-semibold text-white truncate">{product.name}</p>
                      <p className="text-[10px] font-mono font-medium text-cyan-400">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Floating Mini Cards Around Core */}
            
            {/* Card 1: FLASH SALE */}
            <div className="absolute top-2 left-4 sm:left-2 z-30 animate-bounce [animation-duration:3.5s]">
              <div className="glass-panel px-3.5 py-2 rounded-xl border border-amber-500/40 shadow-lg flex items-center gap-2 text-xs font-semibold text-amber-300 backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>FLASH SALE ⚡</span>
              </div>
            </div>

            {/* Card 2: 98% CUSTOMER RATING */}
            <div className="absolute bottom-4 left-6 sm:left-10 z-30 animate-bounce [animation-duration:4.2s]">
              <div className="glass-panel px-3.5 py-2 rounded-xl border border-cyan-500/40 shadow-lg flex items-center gap-2 text-xs font-semibold text-cyan-200 backdrop-blur-xl">
                <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>98% CUSTOMER RATING</span>
              </div>
            </div>

            {/* Card 3: FREE DELIVERY */}
            <div className="absolute top-6 right-2 sm:right-6 z-30 animate-bounce [animation-duration:3.8s]">
              <div className="glass-panel px-3.5 py-2 rounded-xl border border-emerald-500/40 shadow-lg flex items-center gap-2 text-xs font-semibold text-emerald-300 backdrop-blur-xl">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FREE DELIVERY</span>
              </div>
            </div>

            {/* Card 4: NEW DROP */}
            <div className="absolute bottom-6 right-4 sm:right-10 z-30 animate-bounce [animation-duration:4.6s]">
              <div className="glass-panel px-3.5 py-2 rounded-xl border border-rose-500/40 shadow-lg flex items-center gap-2 text-xs font-semibold text-rose-300 backdrop-blur-xl">
                <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>NEW DROP</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
