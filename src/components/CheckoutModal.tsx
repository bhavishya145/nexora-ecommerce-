import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building, 
  Banknote, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Package
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    createOrder,
    setIsOrderTrackerOpen
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Delivery Form State
  const [fullName, setFullName] = useState('Bhavishya Rangarajan');
  const [phone, setPhone] = useState('+91 98401 23456');
  const [street, setStreet] = useState('72 Cyber Horizon Boulevard, Tower 4, Apt 1102');
  const [city, setCity] = useState('Bengaluru Tech Corridor');
  const [postalCode, setPostalCode] = useState('560103');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery'
  >('UPI');
  const [upiId, setUpiId] = useState('bhavishya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9012');
  const [cardHolder, setCardHolder] = useState('BHAVISHYA R');
  const [cardExpiry, setCardExpiry] = useState('08/32');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Execute order creation
      const newOrder = createOrder(
        {
          fullName,
          phone,
          street,
          city,
          postalCode
        },
        paymentMethod
      );
      setConfirmedOrderId(newOrder.id);
      setStep(3);
    }
  };

  const handleTrackCreatedOrder = () => {
    setIsCheckoutOpen(false);
    setIsOrderTrackerOpen(true);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-3xl rounded-3xl glass-panel-elevated border border-white/15 overflow-hidden shadow-2xl bg-[#080B17]/95 text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Step Timeline */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wider">CHECKOUT PORTAL</span>
            <span className="text-cyan-400 text-xs">✦</span>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Glowing 3-Step Horizontal Timeline */}
        <div className="px-6 py-5 bg-[#050711] border-b border-white/10">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            {/* Timeline track line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-white/10 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-violet-500 z-0 transition-all duration-500"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'
              }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 1
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                    : 'glass-panel text-slate-500'
                }`}
              >
                01
              </div>
              <span
                className={`text-[10px] font-bold uppercase mt-1 tracking-wider ${
                  step >= 1 ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                DELIVERY
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 2
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'glass-panel border border-white/10 text-slate-500'
                }`}
              >
                02
              </div>
              <span
                className={`text-[10px] font-bold uppercase mt-1 tracking-wider ${
                  step >= 2 ? 'text-violet-400' : 'text-slate-500'
                }`}
              >
                PAYMENT
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  step === 3
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : 'glass-panel border border-white/10 text-slate-500'
                }`}
              >
                03
              </div>
              <span
                className={`text-[10px] font-bold uppercase mt-1 tracking-wider ${
                  step === 3 ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                CONFIRM
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: DELIVERY */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">01. Delivery Coordinates</h3>
                <span className="text-xs text-cyan-400 font-mono">Autonomous Fleet Dispatch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Recipient Name"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Encrypted Contact (Phone)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    placeholder="+91..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Street & Residence Unit
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Street Address, Building, Suite"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Metropolitan Zone / City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Quantum Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Delivery method guarantee */}
              <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Quantum Express Autonomous Transit</h5>
                    <p className="text-[11px] text-slate-400">Guaranteed 24-48h metropolitan delivery</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase">Free</span>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25"
                >
                  <span>CONTINUE TO PAYMENT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">02. Quantum Payment Gateway</h3>
                <span className="text-xs text-slate-400 font-mono-nums">
                  Payable: <strong className="text-cyan-400 text-sm">₹{(cartTotal + cartDeliveryFee).toLocaleString('en-IN')}</strong>
                </span>
              </div>

              {/* Payment Methods Pill Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'Credit / Debit Card', label: 'Quantum Card', icon: CreditCard },
                  { id: 'Net Banking', label: 'Net Banking', icon: Building },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote }
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl text-left border flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-violet-600/20 border-violet-400 text-white shadow-md shadow-violet-500/20'
                          : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-violet-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Futuristic Holographic Card Preview for Card / UPI */}
              {paymentMethod === 'Credit / Debit Card' && (
                <div className="relative w-full max-w-md mx-auto aspect-[1.58/1] rounded-2xl p-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-purple-900 border border-violet-500/40 shadow-2xl flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-[40px] pointer-events-none" />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-mono font-bold text-violet-300 tracking-widest">
                      NEXORA PLATINUM // 2030
                    </span>
                    <div className="w-8 h-6 rounded-md bg-amber-400/80 border border-amber-300" />
                  </div>

                  <div className="relative z-10">
                    <span className="text-lg sm:text-xl font-mono text-white tracking-widest block font-bold">
                      {cardNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 relative z-10">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Cardholder</span>
                      <span>{cardHolder}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Expires</span>
                      <span>{cardExpiry}</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <label className="text-[11px] font-mono text-slate-400 uppercase block">
                    Virtual Payment Address (UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-[#0D101F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-400 font-mono"
                    placeholder="name@upi"
                  />
                  <p className="text-[11px] text-slate-400">
                    Instant zero-latency payment request will be dispatched to your approved UPI application.
                  </p>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 text-xs text-amber-200">
                  <p className="font-semibold mb-1">Cash on Delivery Selected</p>
                  <p className="text-slate-300">
                    Pay electronically or in cash to the autonomous courier agent upon biometric parcel handoff.
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ← Back to Delivery
                </button>

                <button
                  onClick={handleNextStep}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-400 hover:from-violet-500 hover:to-cyan-300 text-white font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-violet-500/30"
                >
                  <span>AUTHORIZE & PAY</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500">
              {/* Confirmed Glow Animation */}
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-2">
                  TRANSACTION VERIFIED // 2030 LEDGER
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
                  ORDER CONFIRMED ✦
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto font-light">
                  Your acquisition has entered the sub-orbital fulfillment queue. Tamper-evident biometric seal generated.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl glass-panel border border-white/10 text-left space-y-2 text-xs font-mono-nums">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-mono">Order Number:</span>
                  <span className="text-white font-bold">{confirmedOrderId || 'NX-9042'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-mono">Expected Dispatch:</span>
                  <span className="text-cyan-400 font-bold">Tomorrow, by 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-mono">Fulfillment Protocol:</span>
                  <span className="text-slate-200">LiDAR Autonomous Drone</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleTrackCreatedOrder}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Package className="w-4 h-4" />
                  <span>TRACK ORDER ROUTE</span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold"
                >
                  RETURN TO MARKETPLACE
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
