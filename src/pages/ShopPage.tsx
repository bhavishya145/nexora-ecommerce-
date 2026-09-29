import React, { useState, useEffect } from 'react';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Check,
  Grid,
  List as ListIcon,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SEED_CATEGORIES, SEED_BRANDS } from '../data/seedData';

interface ShopPageProps {
  initialQuery?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialQuery = '', onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filters State
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Parse initial query params if present (e.g. "category=neural-audio" or "q=drone")
  useEffect(() => {
    if (initialQuery) {
      const params = new URLSearchParams(initialQuery);
      if (params.get('category')) setSelectedCategory(params.get('category')!);
      if (params.get('brand')) setSelectedBrand(params.get('brand')!);
      if (params.get('q')) setSearch(params.get('q')!);
      if (params.get('filter') === 'flash') setMinDiscount('20');
      if (params.get('filter') === 'radar') {
        setMinDiscount('15');
        setSortBy('discount');
      }
    }
  }, [initialQuery]);

  // Fetch filtered products from API
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.set('q', search.trim());
      if (selectedCategory && selectedCategory !== 'all') queryParams.set('category', selectedCategory);
      if (selectedBrand && selectedBrand !== 'all') queryParams.set('brand', selectedBrand);
      if (minPrice) queryParams.set('minPrice', minPrice);
      if (maxPrice) queryParams.set('maxPrice', maxPrice);
      if (minRating) queryParams.set('minRating', minRating);
      if (inStockOnly) queryParams.set('inStock', 'true');
      if (minDiscount) queryParams.set('discount', minDiscount);
      queryParams.set('sort', sortBy);
      queryParams.set('page', String(currentPage));
      queryParams.set('limit', '12');

      try {
        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [
    search,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    minDiscount,
    sortBy,
    currentPage
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setInStockOnly(false);
    setMinDiscount('');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    minPrice ||
    maxPrice ||
    minRating ||
    inStockOnly ||
    minDiscount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Hardware Catalog
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Displaying {totalProducts} lab-tested instruments across 10 specialized divisions
          </p>
        </div>

        {/* Sorting & Filter trigger for mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5">
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-neutral-900">Most Popular</option>
              <option value="newest" className="bg-neutral-900">Newest Arrivals</option>
              <option value="price-asc" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-desc" className="bg-neutral-900">Price: High to Low</option>
              <option value="rating" className="bg-neutral-900">Highest Rated</option>
              <option value="discount" className="bg-neutral-900">Steepest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-6 p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Catalog Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search in Catalog */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Department / Category Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">
              Department
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>All Departments</span>
                {selectedCategory === 'all' && <Check className="w-3 h-3" />}
              </button>
              {SEED_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCategory === cat.slug && <Check className="w-3 h-3 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">
              Brand / Manufacturer
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedBrand === 'all'
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === 'all' && <Check className="w-3 h-3" />}
              </button>
              {SEED_BRANDS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand(brand.name);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedBrand === brand.name
                      ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{brand.name}</span>
                  {selectedBrand === brand.name && <Check className="w-3 h-3 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500"
              />
              <span className="text-neutral-500 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">
              Minimum Rating
            </label>
            <div className="flex items-center gap-1.5">
              {['4.8', '4.5', '4.0'].map(rating => (
                <button
                  key={rating}
                  onClick={() => {
                    setMinRating(minRating === rating ? '' : rating);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                    minRating === rating
                      ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rating}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* In Stock & Discount Toggles */}
          <div className="space-y-3 pt-2 border-t border-neutral-800/80">
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-neutral-700 bg-neutral-900 text-cyan-500 focus:ring-0"
              />
              <span>In Stock Ready to Dispatch</span>
            </label>

            <div>
              <span className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Special Offers
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'All Deals', value: '15' },
                  { label: '20%+ Off', value: '20' }
                ].map(d => (
                  <button
                    key={d.value}
                    onClick={() => {
                      setMinDiscount(minDiscount === d.value ? '' : d.value);
                      setCurrentPage(1);
                    }}
                    className={`py-1 rounded-lg border text-xs text-center transition-colors ${
                      minDiscount === d.value
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid & Active Filters */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs">
              <span className="text-neutral-500">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                >
                  <span>Category: {selectedCategory}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedBrand !== 'all' && (
                <button
                  onClick={() => setSelectedBrand('all')}
                  className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                >
                  <span>Brand: {selectedBrand}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {minDiscount && (
                <button
                  onClick={() => setMinDiscount('')}
                  className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                >
                  <span>≥{minDiscount}% Off</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {inStockOnly && (
                <button
                  onClick={() => setInStockOnly(false)}
                  className="px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1"
                >
                  <span>In Stock Only</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={resetFilters}
                className="text-cyan-400 hover:underline ml-auto font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3 animate-pulse">
                  <div className="aspect-square bg-neutral-800 rounded-xl" />
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                  <div className="h-3 bg-neutral-800 rounded w-full" />
                  <div className="h-6 bg-neutral-800 rounded w-1/3 mt-4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-neutral-800 rounded-3xl bg-neutral-900/20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">No hardware matched your criteria</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your price range, clearing brand selections, or search for a broader keyword.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          )}

          {/* Clean Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-neutral-800">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-semibold text-neutral-300 disabled:opacity-40 hover:bg-neutral-800 transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors ${
                    currentPage === i + 1
                      ? 'bg-cyan-500 text-neutral-950 font-bold'
                      : 'border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3.5 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-semibold text-neutral-300 disabled:opacity-40 hover:bg-neutral-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm lg:hidden">
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-neutral-950 border-l border-neutral-800 p-5 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="text-sm font-bold text-white">Filters</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">Department</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                >
                  <option value="all">All Departments</option>
                  {SEED_CATEGORIES.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                >
                  <option value="all">All Brands</option>
                  {SEED_BRANDS.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-cyan-500 text-neutral-950 text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
