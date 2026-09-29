import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, setIsAuthModalOpen } = useAuth();
  const { showToast } = useToast();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const refreshWishlist = async () => {
    if (!token) {
      setWishlistProducts([]);
      setWishlistIds([]);
      return;
    }
    try {
      const res = await fetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const products: Product[] = await res.json();
        setWishlistProducts(products);
        setWishlistIds(products.map(p => p.id));
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user, token]);

  const toggleWishlist = async (product: Product) => {
    if (!token) {
      showToast('Please sign in to save items to your wishlist', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.inWishlist) {
          setWishlistIds(prev => [...prev, product.id]);
          setWishlistProducts(prev => [...prev, product]);
          showToast(`Added "${product.name}" to wishlist`, 'success');
        } else {
          setWishlistIds(prev => prev.filter(id => id !== product.id));
          setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
          showToast(`Removed from wishlist`, 'info');
        }
      }
    } catch {
      showToast('Failed to update wishlist', 'error');
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
