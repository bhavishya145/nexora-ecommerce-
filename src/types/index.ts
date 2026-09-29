export type Role = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  rewardPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referralCode: string;
  referredBy?: string;
  shoppingStreak: number;
  lastLoginDate?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Space Black - 512GB"
  sku: string;
  color?: string;
  size?: string;
  storage?: string;
  priceModifier: number;
  stock: number;
  image?: string;
}

export interface ProductSpecification {
  group: string;
  items: { label: string; value: string }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  variants?: ProductVariant[];
  specifications: ProductSpecification[];
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  flashSale?: {
    discountPercentage: number;
    endsAt: string;
    limitedStock: number;
    soldStock: number;
  };
  sustainability: {
    ecoScore: 'A+' | 'A' | 'B' | 'Verified';
    materials: string;
    recyclablePackaging: boolean;
    carbonNeutralShipping: boolean;
  };
  matchPreferences?: {
    primaryUse: string[];
    techLevel: 'Beginner' | 'Pro' | 'Enthusiast';
    budgetTier: 'Budget' | 'Mid-range' | 'Premium' | 'Flagship';
  };
  shippingInfo: {
    estimatedDays: number;
    freeShipping: boolean;
    shippingCost: number;
  };
  seller: {
    name: string;
    rating: number;
    badge: string;
  };
  createdAt: string;
}

export interface CartItem {
  id: string; // cart item unique id
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  variantName?: string;
  stock: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
  initialPrice: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: 'standard' | 'express' | 'drone';
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  timeline: OrderTimelineEvent[];
  cancelReason?: string;
  returnReason?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  createdAt: string;
  answers: {
    id: string;
    userId: string;
    userName: string;
    isAdmin: boolean;
    answer: string;
    helpfulCount: number;
    createdAt: string;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'price_drop' | 'stock' | 'promo' | 'system' | 'reward';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Orders & Shipping' | 'Returns & Refunds' | 'Technical' | 'Product Inquiry' | 'General';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'admin';
    content: string;
    timestamp: string;
  }[];
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  couponCode: string;
  iconName: string;
}

export interface PriceAlertSubscription {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  createdAt: string;
}

export interface BackInStockSubscription {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}
