import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface AppliedCoupon {
  code: string;
  description: string;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  appliedCoupon: AppliedCoupon | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync cart from server on user sign in or mount
  useEffect(() => {
    async function fetchCart() {
      try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('/api/cart', { headers });
        if (res.ok) {
          const serverItems = await res.json();
          if (Array.isArray(serverItems) && serverItems.length > 0) {
            setItems(serverItems);
          }
        }
      } catch (err) {
        console.error('Failed to sync cart from server:', err);
      }
    }
    fetchCart();
  }, [user, token]);

  // Persist items to localStorage and server
  useEffect(() => {
    localStorage.setItem('nexora_cart', JSON.stringify(items));
    const syncServer = async () => {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch('/api/cart', {
          method: 'POST',
          headers,
          body: JSON.stringify({ items })
        });
      } catch {
        // silent sync fallback
      }
    };
    syncServer();
  }, [items, token]);

  const addItem = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const unitPrice = variant ? product.price + variant.priceModifier : product.price;
    const availableStock = variant ? variant.stock : product.stock;
    const variantId = variant?.id;
    const cartItemId = variantId ? `${product.id}-${variantId}` : product.id;

    if (availableStock <= 0) {
      showToast('Sorry, this item is currently out of stock', 'error');
      return;
    }

    setItems(prev => {
      const existing = prev.find(i => i.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, availableStock);
        if (existing.quantity >= availableStock) {
          showToast(`Maximum available stock (${availableStock}) reached`, 'warning');
          return prev;
        }
        showToast(`Updated quantity in cart`, 'success');
        return prev.map(i => (i.id === cartItemId ? { ...i, quantity: newQty } : i));
      }

      showToast(`Added "${product.name}" to cart`, 'success');
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          variantId,
          name: product.name,
          image: variant?.image || product.images[0],
          price: unitPrice,
          originalPrice: product.originalPrice,
          quantity: Math.min(quantity, availableStock),
          variantName: variant?.name,
          stock: availableStock
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => {
        if (i.id === itemId) {
          const clamped = Math.min(quantity, i.stock);
          if (quantity > i.stock) {
            showToast(`Only ${i.stock} units available in stock`, 'warning');
          }
          return { ...i, quantity: clamped };
        }
        return i;
      })
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Invalid coupon', 'error');
        return false;
      }
      setAppliedCoupon({
        code: data.code,
        description: data.description,
        discountAmount: data.discountAmount
      });
      showToast(`Coupon ${data.code} applied! Saved $${data.discountAmount.toFixed(2)}`, 'success');
      return true;
    } catch {
      showToast('Failed to validate coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  // Free shipping on orders over $150
  const shippingFee = subtotal === 0 || subtotal > 150 ? 0 : 15.00;
  // Estimated 8% sales tax on post-discount subtotal
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.08).toFixed(2));
  const grandTotal = Number((taxableAmount + shippingFee + tax).toFixed(2));
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        tax,
        grandTotal,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
