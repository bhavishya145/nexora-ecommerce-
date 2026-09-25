import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  Activity, 
  Layers, 
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProductCategory, Product, OrderStatus } from '../types';

export const AdminControl: React.FC = () => {
  const {
    products,
    addProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    setIsAdminMode
  } = useApp();

  const [adminTab, setAdminTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('TECH');
  const [newPrice, setNewPrice] = useState(29999);
  const [newTagline, setNewTagline] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProduct({
      name: newTitle,
      tagline: newTagline || 'Futuristic high-performance cybernetic hardware',
      category: newCategory,
      price: Number(newPrice),
      originalPrice: Math.round(Number(newPrice) * 1.25),
      discountPercentage: 20,
      rating: 5.0,
      reviewsCount: 1,
      image: products[0].image, // reuse authentic generated image
      badge: 'NEW',
      colors: [{ name: 'Obsidian Black', hex: '#0A0A0F' }],
      specs: [
        { label: 'Architecture', value: 'Quantum RISC-X 2030' },
        { label: 'Enclosure', value: 'Grade 5 Titanium' }
      ],
      description: 'Engineered for exceptional futuristic performance.',
      features: ['Quantum synchronicity', 'Ultra-low thermal dissipation']
    });

    setNewTitle('');
    setNewTagline('');
    setShowAddProductModal(false);
  };

  // 7-day revenue pulse chart data
  const revenuePoints = [
    { day: 'Mon', val: 120, label: '₹1.2L' },
    { day: 'Tue', val: 185, label: '₹1.85L' },
    { day: 'Wed', val: 145, label: '₹1.45L' },
    { day: 'Thu', val: 230, label: '₹2.3L' },
    { day: 'Fri', val: 290, label: '₹2.9L' },
    { day: 'Sat', val: 340, label: '₹3.4L' },
    { day: 'Sun', val: 410, label: '₹4.1L' }
  ];

  const maxVal = 450;

  return (
    <div className="min-h-screen bg-[#05060C] text-slate-100 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-rose-500/30 mb-8 bg-gradient-to-r from-rose-950/20 via-[#0A0D1B] to-cyan-950/20 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                NEXORA CONTROL
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 font-mono">
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live telemetry, algorithmic demand forecasting, and inventory governance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdminMode(false)}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 text-xs font-bold transition-colors"
        >
          Exit to Shopper View →
        </button>
      </div>

      {/* 4 Core Metric KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 font-mono-nums">
        
        {/* Metric 1: TOTAL REVENUE */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              TOTAL REVENUE
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">₹12.8L</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">vs. previous lunar cycle</p>
        </div>

        {/* Metric 2: ORDERS */}
        <div className="p-6 rounded-3xl glass-panel border border-violet-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              ORDERS
            </span>
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">4,892</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">99.4% autonomous completion</p>
        </div>

        {/* Metric 3: CUSTOMERS */}
        <div className="p-6 rounded-3xl glass-panel border border-pink-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              CUSTOMERS
            </span>
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">18,420</span>
            <span className="text-xs text-cyan-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +320 today
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active neural shoppers</p>
        </div>

        {/* Metric 4: PRODUCTS */}
        <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              PRODUCTS
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">1,284</span>
            <span className="text-xs text-slate-400 font-bold">In Active Ledger</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{products.length} catalog items live</p>
        </div>

      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 mb-8 pb-3">
        <div className="flex items-center gap-3">
          {[
            { id: 'analytics', label: 'ANALYTICS & PULSE', icon: Activity },
            { id: 'products', label: 'PRODUCT CATALOG', icon: Package },
            { id: 'orders', label: 'ORDER MANAGEMENT', icon: ShoppingBag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md'
                    : 'glass-panel text-slate-400 hover:text-white border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {adminTab === 'products' && (
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* TAB 1: ANALYTICS */}
      {adminTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Revenue Pulse Interactive Chart */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">REVENUE PULSE</h3>
                <p className="text-xs text-slate-400">Weekly transactional volume through smart nodes</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Real-time Stream</span>
              </div>
            </div>

            {/* Glowing SVG Chart */}
            <div className="h-64 w-full relative flex items-end justify-between gap-2 sm:gap-6 pt-6">
              {revenuePoints.map((pt) => {
                const heightPercent = (pt.val / maxVal) * 100;
                return (
                  <div key={pt.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2 py-1 rounded bg-[#101428] border border-cyan-400/50 text-[10px] font-mono text-cyan-300 font-bold shadow-lg">
                      {pt.label}
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[48px] bg-white/5 rounded-t-xl overflow-hidden relative group-hover:bg-white/10 transition-colors h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-cyan-600 via-indigo-500 to-rose-500 rounded-t-xl group-hover:brightness-125 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      />
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 mt-2 font-bold">{pt.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary analytics: Order Flow & Customer Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl glass-panel border border-white/10">
              <h4 className="text-sm font-bold text-white mb-4">ORDER FLOW BY CATEGORY</h4>
              <div className="space-y-3 font-mono-nums text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>TECH & AUDIO</span>
                    <span className="text-cyan-400 font-bold">42%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[42%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>GAMING HARDWARE</span>
                    <span className="text-purple-400 font-bold">28%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-purple-400 w-[28%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>FASHION & WEARABLES</span>
                    <span className="text-pink-400 font-bold">18%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-pink-400 w-[18%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>HOME & AMBIENT</span>
                    <span className="text-amber-400 font-bold">12%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-400 w-[12%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-panel border border-white/10">
              <h4 className="text-sm font-bold text-white mb-4">LOGISTICS PERFORMANCE</h4>
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-300">Average Drone Transit</span>
                  <span className="font-mono text-emerald-400 font-bold">34 minutes</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-300">Biometric Seal Verification</span>
                  <span className="font-mono text-cyan-400 font-bold">100% Pass</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-300">Return Rate</span>
                  <span className="font-mono text-slate-400 font-bold">0.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {adminTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="overflow-x-auto rounded-2xl glass-panel border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090C19] text-slate-400 border-b border-white/10 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono-nums">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1" />
                      <div>
                        <p className="font-bold text-white font-sans">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-sans truncate max-w-xs">{p.tagline}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono text-[10px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-amber-400">
                      ★ {p.rating}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {adminTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="overflow-x-auto rounded-2xl glass-panel border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090C19] text-slate-400 border-b border-white/10 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono-nums">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      {ord.id}
                      <span className="block text-[10px] text-slate-400 font-normal">{ord.date}</span>
                    </td>
                    <td className="p-4 font-sans text-slate-300">
                      {ord.shippingAddress.fullName}
                      <span className="block text-[10px] text-slate-400">{ord.shippingAddress.city}</span>
                    </td>
                    <td className="p-4 font-bold text-cyan-400">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#0F1428] border border-white/20 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add New Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel-elevated border border-white/20 p-6 bg-[#090C19] text-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm">Add New Product to Ledger</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Neo-Graphene Core 9"
                  className="w-full bg-[#12162A] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full bg-[#12162A] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="TECH">TECH</option>
                  <option value="FASHION">FASHION</option>
                  <option value="GAMING">GAMING</option>
                  <option value="HOME">HOME</option>
                  <option value="BEAUTY">BEAUTY</option>
                  <option value="FITNESS">FITNESS</option>
                  <option value="ACCESSORIES">ACCESSORIES</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full bg-[#12162A] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Tagline</label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="Futuristic description..."
                  className="w-full bg-[#12162A] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
