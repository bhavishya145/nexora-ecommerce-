import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  Sparkles,
  Gift,
  Scale,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Package,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Product } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAiAssistant: () => void;
  onOpenProductFinder: () => void;
  onOpenSurpriseDeal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAiAssistant,
  onOpenProductFinder,
  onOpenSurpriseDeal
}) => {
  const { user, logout, setIsAuthModalOpen, setAuthModalMode, loginAsDemo } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const { compareProducts, setIsCompareOpen } = useCompare();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, setIsNotificationOpen } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  // Debounced search autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(searchQuery)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.products || []);
          setShowSearchDropdown(true);
        })
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      onNavigate('shop', `q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/85 light:bg-white/90 light:border-neutral-200">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-neutral-900 to-indigo-950 text-cyan-300 text-xs py-1.5 px-4 text-center font-medium border-b border-cyan-900/30 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AUTONOMOUS DRONE DELIVERY: Orders over $150 dispatched within 2 hours</span>
        </span>
        <span className="text-neutral-500 hidden sm:inline">|</span>
        <button
          onClick={onOpenSurpriseDeal}
          className="underline hover:text-cyan-200 transition-colors hidden sm:inline"
        >
          Reveal Daily Mystery Coupon
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-lg tracking-wider font-heading">N</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white dark:text-white light:text-neutral-900 font-heading">
                  NEXORA
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-cyan-400 font-medium">
                  Intelligent Commerce
                </span>
              </div>
            </button>

            {/* Category Dropdown Button */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-300 hover:text-white transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showCategoryMenu && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase px-3 py-1.5">
                    Browse All Departments
                  </div>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setShowCategoryMenu(false);
                        onNavigate('shop', `category=${cat.slug}`);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:text-cyan-400 hover:bg-neutral-900/80 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-neutral-600 text-[10px]">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-lg relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search quantum gear, planar audio, titanium EDC..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSearchDropdown(true);
                }}
                className="w-full pl-9 pr-16 py-2 text-xs rounded-xl bg-neutral-900/70 border border-neutral-800 focus:border-cyan-500/70 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-neutral-500 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Instant Suggestions Dropdown */}
            {showSearchDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-xl p-2 shadow-2xl z-50">
                <div className="text-[11px] font-semibold text-neutral-500 px-3 py-1 uppercase">
                  Top Product Matches
                </div>
                {suggestions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      onNavigate('product', item.slug || item.id);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-neutral-900 rounded-lg text-left transition-colors"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 rounded-md object-cover bg-neutral-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-neutral-400">
                        {item.brand} · <span className="text-cyan-400 font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Smart Product Finder CTA */}
            <button
              onClick={onOpenProductFinder}
              title="Smart Product Finder Questionnaire"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-800/50 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Finder</span>
            </button>

            {/* AI Concierge Modal Trigger */}
            <button
              onClick={onOpenAiAssistant}
              title="Open NEXORA Concierge AI"
              className="p-2 rounded-lg border border-neutral-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 transition-colors relative"
            >
              <Sparkles className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </button>

            {/* Compare Drawer Trigger */}
            {compareProducts.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                title="Product Comparison"
                className="p-2 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-neutral-300 relative transition-colors"
              >
                <Scale className="w-4 h-4 text-purple-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {compareProducts.length}
                </span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              title="Your Wishlist"
              className="p-2 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-neutral-300 relative transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              title="Notifications"
              className="p-2 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-neutral-300 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-neutral-950 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-neutral-300 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-bold">{itemCount}</span>
            </button>

            {/* User Account Menu / Auth */}
            <div ref={profileRef} className="relative">
              {user ? (
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div className="hidden lg:block text-left text-xs leading-none mr-1">
                    <div className="font-medium text-white truncate max-w-[90px]">{user.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-cyan-400 font-semibold">{user.tier} Tier</div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400 hidden lg:block" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-neutral-500 text-xs font-medium text-neutral-200 transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Profile Dropdown */}
              {isProfileMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-neutral-800/80 mb-1">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-cyan-400 font-medium">
                      <span>{user.rewardPoints} Vault Points</span>
                      <span className="uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span>My Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('profile', 'orders');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg flex items-center gap-2"
                  >
                    <Package className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Orders & Tracking</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('profile', 'loyalty');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg flex items-center gap-2"
                  >
                    <Award className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Rewards & Streaks</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-amber-400 hover:bg-amber-950/30 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Control Center</span>
                    </button>
                  )}

                  <div className="border-t border-neutral-800/80 my-1" />

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-neutral-800 text-neutral-300 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 py-2.5 text-xs font-medium text-neutral-400 border-t border-neutral-900">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-cyan-400 ${currentView === 'home' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className={`transition-colors hover:text-cyan-400 ${currentView === 'shop' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            All Products
          </button>
          <button
            onClick={() => onNavigate('shop', 'filter=flash')}
            className="transition-colors hover:text-amber-400 text-amber-400/90 flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Flash Deals</span>
          </button>
          <button
            onClick={() => onNavigate('shop', 'filter=radar')}
            className="transition-colors hover:text-cyan-400"
          >
            Deal Radar
          </button>
          <button
            onClick={onOpenProductFinder}
            className="transition-colors hover:text-cyan-400 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Smart Match Quiz</span>
          </button>
          <button
            onClick={onOpenSurpriseDeal}
            className="transition-colors hover:text-pink-400 flex items-center gap-1 text-pink-400/90"
          >
            <Gift className="w-3 h-3 text-pink-400" />
            <span>Daily Mystery Deal</span>
          </button>
          <button
            onClick={() => onNavigate('support')}
            className={`transition-colors hover:text-cyan-400 ml-auto ${currentView === 'support' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Help & Concierge
          </button>

          {/* Quick Demo Switcher helper */}
          {!user && (
            <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-neutral-800 text-[11px]">
              <span className="text-neutral-500">Fast Demo:</span>
              <button
                onClick={() => loginAsDemo('customer')}
                className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
              >
                Customer
              </button>
              <button
                onClick={() => loginAsDemo('admin')}
                className="px-2 py-0.5 rounded bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/50"
              >
                Admin
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 p-4 space-y-3 animate-in fade-in">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('home'); }}
              className="text-left py-1.5 text-sm text-neutral-200"
            >
              Home
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('shop'); }}
              className="text-left py-1.5 text-sm text-neutral-200"
            >
              All Products
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('shop', 'filter=flash'); }}
              className="text-left py-1.5 text-sm text-amber-400"
            >
              Flash Deals ⚡
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenProductFinder(); }}
              className="text-left py-1.5 text-sm text-cyan-400"
            >
              Smart Product Finder ✨
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenSurpriseDeal(); }}
              className="text-left py-1.5 text-sm text-pink-400"
            >
              Daily Mystery Deal 🎁
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('support'); }}
              className="text-left py-1.5 text-sm text-neutral-200"
            >
              Support Center
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('admin'); }}
                className="text-left py-1.5 text-sm text-amber-400 font-semibold"
              >
                Admin Dashboard 🛡️
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
