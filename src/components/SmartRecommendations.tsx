import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Sparkles, Cpu, Eye, ShoppingBag, ArrowRight } from 'lucide-react';

export const SmartRecommendations: React.FC = () => {
  const { products, setSelectedProductForModal, addToCart } = useApp();

  const recommendationBuckets = [
    {
      cue: 'Because you explored Gaming',
      tag: 'Neural Predictive Match: 99.4%',
      product: products.find((p) => p.category === 'GAMING') || products[0],
      icon: Cpu,
      gradient: 'from-purple-500/20 to-indigo-500/10'
    },
    {
      cue: 'Trending near you',
      tag: 'Metropolitan Demand: +184%',
      product: products.find((p) => p.category === 'TECH') || products[1],
      icon: Sparkles,
      gradient: 'from-cyan-500/20 to-blue-500/10'
    },
    {
      cue: 'People with similar interests bought',
      tag: 'Synaptic Affinity: High',
      product: products.find((p) => p.category === 'ACCESSORIES') || products[2],
      icon: Sparkles,
      gradient: 'from-pink-500/20 to-rose-500/10'
    },
    {
      cue: 'Back in demand',
      tag: 'Restocked in Batch 04',
      product: products.find((p) => p.category === 'FASHION') || products[3],
      icon: Cpu,
      gradient: 'from-amber-500/20 to-orange-500/10'
    },
    {
      cue: 'Your next obsession',
      tag: 'Curated for 2030 Lifestyle',
      product: products.find((p) => p.category === 'HOME') || products[4] || products[0],
      icon: Sparkles,
      gradient: 'from-emerald-500/20 to-cyan-500/10'
    }
  ];

  return (
    <section id="curated" className="py-20 relative px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>ALGORITHMIC SYNAPSE // CURATED FEED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            CURATED FOR YOU
          </h2>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm font-light max-w-md">
          Continuous telemetry analyzes design affinity and lifestyle velocity to synthesize bespoke discovery streams.
        </p>
      </div>

      {/* Grid of 5 smart cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendationBuckets.map((bucket, index) => {
          const item = bucket.product;
          if (!item) return null;

          return (
            <div
              key={index}
              onClick={() => setSelectedProductForModal(item)}
              className="group relative rounded-3xl glass-panel border border-white/10 hover:border-cyan-400/60 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-lg hover:shadow-cyan-500/15"
            >
              {/* Algorithmic Cue Header */}
              <div className="mb-4">
                <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider block mb-1">
                  {bucket.tag}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  "{bucket.cue}"
                </h4>
              </div>

              {/* Product preview */}
              <div className="relative w-full aspect-square rounded-2xl bg-[#090C19] border border-white/5 p-4 flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
                
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Product Details & Actions */}
              <div>
                <p className="text-xs font-semibold text-white truncate mb-1">
                  {item.name}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-sm font-bold text-cyan-400 font-mono-nums">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, 1);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
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
