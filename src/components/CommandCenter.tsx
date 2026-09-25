import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Package, 
  Heart, 
  Sparkles, 
  MapPin, 
  CreditCard, 
  Settings, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  Zap,
  Award
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    isCommandCenterOpen,
    setIsCommandCenterOpen,
    userProfile,
    orders,
    wishlist,
    products,
    setSelectedProductForModal,
    setActiveTrackedOrder,
    setIsOrderTrackerOpen,
    addToCart,
    setIsAdminMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'wishlist' | 'addresses' | 'payments' | 'settings'
  >('orders');

  if (!isCommandCenterOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const activeDeliveriesCount = orders.filter((o) => o.status !== 'Delivered').length;

  const handleTrackOrder = (order: typeof orders[0]) => {
    setActiveTrackedOrder(order);
    setIsOrderTrackerOpen(true);
  };

  const xpPercentage = Math.round((userProfile.currentXp / userProfile.nextLevelXp) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-5xl rounded-3xl glass-panel-elevated border border-white/15 overflow-hidden shadow-2xl bg-[#080B17]/98 text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/30">
              <div className="w-full h-full rounded-2xl bg-[#080B17] flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  MY COMMAND CENTER
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  {userProfile.tag}
                </span>
              </div>
              <p className="text-xs text-slate-400">{userProfile.email} · {userProfile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsCommandCenterOpen(false);
                setIsAdminMode(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 text-xs font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEXORA Control (Admin)</span>
            </button>

            <button
              onClick={() => setIsCommandCenterOpen(false)}
              className="w-8 h-8 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-white border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Top KPI Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-[#050711] border-b border-white/10 font-mono-nums">
          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Total Orders</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{orders.length}</span>
              <span className="text-[10px] text-emerald-400">100% verified</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Wishlist</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-pink-400">{wishlist.length}</span>
              <span className="text-[10px] text-slate-400">in archive</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Reward Points</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-400">{userProfile.currentXp}</span>
              <span className="text-[10px] text-amber-400/80">XP</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Active Deliveries</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-cyan-400">{activeDeliveriesCount}</span>
              <span className="text-[10px] text-cyan-400/80">In Transit</span>
            </div>
          </div>
        </div>

        {/* NEXORA REWARDS Level Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-950/40 via-[#090C19] to-cyan-950/40 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0 border border-violet-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-violet-400">
                  LEVEL 0{userProfile.level}
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {userProfile.title}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Unlock autonomous priority dispatch at Level 05 (10,000 XP)
              </span>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>XP PROGRESS</span>
              <span className="text-cyan-400 font-bold">
                {userProfile.currentXp.toLocaleString('en-IN')} / {userProfile.nextLevelXp.toLocaleString('en-IN')} XP
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${xpPercentage}%` }}
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="px-6 border-b border-white/10 flex gap-6 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'orders', label: 'MY ORDERS', icon: Package },
            { id: 'wishlist', label: 'WISHLIST', icon: Heart },
            { id: 'addresses', label: 'ADDRESSES', icon: MapPin },
            { id: 'payments', label: 'PAYMENTS', icon: CreditCard },
            { id: 'settings', label: 'ACCOUNT SETTINGS', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">No orders recorded.</div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-sm font-bold text-white font-mono">{ord.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-cyan-500/20 text-cyan-300 animate-pulse'
                          }`}
                        >
                          {ord.status}
                        </span>
                        <span className="text-xs text-slate-500 font-mono-nums">· {ord.date}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-mono-nums">
                          {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} · ₹{ord.total.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-500 text-xs">·</span>
                        <span className="text-xs text-slate-400">via {ord.paymentMethod}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTrackOrder(ord)}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>TRACK ROUTE</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Your wishlist is empty. Tap the heart icon on any product to save it here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsCommandCenterOpen(false);
                        setSelectedProductForModal(p);
                      }}
                      className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-cyan-400/60 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="w-full aspect-square rounded-xl bg-black/40 p-2 flex items-center justify-center mb-3">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase">{p.category}</span>
                        <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                          <span className="text-xs font-bold text-white font-mono-nums">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p, 1);
                            }}
                            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">PRIMARY CITADEL ADDRESS</span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                      DEFAULT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Bhavishya Rangarajan · +91 98401 23456</p>
                  <p className="text-xs text-slate-400 mt-1">
                    72 Cyber Horizon Boulevard, Tower 4, Apt 1102, Bengaluru Tech Corridor, 560103
                  </p>
                </div>
                <button className="text-xs text-cyan-400 font-bold hover:underline">Edit</button>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-8 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 font-mono text-[10px] font-bold">
                    CARD
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">NEXORA Titanium Platinum •••• 9012</p>
                    <p className="text-[11px] text-slate-400">Expires 08/32 · Primary Gateway</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-mono">ACTIVE</span>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase block mb-1">Display Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  readOnly
                  className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 uppercase block mb-1">Neural ID Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  readOnly
                  className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-2">Platform Protocol: NEXORA Engine v2030.4</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
