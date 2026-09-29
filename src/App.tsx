import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { NotificationProvider } from './context/NotificationContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CompareModal } from './components/CompareModal';
import { SmartProductFinderModal } from './components/SmartProductFinderModal';
import { SmartAiAssistantModal } from './components/SmartAiAssistantModal';
import { SurpriseDealModal } from './components/SurpriseDealModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { SupportPage } from './pages/SupportPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string>('');

  // Modals state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isProductFinderOpen, setIsProductFinderOpen] = useState(false);
  const [isSurpriseDealOpen, setIsSurpriseDealOpen] = useState(false);

  // Hash synchronization on mount and change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        const [view, param] = hash.split('?');
        setCurrentView(view || 'home');
        setViewParam(param || '');
      } else {
        setCurrentView('home');
        setViewParam('');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (view: string, param: string = '') => {
    setCurrentView(view);
    setViewParam(param);
    window.location.hash = param ? `${view}?${param}` : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <NotificationProvider>
                  <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 transition-colors dark:bg-neutral-950 dark:text-neutral-100 light:bg-neutral-50 light:text-neutral-900">
                    {/* Header */}
                    <Navbar
                      currentView={currentView}
                      onNavigate={navigateTo}
                      onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
                      onOpenProductFinder={() => setIsProductFinderOpen(true)}
                      onOpenSurpriseDeal={() => setIsSurpriseDealOpen(true)}
                    />

                    {/* Main Content Area */}
                    <main className="flex-1">
                      {currentView === 'home' && (
                        <HomePage
                          onNavigate={navigateTo}
                          onOpenProductFinder={() => setIsProductFinderOpen(true)}
                          onOpenSurpriseDeal={() => setIsSurpriseDealOpen(true)}
                          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
                        />
                      )}

                      {currentView === 'shop' && (
                        <ShopPage
                          initialQuery={viewParam}
                          onNavigate={navigateTo}
                        />
                      )}

                      {currentView === 'product' && (
                        <ProductDetailPage
                          productIdOrSlug={viewParam || 'aetherion-spatial-pro-x9'}
                          onNavigate={navigateTo}
                        />
                      )}

                      {currentView === 'checkout' && (
                        <CheckoutPage onNavigate={navigateTo} />
                      )}

                      {currentView === 'profile' && (
                        <ProfilePage
                          initialTab={viewParam || 'overview'}
                          onNavigate={navigateTo}
                        />
                      )}

                      {currentView === 'wishlist' && (
                        <WishlistPage onNavigate={navigateTo} />
                      )}

                      {currentView === 'support' && (
                        <SupportPage />
                      )}

                      {currentView === 'admin' && (
                        <AdminDashboardPage onNavigate={navigateTo} />
                      )}
                    </main>

                    {/* Footer */}
                    <Footer onNavigate={navigateTo} />

                    {/* Drawers and Modals */}
                    <CartDrawer onNavigate={navigateTo} />
                    <NotificationDrawer onNavigate={navigateTo} />
                    <CompareModal onNavigate={navigateTo} />
                    <SmartProductFinderModal
                      isOpen={isProductFinderOpen}
                      onClose={() => setIsProductFinderOpen(false)}
                      onNavigate={navigateTo}
                    />
                    <SmartAiAssistantModal
                      isOpen={isAiAssistantOpen}
                      onClose={() => setIsAiAssistantOpen(false)}
                      onNavigate={navigateTo}
                    />
                    <SurpriseDealModal
                      isOpen={isSurpriseDealOpen}
                      onClose={() => setIsSurpriseDealOpen(false)}
                      onNavigate={navigateTo}
                    />
                    <AuthModal />
                  </div>
                </NotificationProvider>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
