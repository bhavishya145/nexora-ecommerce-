import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  Flame, 
  Compass, 
  Sparkles, 
  Package, 
  SlidersHorizontal 
} from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection }) => {
  const {
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsCommandCenterOpen,
    isAdminMode,
    setIsAdminMode,
    orders,
    setIsOrderTrackerOpen,
    setActiveTrackedOrder
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartItemCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartItemCount]);

  const handleTrackRecentOrder = () => {
    if (orders.length > 0) {
      setActiveTrackedOrder(orders[0]);
      setIsOrderTrackerOpen(true);
    } else {
      setIsCommandCenterOpen(true);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out flex justify-center px-4 sm:px-6 ${
          isScrolled ? 'pt-2.5' : 'pt-5'
        }`}
      >
        <div
          className={`w-full transition-all duration-300 ease-out flex items-center justify-between ${
            isScrolled
              ? 'max-w-4xl py-2 px-5 rounded-2xl glass-panel-elevated border-cyan-500/20 shadow-2xl backdrop-blur-2xl'
              : 'max-w-7xl py-3 px-6 rounded-2xl glass-panel border-white/10 shadow-lg'
          }`}
        >
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onScrollToSection('hero')}
              className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              <span>NEXORA</span>
              <span className="text-cyan-400 text-sm animate-pulse">✦</span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs sm:text-sm font-medium text-slate-300">
            <button
              onClick={() => onScrollToSection('discovery')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Discover</span>
            </button>
            <button
              onClick={() => onScrollToSection('drops')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Drops</span>
            </button>
            <button
              onClick={() => onScrollToSection('curated')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Curated</span>
            </button>
            <button
              onClick={handleTrackRecentOrder}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              <span>Orders</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Wishlist, Cart, Profile, Admin Toggle) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Admin/User Toggle */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isAdminMode
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:border-cyan-500/30'
              }`}
              title={isAdminMode ? 'Switch to Shopper View' : 'Open NEXORA CONTROL (Admin)'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">{isAdminMode ? 'Admin Active' : 'NEXORA Control'}</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => onScrollToSection('discovery')}
              aria-label="Search items"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsCommandCenterOpen(true)}
              aria-label="Saved items"
              className="relative p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
              className={`relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-transform ${
                cartBounce ? 'scale-110' : 'scale-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Cart</span>
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-xs font-bold font-mono-nums">
                {cartItemCount}
              </span>
            </button>

            {/* Profile / Command Center Button */}
            <button
              onClick={() => setIsCommandCenterOpen(true)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 text-xs font-medium"
              title="Open My Command Center"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden xl:inline text-slate-200">Cmd Center</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-40">
        <div className="glass-panel-elevated border-cyan-500/20 rounded-2xl px-4 py-2.5 flex items-center justify-around shadow-2xl backdrop-blur-2xl">
          <button
            onClick={() => onScrollToSection('hero')}
            className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => onScrollToSection('drops')}
            className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Drops</span>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white relative"
          >
            <ShoppingBag className="w-4 h-4 text-purple-400" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={handleTrackRecentOrder}
            className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white"
          >
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Track</span>
          </button>
          <button
            onClick={() => setIsCommandCenterOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white"
          >
            <User className="w-4 h-4 text-violet-400" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};
