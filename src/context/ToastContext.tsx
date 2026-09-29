import React, { createContext, useContext, useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
        {toasts.map(toast => {
          let bg = 'bg-neutral-900 border-neutral-700 text-neutral-100';
          let indicator = 'bg-cyan-500';
          if (toast.type === 'error') {
            bg = 'bg-rose-950/90 border-rose-800 text-rose-100';
            indicator = 'bg-rose-500';
          } else if (toast.type === 'info') {
            bg = 'bg-sky-950/90 border-sky-800 text-sky-100';
            indicator = 'bg-sky-400';
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-950/90 border-amber-800 text-amber-100';
            indicator = 'bg-amber-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${bg}`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${indicator}`} />
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-neutral-400 hover:text-neutral-200 text-xs p-1"
                aria-label="Dismiss toast"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
