import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Navigation,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackerModal: React.FC = () => {
  const { 
    isOrderTrackerOpen, 
    setIsOrderTrackerOpen, 
    activeTrackedOrder, 
    updateOrderStatus 
  } = useApp();

  if (!isOrderTrackerOpen || !activeTrackedOrder) return null;

  const order = activeTrackedOrder;

  // The 5 nodes in the glowing delivery route
  const routeNodes = [
    { title: 'WAREHOUSE', subtitle: 'Biometric Encapsulation & Packed', statusKey: 'Placed' },
    { title: 'SORTING HUB', subtitle: 'Automated Micro-Sort Terminal', statusKey: 'Packed' },
    { title: 'IN TRANSIT', subtitle: 'Sub-Orbital Mag-Lev Cargo Line', statusKey: 'Shipped' },
    { title: 'YOUR CITY', subtitle: 'Local Drone Launch Pad Alpha', statusKey: 'Out for Delivery' },
    { title: 'DELIVERED', subtitle: 'Biometric Receptive Safe Deposit', statusKey: 'Delivered' }
  ];

  const currentStep = order.currentStepIndex;

  // Handler to advance or simulate milestones
  const handleAdvanceStep = () => {
    const statuses: OrderStatus[] = [
      'Placed',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered'
    ];
    const nextIdx = (currentStep + 1) % statuses.length;
    updateOrderStatus(order.id, statuses[nextIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-3xl glass-panel-elevated border border-white/15 overflow-hidden shadow-2xl bg-[#080B17]/95 text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  QUANTUM TELEMETRY ROUTE
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 font-mono">
                  {order.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                LiDAR Tracking Protocol · Estimated: {order.estimatedDelivery}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceStep}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
              title="Simulate Next Delivery Milestone"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate Route</span>
            </button>

            <button
              onClick={() => setIsOrderTrackerOpen(false)}
              className="w-8 h-8 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-white border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Glowing Route Visualizer */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-[#090C1B] to-[#060812]">
          
          {/* Status summary pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-cyan-500/20 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Active Phase</span>
                <span className="text-sm font-bold text-cyan-300 uppercase tracking-wide">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono-nums">
              <span>Delivery destination: </span>
              <strong className="text-white">{order.shippingAddress.city}</strong>
            </div>
          </div>

          {/* Interactive Vertical / Horizontal Glowing Route */}
          <div className="relative py-4">
            
            {/* Desktop Horizontal Route Line */}
            <div className="hidden lg:block relative mb-12">
              {/* Back track */}
              <div className="absolute top-1/2 left-6 right-6 h-1 bg-white/10 -translate-y-1/2 rounded-full" />
              
              {/* Active glow track */}
              <div
                className="absolute top-1/2 left-6 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400 -translate-y-1/2 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                style={{
                  width: `${(currentStep / (routeNodes.length - 1)) * 92}%`
                }}
              />

              {/* Glowing Travelling Package Icon */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 z-20"
                style={{
                  left: `calc(1.5rem + ${(currentStep / (routeNodes.length - 1)) * 92}%)`
                }}
              >
                <div className="w-10 h-10 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.8)] border border-white">
                  <Package className="w-5 h-5 animate-bounce" />
                </div>
              </div>

              {/* Node checkpoints */}
              <div className="relative z-10 flex items-center justify-between">
                {routeNodes.map((node, idx) => {
                  const isPassed = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={node.title} className="flex flex-col items-center text-center max-w-[140px]">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/50 scale-110'
                            : isPassed
                            ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                            : 'glass-panel border-white/10 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : `0${idx + 1}`}
                      </div>

                      <span
                        className={`text-xs font-bold uppercase mt-3 tracking-wider ${
                          isCurrent ? 'text-cyan-300' : isPassed ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {node.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-light mt-0.5 line-clamp-2">
                        {node.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile / Compact Vertical Route List */}
            <div className="lg:hidden space-y-6 relative pl-8 border-l-2 border-cyan-500/30 ml-4">
              {routeNodes.map((node, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={node.title} className="relative">
                    {/* Node Dot on left timeline */}
                    <div
                      className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/30 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[#151928] border border-white/20 text-slate-500'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div>
                      <h4
                        className={`text-xs font-bold uppercase ${
                          isCurrent ? 'text-cyan-400' : isPassed ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {node.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-light mt-0.5">
                        {node.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Package manifest items */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
              PARCEL MANIFEST
            </span>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl glass-panel border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1"
                    />
                    <div>
                      <p className="font-bold text-white">{item.productName}</p>
                      <p className="text-slate-400 text-[11px]">
                        Qty: {item.quantity} · Color: {item.color}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-cyan-400 font-bold">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
