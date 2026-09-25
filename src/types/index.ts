export type ProductCategory = 
  | 'ALL'
  | 'TECH'
  | 'FASHION'
  | 'GAMING'
  | 'HOME'
  | 'BEAUTY'
  | 'FITNESS'
  | 'ACCESSORIES';

export type ProductBadge = 'TRENDING' | 'NEW' | 'LIMITED' | 'BEST SELLER';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  badge?: ProductBadge;
  isDrop?: boolean;
  stockLeft?: number;
  dropTimeLeft?: string;
  colors: { name: string; hex: string }[];
  sizes?: string[];
  specs: { label: string; value: string }[];
  description: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color: string;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery';
  estimatedDelivery: string;
  currentStepIndex: number;
}

export interface UserProfile {
  name: string;
  email: string;
  tag: string;
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  avatarSeed: string;
  joinedDate: string;
}
