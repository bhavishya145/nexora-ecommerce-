import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, ProductCategory, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'cart';
}

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  userProfile: UserProfile;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  activeTrackedOrder: Order | null;
  setActiveTrackedOrder: (order: Order | null) => void;
  isCommandCenterOpen: boolean;
  setIsCommandCenterOpen: (open: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'cart') => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, selectedColor: string, selectedSize: string | undefined, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  createOrder: (shippingAddress: Order['shippingAddress'], paymentMethod: Order['paymentMethod']) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartItemCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  name: 'Bhavishya R.',
  email: 'explorer@nexora.io',
  tag: 'NX-9042',
  level: 4,
  title: 'NEON EXPLORER',
  currentXp: 8420,
  nextLevelXp: 10000,
  avatarSeed: 'aurora-4',
  joinedDate: 'November 2029'
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'NX-8921',
    date: '23 Sep 2030, 18:42',
    status: 'In Transit',
    currentStepIndex: 2,
    subtotal: 38499,
    discount: 5000,
    deliveryFee: 0,
    total: 33499,
    paymentMethod: 'UPI',
    estimatedDelivery: 'Tomorrow, by 14:00',
    shippingAddress: {
      fullName: 'Bhavishya Rangarajan',
      phone: '+91 98401 23456',
      street: '72 Cyber Horizon Boulevard, Tower 4, Apt 1102',
      city: 'Bengaluru Tech Corridor',
      postalCode: '560103'
    },
    items: [
      {
        productId: 'nx-02',
        productName: 'Chronos Holographic Smartwatch',
        price: 38499,
        quantity: 1,
        color: 'Titanium Raw',
        image: INITIAL_PRODUCTS[1].image
      }
    ]
  },
  {
    id: 'NX-7104',
    date: '14 Aug 2030, 11:20',
    status: 'Delivered',
    currentStepIndex: 4,
    subtotal: 18999,
    discount: 2000,
    deliveryFee: 0,
    total: 16999,
    paymentMethod: 'Credit / Debit Card',
    estimatedDelivery: 'Delivered 16 Aug 2030',
    shippingAddress: {
      fullName: 'Bhavishya Rangarajan',
      phone: '+91 98401 23456',
      street: '72 Cyber Horizon Boulevard, Tower 4, Apt 1102',
      city: 'Bengaluru Tech Corridor',
      postalCode: '560103'
    },
    items: [
      {
        productId: 'nx-03',
        productName: 'PulseRunner Hyper-Shift Kicks',
        price: 18999,
        quantity: 1,
        color: 'Cyan Shock',
        size: 'UK 9',
        image: INITIAL_PRODUCTS[2].image
      }
    ]
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexora_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nexora_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedColor: INITIAL_PRODUCTS[0].colors[0].name
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexora_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['nx-02', 'nx-04'];
      }
    }
    return ['nx-02', 'nx-04'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nexora_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('ALL');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('nexora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nexora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nexora_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'cart' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const color = selectedColor || product.colors[0]?.name || 'Default';
    const size = selectedSize || (product.sizes ? product.sizes[0] : undefined);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });

    showToast(`Added ${product.name} to cart`, 'cart');
  };

  const removeFromCart = (productId: string, selectedColor: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (
    productId: string,
    selectedColor: string,
    selectedSize: string | undefined,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your Command Center Wishlist ✦', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = Math.max(0, cartSubtotal - cartTotal);
  const cartDeliveryFee = cartTotal > 0 && cartTotal < 15000 ? 499 : 0;
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const createOrder = (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod']
  ): Order => {
    const orderId = `NX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Placed',
      currentStepIndex: 0,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: cartDeliveryFee,
      total: cartTotal + cartDeliveryFee,
      shippingAddress,
      paymentMethod,
      estimatedDelivery: '3-4 Days (Quantum Express)',
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
        image: item.product.image
      }))
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Reward XP to user
    setUserProfile((prev) => {
      const addedXp = 650;
      const totalXp = prev.currentXp + addedXp;
      return {
        ...prev,
        currentXp: totalXp
      };
    });

    setActiveTrackedOrder(newOrder);
    showToast(`Order ${orderId} Confirmed! +650 XP Gained ✦`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const steps: Record<OrderStatus, number> = {
      Placed: 0,
      Packed: 1,
      Shipped: 2,
      'In Transit': 2,
      'Out for Delivery': 3,
      Delivered: 4
    };

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              currentStepIndex: steps[status]
            }
          : ord
      )
    );
    showToast(`Order ${orderId} updated to ${status}`, 'info');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: `nx-${Date.now()}`
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Product "${product.name}" added to catalog`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        userProfile,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedProductForModal,
        setSelectedProductForModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        activeTrackedOrder,
        setActiveTrackedOrder,
        isCommandCenterOpen,
        setIsCommandCenterOpen,
        isAdminMode,
        setIsAdminMode,
        toasts,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        addProduct,
        deleteProduct,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        cartItemCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
