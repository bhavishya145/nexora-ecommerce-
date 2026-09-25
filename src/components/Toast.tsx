import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, ShoppingBag, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass-panel-elevated border border-cyan-500/30 text-sm shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300"
        >
          {toast.type === 'success' && (
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'cart' && (
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <span className="text-slate-100 font-medium text-xs sm:text-sm tracking-wide flex-1">
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  );
};
