import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Scale,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  BellRing,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Product, ProductVariant, Review, ProductQuestion } from '../types';
import { SEED_PRODUCTS } from '../data/seedData';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ProductDetailPageProps {
  productIdOrSlug: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productIdOrSlug,
  onNavigate
}) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { user, setIsAuthModalOpen } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Reviews & Q&A
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'qa' | 'shipping'>('specs');

  // Modals for Price Alert, Review, and Question
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionInput, setQuestionInput] = useState('');

  // Fetch product data
  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      let loadedProduct: Product | null = null;

      try {
        const res = await fetch(`/api/products/${productIdOrSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.product) {
            loadedProduct = data.product;
            setProduct(data.product);
            setRelated(data.related || []);
            setFrequentlyBought(data.frequentlyBought || []);
            setSelectedImage(data.product.images[0]);
            if (data.product.variants && data.product.variants.length > 0) {
              setSelectedVariant(data.product.variants[0]);
            }

            // Fetch reviews and questions
            try {
              const revRes = await fetch(`/api/products/${data.product.id}/reviews`);
              if (revRes.ok) setReviews(await revRes.json());
              const qRes = await fetch(`/api/products/${data.product.id}/questions`);
              if (qRes.ok) setQuestions(await qRes.json());
            } catch {
              // Non-blocking
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load product detail from API, checking local seed database:', err);
      }

      if (!loadedProduct) {
        const found = SEED_PRODUCTS.find(p => p.id === productIdOrSlug || p.slug === productIdOrSlug);
        if (found) {
          setProduct(found);
          setSelectedImage(found.images[0]);
          if (found.variants && found.variants.length > 0) {
            setSelectedVariant(found.variants[0]);
          }
          setRelated(SEED_PRODUCTS.filter(p => p.id !== found.id && (p.category === found.category || p.department === found.department)).slice(0, 4));
          setFrequentlyBought(SEED_PRODUCTS.filter(p => p.id !== found.id && p.brand === found.brand).slice(0, 2));
        }
      }

      setLoading(false);
    }
    loadProductData();
  }, [productIdOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-400">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs">Calibrating holographic product telemetry...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Hardware Not Found</h2>
        <p className="text-xs text-neutral-400">The requested specification has been deprecated or relocated.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const currentPrice = selectedVariant
    ? product.price + selectedVariant.priceModifier
    : product.price;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  const handleSubscribePriceAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/products/${product.id}/price-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({ targetPrice: parseFloat(targetPriceInput) || product.price * 0.85 })
      });
      if (res.ok) {
        showToast('Subscribed to price drop alert!', 'success');
        setIsPriceAlertOpen(false);
      }
    } catch {
      showToast('Failed to subscribe alert', 'error');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment
        })
      });
      if (res.ok) {
        const newRev = await res.json();
        setReviews(prev => [newRev, ...prev]);
        showToast('Review submitted! +50 reward points earned.', 'success');
        setIsReviewModalOpen(false);
        setReviewComment('');
        setReviewTitle('');
      }
    } catch {
      showToast('Failed to submit review', 'error');
    }
  };

  const handleVoteHelpful = async (revId: string) => {
    try {
      const res = await fetch(`/api/reviews/${revId}/helpful`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setReviews(prev => prev.map(r => r.id === revId ? updated : r));
        showToast('Helpful vote recorded', 'info');
      }
    } catch {
      // silent
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/products/${product.id}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({ question: questionInput })
      });
      if (res.ok) {
        const newQ = await res.json();
        setQuestions(prev => [...prev, newQ]);
        showToast('Question submitted to NEXORA engineering team!', 'success');
        setIsQuestionModalOpen(false);
        setQuestionInput('');
      }
    } catch {
      showToast('Failed to submit question', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-400">
        <button onClick={() => onNavigate('home')} className="hover:text-white">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
        <button onClick={() => onNavigate('shop')} className="hover:text-white">Catalog</button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
        <button onClick={() => onNavigate('shop', `category=${product.categorySlug}`)} className="hover:text-white truncate">
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-neutral-200 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl border border-neutral-800 bg-neutral-950 overflow-hidden relative group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-cyan-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-lg">
                -{product.discountPercentage}% LIMITED OFFER
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl border overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="text-cyan-400 font-semibold">{product.brand}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>SKU: {product.sku}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-emerald-400">Eco-Score {product.sustainability.ecoScore}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-tight">
            {product.name}
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {product.tagline}
          </p>

          {/* Ratings & Reviews summary */}
          <div className="flex items-center gap-4 text-xs border-y border-neutral-800/80 py-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <button
              onClick={() => setActiveTab('reviews')}
              className="text-neutral-400 hover:text-cyan-400 transition-colors underline"
            >
              {product.reviewCount} Verified Lab Reviews
            </button>
            <span className="text-neutral-600">·</span>
            <button
              onClick={() => setActiveTab('qa')}
              className="text-neutral-400 hover:text-cyan-400 transition-colors"
            >
              {questions.length} Community Q&A
            </button>
          </div>

          {/* Pricing Display */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-heading">
              ${currentPrice.toFixed(2)}
            </span>
            {product.originalPrice > currentPrice && (
              <span className="text-base text-neutral-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-semibold">
              Save ${(product.originalPrice - currentPrice).toFixed(2)}
            </span>
          </div>

          {/* Stock Meter */}
          <div className="p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Availability</span>
              {isOutOfStock ? (
                <span className="text-rose-400 font-semibold">Temporarily Out of Stock</span>
              ) : currentStock <= 15 ? (
                <span className="text-amber-400 font-semibold">Only {currentStock} units remaining!</span>
              ) : (
                <span className="text-emerald-400 font-semibold">In Stock · Ready for Drone Courier</span>
              )}
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isOutOfStock
                    ? 'bg-rose-500'
                    : currentStock <= 15
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (currentStock / 50) * 100)}%` }}
              />
            </div>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 block">
                Select Configuration / Variant
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.image) setSelectedImage(v.image);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVariant?.id === v.id
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{v.name}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {v.priceModifier > 0 ? `+$${v.priceModifier}` : 'Standard price'} · {v.stock} left
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(currentStock, prev + 1))}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                disabled={isOutOfStock}
                onClick={() => addItem(product, selectedVariant, quantity)}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                title="Save to Wishlist"
                className={`p-3.5 rounded-xl border transition-colors ${
                  isFavorited
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              {/* Compare */}
              <button
                onClick={() => addToCompare(product)}
                title="Compare Specifications"
                className={`p-3.5 rounded-xl border transition-colors ${
                  isCompared
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Scale className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                title="Share Product"
                className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Price Alert and Back-In-Stock Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsPriceAlertOpen(true)}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Notify me if price drops</span>
              </button>
            </div>
          </div>

          {/* Guarantees & Seller info */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="font-semibold text-neutral-200">Express Delivery</div>
                <div className="text-[11px]">Dispatches in 24 hours</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="font-semibold text-neutral-200">Official Direct Warranty</div>
                <div className="text-[11px]">2-Year complete lab coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Reviews, Q&A */}
      <div className="border-t border-neutral-800 pt-8 space-y-6">
        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'reviews', label: `Verified Reviews (${reviews.length})` },
            { id: 'qa', label: `Questions & Answers (${questions.length})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === t.id
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specs */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
              {product.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.specifications.map((specGroup, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
                    {specGroup.group}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {specGroup.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between py-1 border-b border-neutral-800/60">
                        <span className="text-neutral-400">{item.label}</span>
                        <span className="text-neutral-200 font-medium text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Verified Customer Feedback</h3>
                <p className="text-xs text-neutral-400">Only verified buyers who completed orders can submit ratings.</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
              >
                Write a Verified Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={rev.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">{rev.userName}</div>
                        {rev.verifiedPurchase && (
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified Purchase
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-neutral-200">{rev.title}</h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] text-neutral-500">
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleVoteHelpful(rev.id)}
                      className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Community & Engineer Q&A</h3>
                <p className="text-xs text-neutral-400">Technical questions answered by NEXORA technicians and verified owners.</p>
              </div>
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
              >
                Ask a Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map(q => (
                <div key={q.id} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">{q.question}</h5>
                      <span className="text-[10px] text-neutral-500">Asked by {q.userName} · {new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {q.answers.length > 0 ? (
                    <div className="pl-6 space-y-2 border-l border-neutral-800">
                      {q.answers.map(ans => (
                        <div key={ans.id} className="text-xs text-neutral-300">
                          <p className="leading-relaxed">{ans.answer}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500">
                            {ans.isAdmin && (
                              <span className="text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                                Verified NEXORA Specialist
                              </span>
                            )}
                            <span>{ans.userName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pl-6 text-xs text-neutral-500 italic">No answers yet. Our lab engineers typically reply within 4 hours.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Frequently Bought Together & Related */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-heading">
              Frequently Paired With This Model
            </h3>
            <button
              onClick={() => onNavigate('shop', `category=${product.categorySlug}`)}
              className="text-xs text-cyan-400 hover:underline"
            >
              Browse Category
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* Price Alert Modal */}
      {isPriceAlertOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Subscribe to Price Drop</h4>
            <p className="text-xs text-neutral-400">
              Enter your target budget. We will trigger an immediate push alert and notification if the price drops.
            </p>
            <form onSubmit={handleSubscribePriceAlert} className="space-y-3">
              <input
                type="number"
                step="0.01"
                placeholder={`e.g. $${(product.price * 0.85).toFixed(2)}`}
                value={targetPriceInput}
                onChange={e => setTargetPriceInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPriceAlertOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 text-neutral-950 font-bold text-xs"
                >
                  Confirm Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-base font-bold text-white">Write a Verified Review</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unbelievable planar clarity and comfort"
                  value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Experience Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your experience with acoustics, build quality, ergonomics..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
                >
                  Post Review (+50 Pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-base font-bold text-white">Ask an Engineering Question</h4>
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Ask about compatibility, driver specs, battery replacements..."
                value={questionInput}
                onChange={e => setQuestionInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
