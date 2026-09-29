import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Award,
  Share2,
  Lock,
  Flame,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  FileText,
  Trash2,
  Plus
} from 'lucide-react';
import { Order, Address } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEED_LOYALTY_REWARDS } from '../data/seedData';

interface ProfilePageProps {
  initialTab?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ initialTab = 'overview', onNavigate }) => {
  const { user, token, updateProfile, changePassword, claimDailyStreak, logout, setIsAuthModalOpen } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit Profile Form
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [dobInput, setDobInput] = useState('');

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Selected Order for Tracking Modal / Invoice
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      setNameInput(user.name);
      setPhoneInput(user.phone || '');
      setDobInput(user.dateOfBirth || '');
    }
  }, [user]);

  // Load user orders and addresses
  useEffect(() => {
    if (!token) return;
    setLoadingOrders(true);

    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: Order[]) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));

    fetch('/api/addresses', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: Address[]) => setAddresses(data))
      .catch(() => {});
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-neutral-400">
          Please authenticate to view your account dashboard, orders, and rewards.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
        >
          Sign In / Demo Login
        </button>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: nameInput,
      phone: phoneInput,
      dateOfBirth: dobInput
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order and initiate an immediate refund?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'Customer requested cancellation via portal' })
      });
      if (res.ok) {
        const updated: Order = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(updated);
        showToast('Order cancelled and full refund processed', 'success');
      }
    } catch {
      showToast('Failed to cancel order', 'error');
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedReferral(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-800 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-heading">{user.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase">
                {user.tier} Tier
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>{user.rewardPoints} Vault Points</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5" />
                <span>{user.shoppingStreak} Day Streak</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={claimDailyStreak}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 fill-neutral-950" />
            <span>Daily Streak Bonus</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-rose-950/30 hover:border-rose-800 text-neutral-300 hover:text-rose-300 text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: UserIcon },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'loyalty', label: 'Rewards & Vault', icon: Award },
          { id: 'referrals', label: 'Refer Friends ($25)', icon: Share2 },
          { id: 'security', label: 'Security & Access', icon: Lock }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 space-y-2">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Total Purchases</span>
            <div className="text-2xl font-bold text-white font-heading">{orders.length}</div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs text-cyan-400 hover:underline pt-2 inline-block"
            >
              View order tracking →
            </button>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 space-y-2">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Reward Vault Balance</span>
            <div className="text-2xl font-bold text-cyan-400 font-heading">{user.rewardPoints} Pts</div>
            <button
              onClick={() => setActiveTab('loyalty')}
              className="text-xs text-cyan-400 hover:underline pt-2 inline-block"
            >
              Redeem hardware vouchers →
            </button>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 space-y-2">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Referral Earnings</span>
            <div className="text-2xl font-bold text-white font-heading">${(user.rewardPoints > 200 ? 50 : 0)}.00</div>
            <button
              onClick={() => setActiveTab('referrals')}
              className="text-xs text-cyan-400 hover:underline pt-2 inline-block"
            >
              Share your referral link →
            </button>
          </div>

          {/* Quick Profile Editor */}
          <div className="md:col-span-3 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Profile Information</h3>
            <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dobInput}
                  onChange={e => setDobInput(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Orders with Live Tracking Timeline */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="text-center py-12 text-xs text-neutral-400">Loading order records...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-xs text-neutral-500 space-y-2">
              <Package className="w-8 h-8 mx-auto text-neutral-700" />
              <p>No orders on record yet.</p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3 text-xs">
                  <div>
                    <span className="font-bold text-white text-sm font-heading">{order.orderNumber}</span>
                    <span className="text-neutral-500 ml-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold text-sm">${order.grandTotal.toFixed(2)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                          : order.status === 'Cancelled'
                          ? 'bg-rose-950 border border-rose-800 text-rose-300'
                          : 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-950 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                        {item.variantName && (
                          <div className="text-[11px] text-neutral-400">{item.variantName}</div>
                        )}
                        <div className="text-xs text-neutral-400">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Timeline Tracking Component */}
                <div className="pt-4 border-t border-neutral-800/80">
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                    Live Dispatch Progress ({order.carrier})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {order.timeline.map((stepItem, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              stepItem.completed
                                ? 'bg-cyan-500 text-neutral-950'
                                : 'bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {stepItem.completed ? <Check className="w-3 h-3" /> : sIdx + 1}
                          </div>
                          <div
                            className={`h-0.5 flex-1 rounded ${
                              stepItem.completed ? 'bg-cyan-500' : 'bg-neutral-800'
                            }`}
                          />
                        </div>
                        <div className="text-[11px] font-semibold text-neutral-200">
                          {stepItem.status}
                        </div>
                        {stepItem.timestamp && (
                          <div className="text-[10px] text-neutral-500">
                            {new Date(stepItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div className="text-neutral-500">
                    Tracking: <span className="font-mono text-cyan-400">{order.trackingNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-rose-800 hover:bg-rose-950/30 text-rose-400 text-xs font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Print Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Delivery Coordinates</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p className="text-[11px] text-neutral-500">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Loyalty & Vault Rewards */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-cyan-900/60 bg-cyan-950/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  NEXORA Hardware Vault
                </span>
                <h2 className="text-2xl font-bold text-white font-heading mt-1">
                  {user.rewardPoints} Available Points
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Earn 1 point per $1 spent on all lab gear. Review gear for +50 points.
                </p>
              </div>
              <button
                onClick={claimDailyStreak}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors shrink-0"
              >
                Claim Day {user.shoppingStreak} Streak (+50 Pts)
              </button>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Redeem Hardware Vouchers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEED_LOYALTY_REWARDS.map(r => (
              <div key={r.id} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">{r.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{r.description}</p>
                  <span className="text-xs font-semibold text-cyan-400 mt-2 block">
                    {r.pointsCost} Points
                  </span>
                </div>
                <button
                  disabled={user.rewardPoints < r.pointsCost}
                  onClick={() => showToast(`Voucher ${r.couponCode} redeemed! Apply it at checkout.`, 'success')}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 disabled:opacity-40 text-neutral-200 font-bold text-xs transition-colors shrink-0"
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Referrals */}
      {activeTab === 'referrals' && (
        <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/30 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Refer Fellow Engineers & Enthusiasts
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Give your peers $25 off their first order. You receive 150 points ($25 credit) the moment they complete their first lab purchase.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-neutral-500 uppercase font-semibold">Your Unique Referral Code</span>
              <div className="text-lg font-bold text-cyan-400 font-mono tracking-wider">{user.referralCode}</div>
            </div>
            <button
              onClick={copyReferralLink}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReferral ? 'Link Copied!' : 'Copy Invitation Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 6: Security */}
      {activeTab === 'security' && (
        <div className="max-w-md space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Credentials</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">NEXORA INVOICE</h2>
                <p className="text-xs text-neutral-400">Order: {selectedOrder.orderNumber}</p>
                <p className="text-[11px] text-neutral-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              {selectedOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-300">{i.quantity}x {i.name}</span>
                  <span className="text-white font-medium">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs space-y-1 text-neutral-400">
              <div className="flex justify-between"><span>Subtotal:</span><span>${selectedOrder.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Discount:</span><span>-${selectedOrder.discount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Transit Fee:</span><span>${selectedOrder.shippingFee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (8%):</span><span>${selectedOrder.tax.toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm font-bold text-white">
                <span>Grand Total:</span>
                <span className="text-cyan-400">${selectedOrder.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
