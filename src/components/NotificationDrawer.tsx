import React from 'react';
import { X, CheckCheck, Bell, Zap, Package, Award, Tag } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

interface NotificationDrawerProps {
  onNavigate: (view: string, param?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onNavigate }) => {
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  if (!isNotificationOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-cyan-400" />;
      case 'reward':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'promo':
      case 'price_drop':
        return <Tag className="w-4 h-4 text-pink-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    setIsNotificationOpen(false);
    if (notif.link) {
      if (notif.link.startsWith('/product/')) {
        onNavigate('product', notif.link.replace('/product/', ''));
      } else if (notif.link.startsWith('/orders/')) {
        onNavigate('profile', 'orders');
      } else if (notif.link.includes('loyalty')) {
        onNavigate('profile', 'loyalty');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsNotificationOpen(false)}
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-neutral-950 border-l border-neutral-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Notification Center
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {notifications.some(n => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="text-xs text-neutral-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-700" />
                <p>No notifications at the moment.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    notif.read
                      ? 'bg-neutral-900/40 border-neutral-800/60 text-neutral-400'
                      : 'bg-neutral-900/90 border-cyan-900/60 text-neutral-200 shadow-md shadow-cyan-950/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-100">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-neutral-400 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-neutral-500 mt-2 block">
                        {new Date(notif.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
