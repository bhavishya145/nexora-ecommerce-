import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, ArrowRight, Zap, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for your 10% welcome coupon code WELCOME10', 'success');
  };

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-100">Autonomous Logistics</h4>
                <p className="text-[11px] text-neutral-400">Drone & express couriers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-100">Verified Direct Sourcing</h4>
                <p className="text-[11px] text-neutral-400">100% genuine lab hardware</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-100">30-Day Precision Trial</h4>
                <p className="text-[11px] text-neutral-400">Zero-hassle instant refunds</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-100">Eco-Score Verified</h4>
                <p className="text-[11px] text-neutral-400">Carbon-neutral packaging</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-white font-extrabold text-base font-heading">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">NEXORA</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              NEXORA is a premier intelligent shopping engine bridging cutting-edge acoustics, autonomous robotics, biometric wearables, and sustainable everyday carry.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-neutral-300 block mb-2">Subscribe to Tech Dispatches</span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-2 rounded-xl">
                  <Check className="w-4 h-4" />
                  <span>Subscribed! Use code WELCOME10 for 10% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Departments
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('shop', 'category=neural-audio')} className="hover:text-cyan-400 transition-colors">
                  Neural & Audio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'category=smart-wearables')} className="hover:text-cyan-400 transition-colors">
                  Smart Wearables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'category=workstations')} className="hover:text-cyan-400 transition-colors">
                  Ergonomic Workstations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'category=cyber-edc')} className="hover:text-cyan-400 transition-colors">
                  Cyber & Modular EDC
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'category=drones-robotics')} className="hover:text-cyan-400 transition-colors">
                  Drones & Robotics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'category=clean-energy')} className="hover:text-cyan-400 transition-colors">
                  Clean Energy & Power
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligent Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Intelligent Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('shop', 'filter=flash')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Flash Sales Radar</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'filter=radar')} className="hover:text-cyan-400 transition-colors">
                  Deep Discount Radar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile', 'loyalty')} className="hover:text-cyan-400 transition-colors">
                  Vault Points & Streaks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile', 'referrals')} className="hover:text-cyan-400 transition-colors">
                  Referral Program ($25/friend)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-cyan-400 transition-colors">
                  Price Drop Watchlist
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Concierge Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-cyan-400 transition-colors">
                  Support Center & FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile', 'orders')} className="hover:text-cyan-400 transition-colors">
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', 'returns')} className="hover:text-cyan-400 transition-colors">
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', 'warranty')} className="hover:text-cyan-400 transition-colors">
                  2-Year Lab Warranty
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', 'contact')} className="hover:text-cyan-400 transition-colors">
                  Submit Support Ticket
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © 2026 NEXORA Intelligent Commerce Inc. All rights reserved. "Discover More. Shop Smarter."
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Encrypted with 256-Bit SSL</span>
            <span>·</span>
            <span className="text-neutral-400">PCI-DSS Compliant</span>
            <span>·</span>
            <span className="text-neutral-400">Carbon Neutral Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
