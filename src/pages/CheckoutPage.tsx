import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Zap,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Address, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface CheckoutPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    items,
    subtotal,
    discount,
    appliedCoupon,
    clearCart
  } = useCart();
  const { user, token, setIsAuthModalOpen } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'drone'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod' | 'wallet'>('card');

  // New Address Form
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newFullName, setNewFullName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [newStreet, setNewStreet] = useState('800 Silicon Vista Blvd, Suite 210');
  const [newCity, setNewCity] = useState('San Francisco');
  const [newState, setNewState] = useState('CA');
  const [newPostalCode, setNewPostalCode] = useState('94107');

  // Payment Form (Sandbox)
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Delivery fee calculation
  const deliveryFee =
    deliveryMethod === 'drone' ? 25.0 : deliveryMethod === 'express' ? 15.0 : 0.0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.08).toFixed(2));
  const finalGrandTotal = Number((taxableAmount + deliveryFee + tax).toFixed(2));

  // Load user addresses
  useEffect(() => {
    if (token) {
      fetch('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then((data: Address[]) => {
          setAddresses(data);
          const def = data.find(a => a.isDefault) || data[0];
          if (def) setSelectedAddressId(def.id);
        })
        .catch(() => {});
    }
  }, [token]);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: newFullName,
          phone: newPhone,
          street: newStreet,
          city: newCity,
          state: newState,
          postalCode: newPostalCode,
          country: 'United States',
          isDefault: true,
          type: 'home'
        })
      });
      if (res.ok) {
        const addr: Address = await res.json();
        setAddresses(prev => [...prev, addr]);
        setSelectedAddressId(addr.id);
        setIsAddingNewAddress(false);
        showToast('Address saved', 'success');
      }
    } catch {
      showToast('Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !token) {
      showToast('Please sign in to complete checkout', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    const selectedAddr = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddr) {
      showToast('Please select or add a shipping address', 'error');
      setStep(1);
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          shippingAddress: selectedAddr,
          deliveryMethod,
          paymentMethod,
          subtotal,
          discount,
          couponCode: appliedCoupon?.code,
          shippingFee: deliveryFee,
          tax,
          grandTotal: finalGrandTotal
        })
      });

      const orderData = await res.json();
      if (!res.ok) {
        showToast(orderData.error || 'Failed to place order', 'error');
        setIsProcessing(false);
        return;
      }

      setCreatedOrder(orderData);
      clearCart();
      setStep(4);

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch {
      showToast('Network error processing checkout', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your cart is currently empty</h2>
        <p className="text-xs text-neutral-400">Add instruments from the catalog before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Progress Stepper */}
      {step < 4 && (
        <div className="border-b border-neutral-800 pb-6">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[
              { num: 1, label: 'Shipping Address' },
              { num: 2, label: 'Courier Dispatch' },
              { num: 3, label: 'Encrypted Payment' }
            ].map(s => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s.num
                      ? 'bg-cyan-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-medium ${step >= s.num ? 'text-white' : 'text-neutral-500'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Address Selection */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  1. Delivery Destination
                </h2>
                <p className="text-xs text-neutral-400">
                  Select a saved location or specify new delivery coordinates.
                </p>
              </div>
              {!isAddingNewAddress && (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-cyan-500 text-xs text-neutral-200"
                >
                  + Add Address
                </button>
              )}
            </div>

            {isAddingNewAddress ? (
              <form onSubmit={handleAddNewAddress} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">New Location</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={e => setNewFullName(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={e => setNewStreet(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={e => setNewState(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newPostalCode}
                      onChange={e => setNewPostalCode(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-3 py-1.5 text-xs text-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
                  >
                    Save & Select
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <label
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-cyan-950/30 border-cyan-500'
                        : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                            Default
                          </span>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="addressRadio"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="text-cyan-500 focus:ring-0"
                      />
                    </div>
                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">Phone: {addr.phone}</p>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                disabled={!selectedAddressId}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-40"
              >
                <span>Continue to Dispatch Options</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Overview</h3>
            <div className="space-y-2 text-xs">
              {items.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span className="text-neutral-400 truncate max-w-[160px]">
                    {i.quantity}x {i.name}
                  </span>
                  <span className="text-white font-medium">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-neutral-800/80 space-y-1.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Delivery Method */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                2. Select Courier Velocity
              </h2>
              <p className="text-xs text-neutral-400">
                Choose the transit protocol that matches your timeline requirements.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'drone',
                  title: 'SkyRoute Autonomous Drone Courier',
                  desc: 'Precision rooftop or lawn descent with GPS optical beacon verification. Dispatches in 2 hours.',
                  cost: 25.0,
                  time: 'Today (Within 2 Hours)',
                  icon: Zap,
                  tag: 'Futuristic'
                },
                {
                  id: 'express',
                  title: 'Nexora HyperFleet Priority Courier',
                  desc: 'Temperature-controlled shockproof ground transport with live millimeter telemetry.',
                  cost: 15.0,
                  time: '1 - 2 Business Days',
                  icon: Truck,
                  tag: 'Popular'
                },
                {
                  id: 'standard',
                  title: 'Eco-Carbon Neutral Ground Service',
                  desc: 'Consolidated eco-fulfillment minimizing transport carbon emissions.',
                  cost: 0.0,
                  time: '3 - 4 Business Days',
                  icon: ShieldCheck,
                  tag: 'Eco-Friendly'
                }
              ].map(opt => (
                <label
                  key={opt.id}
                  onClick={() => setDeliveryMethod(opt.id as any)}
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === opt.id
                      ? 'bg-cyan-950/30 border-cyan-500'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <opt.icon className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{opt.title}</span>
                          <span className="text-[10px] text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                            {opt.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-xs font-bold text-cyan-400">
                        {opt.cost === 0 ? 'FREE' : `$${opt.cost.toFixed(2)}`}
                      </div>
                      <div className="text-[10px] text-neutral-500">{opt.time}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Estimated Total</h3>
            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transit Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                <span>Final Grand Total</span>
                <span className="text-cyan-400">${finalGrandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment Sandbox */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                3. Secure Payment Gateway
              </h2>
              <p className="text-xs text-neutral-400">
                Encrypted via 256-Bit SSL tokenization. Test cards are pre-authorized in developer mode.
              </p>
            </div>

            {/* Payment Methods Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'card', label: 'Credit Card' },
                { id: 'upi', label: 'UPI / Scan' },
                { id: 'netbanking', label: 'Net Banking' },
                { id: 'wallet', label: 'NEXORA Wallet' },
                { id: 'cod', label: 'Cash on Delivery' }
              ].map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === pm.id
                      ? 'bg-cyan-950/50 border-cyan-500 text-white'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>

            {/* Simulated Card Form */}
            {paymentMethod === 'card' && (
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Card Credentials (Sandbox Enabled)
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-neutral-400 font-semibold px-2 py-0.5 rounded bg-neutral-800">
                      VISA / MC
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="p-5 rounded-2xl border border-cyan-800 bg-cyan-950/20 text-xs space-y-2">
                <div className="font-bold text-cyan-300">NEXORA Reward Vault Credit</div>
                <p className="text-neutral-400">
                  You have {user?.rewardPoints || 0} Reward Points available. $1.00 credit = 20 points.
                </p>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-center space-y-2">
                <div className="text-xs font-bold text-white">Instant UPI Verification</div>
                <p className="text-xs text-neutral-400">
                  A simulated push approval notification will be dispatched to your authorized device.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Authorizing Payment...' : `Authorize $${finalGrandTotal.toFixed(2)}`}</span>
              </button>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Final Order Cost</h3>
            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Voucher Savings</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Protocol</span>
                <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-base font-bold text-white">
                <span>Grand Total</span>
                <span className="text-cyan-400 font-heading">${finalGrandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Order Confirmation Celebration */}
      {step === 4 && createdOrder && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-cyan-800/60 bg-neutral-900/60 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto text-neutral-950 shadow-xl shadow-cyan-500/25">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PAYMENT AUTHORIZED & INVENTORY LOCKED</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">
              Order Confirmed: {createdOrder.orderNumber}
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              Thank you for shopping with NEXORA. Your package is currently being assembled with automated precision.
            </p>
          </div>

          {/* Tracking info card */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Courier Network:</span>
              <span className="text-white font-semibold">{createdOrder.carrier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Tracking Reference:</span>
              <span className="text-cyan-400 font-mono font-bold">{createdOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Estimated Arrival:</span>
              <span className="text-neutral-200">{new Date(createdOrder.estimatedDelivery).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-neutral-800">
              <span className="text-neutral-400">Grand Total Paid:</span>
              <span className="text-white font-bold">${createdOrder.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('profile', 'orders')}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Live Tracking Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
