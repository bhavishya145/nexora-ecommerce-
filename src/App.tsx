/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DiscoverySpace } from './components/DiscoverySpace';
import { DropZone } from './components/DropZone';
import { SmartRecommendations } from './components/SmartRecommendations';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CommandCenter } from './components/CommandCenter';
import { AdminControl } from './components/AdminControl';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const { isAdminMode } = useApp();

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Floating Glass Navigation */}
      <Navbar onScrollToSection={handleScrollToSection} />

      {/* Main Content: Either Admin Dashboard or Immersive Shopper Experience */}
      {isAdminMode ? (
        <AdminControl />
      ) : (
        <main>
          {/* Hero Experience */}
          <Hero
            onExploreClick={() => handleScrollToSection('discovery')}
            onDealsClick={() => handleScrollToSection('drops')}
          />

          {/* Discovery Space with Bento Layout */}
          <DiscoverySpace />

          {/* NEXORA DROPS Special Limited Launch */}
          <DropZone />

          {/* Curated For You AI-inspired recommendations */}
          <SmartRecommendations />
        </main>
      )}

      {/* Footer */}
      {!isAdminMode && <Footer />}

      {/* Modals & Slide-overs */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <CommandCenter />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
