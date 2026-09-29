import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Star,
  Clock,
  Flame,
  Shield,
  Gift,
  Award,
  Layers,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEED_CATEGORIES, SEED_BRANDS } from '../data/seedData';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenProductFinder: () => void;
  onOpenSurpriseDeal: () => void;
  onOpenAiAssistant: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenProductFinder,
  onOpenSurpriseDeal,
  onOpenAiAssistant
}) => {
  const { user, claimDailyStreak } = useAuth();
  const { showToast } = useToast();

  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [dealRadar, setDealRadar] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'recommended'>('featured');

  // Flash Sale Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch product sections
  useEffect(() => {
    fetch('/api/products/flash-deals')
      .then(res => res.json())
      .then(data => setFlashDeals(data))
      .catch(() => {});

    fetch('/api/products/deal-radar')
      .then(res => res.json())
      .then(data => setDealRadar(data.slice(0, 4)))
      .catch(() => {});

    fetch('/api/products/featured')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data))
      .catch(() => {});

    fetch('/api/products/trending')
      .then(res => res.json())
      .then(data => setTrendingProducts(data))
      .catch(() => {});

    fetch('/api/products/recommendations')
      .then(res => res.json())
      .then(data => setRecommendedProducts(data))
      .catch(() => {});
  }, []);

  const displayedTabProducts =
    activeTab === 'featured'
      ? featuredProducts
      : activeTab === 'trending'
      ? trendingProducts
      : recommendedProducts;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-neutral-800/80 bg-radial-[at_50%_0%] from-cyan-950/30 via-neutral-950 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Unboxed editorial announcement */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>NEXORA PLATFORM v4.2 · NEXT-GEN SHOPPING ARCHITECTURE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-heading">
                Discover More. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  Shop Smarter.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
                Step into the future of commerce. Explore planar magnetic acoustics, aerospace titanium wearables, autonomous AI robotics, and ergonomic workspace gear curated for high performance.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenProductFinder}
                  className="px-5 py-3.5 rounded-xl border border-neutral-700 hover:border-cyan-500/60 bg-neutral-900/60 hover:bg-neutral-800 text-white font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Launch Smart Match Quiz</span>
                </button>

                <button
                  onClick={onOpenSurpriseDeal}
                  className="px-5 py-3.5 rounded-xl border border-pink-900/50 hover:border-pink-500/60 bg-pink-950/20 hover:bg-pink-950/40 text-pink-300 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Gift className="w-4 h-4 text-pink-400" />
                  <span>Daily Mystery Deal</span>
                </button>
              </div>

              {/* Stats Highlights */}
              <div className="pt-6 border-t border-neutral-800/80 flex items-center gap-6 sm:gap-10 text-xs text-neutral-400">
                <div>
                  <div className="text-lg font-bold text-white font-heading">50+</div>
                  <div className="text-[11px] text-neutral-500">Lab-Certified Tech</div>
                </div>
                <div className="w-px h-8 bg-neutral-800" />
                <div>
                  <div className="text-lg font-bold text-white font-heading">4.9★</div>
                  <div className="text-[11px] text-neutral-500">Verified Rating</div>
                </div>
                <div className="w-px h-8 bg-neutral-800" />
                <div>
                  <div className="text-lg font-bold text-white font-heading">2-Hr</div>
                  <div className="text-[11px] text-neutral-500">Autonomous Drone Courier</div>
                </div>
              </div>
            </div>

            {/* Right Hero Product Spotlight */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl shadow-2xl overflow-hidden group">
                {/* Glow ring */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                  <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" /> Spotlight Hardware
                  </span>
                  <span>Aetherion Labs</span>
                </div>

                <div
                  onClick={() => onNavigate('product', 'aetherion-spatial-pro-x9')}
                  className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 relative cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                    alt="Aetherion Spatial Pro X9"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-cyan-500 text-neutral-950 text-xs font-bold px-2 py-0.5 rounded-md">
                    -19% OFF
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3
                      onClick={() => onNavigate('product', 'aetherion-spatial-pro-x9')}
                      className="text-base font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors"
                    >
                      Aetherion Spatial Pro X9
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      48-hr Planar Magnetic Sound with 360° IMU Tracking
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-cyan-400 font-heading">$349.99</div>
                    <div className="text-xs text-neutral-500 line-through">$429.99</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Login Shopping Streak Incentive */}
      {user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-5 rounded-2xl border border-cyan-900/60 bg-gradient-to-r from-cyan-950/40 via-neutral-900/60 to-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Daily Shopping Streak: Day {user.shoppingStreak || 1} 🔥
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Log in daily to stack multipliers on reward points and secret hardware vouchers.
                </p>
              </div>
            </div>
            <button
              onClick={claimDailyStreak}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs whitespace-nowrap transition-colors"
            >
              Claim Today's Bonus
            </button>
          </div>
        </section>
      )}

      {/* Flash Sales with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl border border-amber-900/40 bg-gradient-to-b from-amber-950/20 via-neutral-950 to-neutral-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-amber-400" />
                <span>Limited Stock Flash Sale</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-heading mt-1">
                Hyper-Velocity Flash Deals
              </h2>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-2xl">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-neutral-400 font-medium">Ends in:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-white text-xs">
                <span className="bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-neutral-950 px-2 py-1 rounded border border-neutral-800 text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashDeals.slice(0, 4).map(deal => (
              <ProductCard key={deal.id} product={deal} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Departments
            </span>
            <h2 className="text-2xl font-bold text-white font-heading mt-1">
              Explore by Architecture
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs text-neutral-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {SEED_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate('shop', `category=${cat.slug}`)}
              className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900 hover:border-cyan-500/50 text-left transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Deal Radar: Steepest Discounts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEXORA Deal Radar</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-heading mt-1">
                Highest Algorithmic Price Drops
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', 'filter=radar')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Explore Full Radar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealRadar.map(prod => (
              <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Tabbed Showcase: Featured / Trending / Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Curated Feed
            </span>
            <h2 className="text-2xl font-bold text-white font-heading mt-1">
              Engineered For Excellence
            </h2>
          </div>

          {/* Clean segmented controls */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'featured'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'trending'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Trending Gear
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'recommended'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Recommended for You
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedTabProducts.map(p => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Brand Partners Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Direct Lab Alliances
          </span>
          <h2 className="text-2xl font-bold text-white font-heading mt-1">
            Engineered By Industry Pioneers
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SEED_BRANDS.map(brand => (
            <button
              key={brand.id}
              onClick={() => onNavigate('shop', `brand=${encodeURIComponent(brand.name)}`)}
              className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700 text-center transition-all group"
            >
              <div className="text-sm font-bold text-white group-hover:text-cyan-400 font-heading">
                {brand.name}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                {brand.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-neutral-800 bg-neutral-900/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Owner Experiences
              </span>
              <h2 className="text-2xl font-bold text-white font-heading mt-1">
                Verified Lab Testimonials
              </h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9 / 5.0 Average Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Aris Thorne',
                role: 'Bio-Acoustics Researcher',
                text: 'The Aetherion Pro X9 planar drivers delivered laboratory-grade frequency response right out of the box. Delivery by SkyRoute autonomous drone arrived in 75 minutes.',
                gear: 'Aetherion Spatial Pro X9'
              },
              {
                name: 'Maya Lin',
                role: 'Principal Software Engineer',
                text: 'The Kinesis Form Split keyboard cured my repetitive wrist strain within three days of typing. The magnetic hall-effect key switches are an absolute joy.',
                gear: 'Kinesis Form Split Keyboard'
              },
              {
                name: 'Captain Sean Ross',
                role: 'Alpine Expedition Guide',
                text: 'ZeroVolt SuperStation ran our sub-zero basecamp radio gear for four straight nights at 11,000 feet. Uncompromising battery engineering.',
                gear: 'ZeroVolt Quantum Solar 1200W'
              }
            ].map((t, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-950 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-[11px] text-neutral-500">{t.role}</div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-medium">{t.gear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
