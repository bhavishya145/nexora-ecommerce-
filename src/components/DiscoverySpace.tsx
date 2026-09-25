import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Product } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  Zap,
  Tag
} from 'lucide-react';

export const DiscoverySpace: React.FC = () => {
  const { 
    products, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    setSelectedProductForModal
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchSearch =
        searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' retains curated order
    });
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Featured hero product in bento
  const featureProduct = filteredProducts[0];
  const secondaryProducts = filteredProducts.slice(1, 4);
  const remainingProducts = filteredProducts.slice(4);

  return (
    <section id="discovery" className="py-20 relative px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background glow for discovery space */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-900/10 via-purple-900/10 to-transparent rounded-full blur-[140px] pointer-events-none" 
      />

      {/* Discovery Header & Headline */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-3 inline-block">
          DISCOVERY SPACE // LIVE CATALOG
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          WHAT ARE YOU LOOKING FOR?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base font-light">
          Search across next-gen audio, cybernetic wearables, and neural hardware curated for 2030.
        </p>
      </div>

      {/* Futuristic Search Bar with Animated Glow */}
      <div className="max-w-2xl mx-auto mb-10 relative">
        <div className="relative group">
          {/* Animated glow border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 rounded-2xl blur-md opacity-40 group-focus-within:opacity-80 transition duration-500 group-hover:opacity-70" />
          
          <div className="relative flex items-center bg-[#090C17] rounded-2xl border border-white/10 px-5 py-4 shadow-2xl">
            <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search neural audio, chronometers, kicks, drones..."
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm sm:text-base font-light"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 mb-10">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400'
                  : 'glass-panel text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Results Count & Sorting */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white font-mono-nums">{filteredProducts.length}</span>
          <span>products available in neural grid</span>
        </div>

        <div className="flex items-center gap-3">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0B0D18] border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Bento-Style Product Layout */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 max-w-xl mx-auto p-8">
          <p className="text-lg font-bold text-white mb-2">No Quantum Items Found</p>
          <p className="text-slate-400 text-xs mb-6">
            We couldn't find matches for "{searchTerm}". Try clearing your query or explore all categories.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Bento Top Cluster: 1 Feature Card (7 cols) + 2 Medium Cards (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {featureProduct && (
              <div className="lg:col-span-7">
                <ProductCard product={featureProduct} sizeVariant="feature" className="h-full" />
              </div>
            )}

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {secondaryProducts.slice(0, 2).map((prod) => (
                <ProductCard key={prod.id} product={prod} sizeVariant="standard" />
              ))}
            </div>
          </div>

          {/* Full-Width Promotional Editorial Card in Bento */}
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 p-8 sm:p-12 shadow-2xl bg-gradient-to-r from-purple-950/60 via-[#0B0E1E] to-cyan-950/60 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-4">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                QUANTUM EXPRESS // SUB-ORBITAL DISPATCH
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Zero Emissions. Same-Hour Metropolitan Handoff.
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                All NEXORA purchases include encrypted bi-directional provenance, titanium tamper sealing, and autonomous drone dispatch within select metropolitan hubs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => setSelectedCategory('TECH')}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wider transition-colors shadow-lg shadow-cyan-400/20"
              >
                BROWSE TECH CAPSULE
              </button>
            </div>
          </div>

          {/* Secondary Bento Grid for Remaining Products */}
          {remainingProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} sizeVariant="standard" />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
