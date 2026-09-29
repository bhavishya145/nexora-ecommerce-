import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Product,
  CartItem,
  Order,
  Review,
  ProductQuestion,
  Coupon,
  Notification,
  SupportTicket,
  Address,
  PriceAlertSubscription,
  BackInStockSubscription
} from '../types/index.ts';
import {
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_PRODUCTS,
  SEED_COUPONS,
  SEED_USERS,
  SeedUser
} from '../data/seedData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'nexora-db.json');

export interface DatabaseSchema {
  users: SeedUser[];
  addresses: Address[];
  products: Product[];
  categories: typeof SEED_CATEGORIES;
  brands: typeof SEED_BRANDS;
  carts: Record<string, CartItem[]>; // userId/sessionId -> CartItem[]
  orders: Order[];
  reviews: Review[];
  questions: ProductQuestion[];
  coupons: Coupon[];
  wishlists: Record<string, string[]>; // userId -> productId[]
  notifications: Notification[];
  supportTickets: SupportTicket[];
  priceAlerts: PriceAlertSubscription[];
  backInStockAlerts: BackInStockSubscription[];
}

export class NexoraDatabase {
  private data: DatabaseSchema;
  private saveDebounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && Array.isArray(parsed.products) && parsed.products.length >= 50 && parsed.users && parsed.orders) {
          parsed.products = parsed.products.map((p: any, idx: number) => {
            const discountVal = typeof p.discount === 'number' ? p.discount : (typeof p.discountPercentage === 'number' ? p.discountPercentage : 0);
            const isBestseller = Boolean(p.bestseller || p.bestSeller || (p.reviewCount && p.reviewCount >= 100));
            const isFeatured = Boolean(p.featured || idx < 12);
            const isFlashSale = Boolean(p.flashSale || discountVal >= 20);
            return {
              ...p,
              department: p.department || p.category,
              category: p.category,
              discount: discountVal,
              discountPercentage: discountVal,
              featured: isFeatured,
              bestseller: isBestseller,
              bestSeller: isBestseller,
              flashSale: isFlashSale,
              flashSaleDetails: typeof p.flashSale === 'object' && p.flashSale ? p.flashSale : undefined,
              trending: Boolean(p.trending || idx % 3 === 0),
              newArrival: Boolean(p.newArrival || idx % 4 === 0)
            };
          });
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load existing DB file, reinitializing with seed data:', err);
    }

    return this.initializeSeedData();
  }

  private initializeSeedData(): DatabaseSchema {
    // Generate initial addresses
    const initialAddresses: Address[] = [
      {
        id: 'addr-alex-1',
        userId: 'usr-alex',
        fullName: 'Alex Rivera',
        phone: '+1 (555) 349-8812',
        street: '742 Evergreen Terrace, Suite 4B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
        isDefault: true,
        type: 'home'
      },
      {
        id: 'addr-alex-2',
        userId: 'usr-alex',
        fullName: 'Alex Rivera (Studio)',
        phone: '+1 (555) 349-8812',
        street: '100 Innovation Way, Floor 8',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        country: 'United States',
        isDefault: false,
        type: 'work'
      }
    ];

    // Generate initial realistic orders
    const initialOrders: Order[] = [
      {
        id: 'ord-101',
        orderNumber: 'NEX-89042',
        userId: 'usr-alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex@nexora.store',
        items: [
          {
            productId: 'prod-01',
            variantId: 'var-01-a',
            name: 'Aetherion Spatial Pro X9 Wireless Headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            price: 349.99,
            quantity: 1,
            variantName: 'Stealth Matte Black'
          },
          {
            productId: 'prod-07',
            name: 'Apex Forge Titanium MagSafe Kinetic Power Vault',
            image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
            price: 139.00,
            quantity: 1
          }
        ],
        shippingAddress: initialAddresses[0],
        deliveryMethod: 'express',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        subtotal: 488.99,
        discount: 48.90,
        couponCode: 'WELCOME10',
        shippingFee: 0,
        tax: 35.21,
        grandTotal: 475.30,
        status: 'Delivered',
        trackingNumber: 'NX-TRK-771892',
        carrier: 'Nexora HyperFleet Priority',
        estimatedDelivery: '2026-03-02T16:00:00Z',
        timeline: [
          { status: 'Order Placed', timestamp: '2026-02-28T09:12:00Z', description: 'Order confirmed and payment verified via Stripe Sandbox', completed: true },
          { status: 'Confirmed', timestamp: '2026-02-28T09:30:00Z', description: 'Inventory reserved at Fremont Fulfillment Center', completed: true },
          { status: 'Packed', timestamp: '2026-02-28T14:10:00Z', description: 'Eco-certified biodegradable shock casing applied', completed: true },
          { status: 'Shipped', timestamp: '2026-03-01T08:00:00Z', description: 'Dispatched with Nexora HyperFleet courier', completed: true },
          { status: 'Out for Delivery', timestamp: '2026-03-02T11:45:00Z', description: 'Courier out for final mile delivery', completed: true },
          { status: 'Delivered', timestamp: '2026-03-02T15:20:00Z', description: 'Handed directly to resident. Signed by Alex.', completed: true }
        ],
        createdAt: '2026-02-28T09:12:00Z'
      },
      {
        id: 'ord-102',
        orderNumber: 'NEX-92841',
        userId: 'usr-alex',
        customerName: 'Alex Rivera',
        customerEmail: 'alex@nexora.store',
        items: [
          {
            productId: 'prod-02',
            variantId: 'var-02-a',
            name: 'Novawear Horizon Biometric Titanium Ring Gen 4',
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
            price: 299.00,
            quantity: 1,
            variantName: 'Space Grey - Size 9'
          }
        ],
        shippingAddress: initialAddresses[0],
        deliveryMethod: 'drone',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        subtotal: 299.00,
        discount: 0,
        shippingFee: 15.00,
        tax: 25.12,
        grandTotal: 339.12,
        status: 'Shipped',
        trackingNumber: 'NX-DRONE-44910',
        carrier: 'SkyRoute Autonomous Drone Courier',
        estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        timeline: [
          { status: 'Order Placed', timestamp: '2026-03-27T10:14:00Z', description: 'Order received and verified', completed: true },
          { status: 'Confirmed', timestamp: '2026-03-27T10:45:00Z', description: 'Calibrated titanium biometric pod allocated', completed: true },
          { status: 'Packed', timestamp: '2026-03-27T18:20:00Z', description: 'Sealed in tamper-evident laser lock box', completed: true },
          { status: 'Shipped', timestamp: '2026-03-28T07:30:00Z', description: 'Transferred to SkyRoute drone launch hub', completed: true },
          { status: 'Out for Delivery', timestamp: '2026-03-29T08:00:00Z', description: 'Autonomous drone descent scheduled to landing pad', completed: false },
          { status: 'Delivered', timestamp: '', description: 'Pending recipient confirmation', completed: false }
        ],
        createdAt: '2026-03-27T10:14:00Z'
      }
    ];

    // Generate initial rich reviews
    const initialReviews: Review[] = [
      {
        id: 'rev-01',
        productId: 'prod-01',
        userId: 'usr-alex',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'The planar magnetic sound is otherworldly',
        comment: 'I upgraded from studio reference monitors and I am stunned. The instrument separation and sub-bass textures on lossless FLAC tracks are crystal clear. ANC cuts out coffee shop chatter completely.',
        verifiedPurchase: true,
        helpfulCount: 24,
        createdAt: '2026-03-03T18:00:00Z'
      },
      {
        id: 'rev-02',
        productId: 'prod-01',
        userId: 'usr-03',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'Unbelievably comfortable memory foam',
        comment: 'Wearing these for 7-hour audio mastering sessions with zero fatigue or heat buildup. The 48-hour battery is no exaggeration.',
        verifiedPurchase: true,
        helpfulCount: 16,
        createdAt: '2026-02-22T14:15:00Z'
      },
      {
        id: 'rev-03',
        productId: 'prod-02',
        userId: 'usr-04',
        userName: 'Kai Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'Replaced my bulky smartwatch permanently',
        comment: 'It weighs nothing on my finger. Sleep staging and heart rate recovery data perfectly align with my actual sleep quality. Battery easily lasts a full week.',
        verifiedPurchase: true,
        helpfulCount: 31,
        createdAt: '2026-02-26T10:00:00Z'
      },
      {
        id: 'rev-04',
        productId: 'prod-07',
        userId: 'usr-05',
        userName: 'Sophia Laurent',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'The sapphire display and titanium body look insane',
        comment: 'Easily the most visually stunning piece of EDC gear I own. Charges my laptop at 65W and snaps onto my phone with rock-solid magnetic hold.',
        verifiedPurchase: true,
        helpfulCount: 19,
        createdAt: '2026-02-15T11:20:00Z'
      },
      {
        id: 'rev-05',
        productId: 'prod-10',
        userId: 'usr-07',
        userName: 'Zoe Nakamura',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        rating: 5,
        title: '36 grams is a total cheat code in competitive FPS',
        comment: 'Coming from a 60g mouse, this feels like an extension of my hand. The 8000Hz polling rate makes micro-adjustments instantaneous on 240Hz monitors.',
        verifiedPurchase: true,
        helpfulCount: 42,
        createdAt: '2026-02-19T13:40:00Z'
      }
    ];

    // Generate initial Q&A
    const initialQuestions: ProductQuestion[] = [
      {
        id: 'q-01',
        productId: 'prod-01',
        userId: 'usr-04',
        userName: 'Kai Chen',
        question: 'Does spatial audio tracking work without installing special proprietary software?',
        createdAt: '2026-02-10T14:00:00Z',
        answers: [
          {
            id: 'ans-01',
            userId: 'usr-admin',
            userName: 'Marcus Vance (Admin)',
            isAdmin: true,
            answer: 'Yes! The onboard IMU gyroscope computes 360-degree head orientation inside the headphone DSP hardware itself. It works on macOS, Windows, iOS, and Android over standard Bluetooth LDAC or USB-C wired audio.',
            helpfulCount: 18,
            createdAt: '2026-02-10T14:45:00Z'
          }
        ]
      },
      {
        id: 'q-02',
        productId: 'prod-02',
        userId: 'usr-06',
        userName: 'Darius Miller',
        question: 'Can I wear the titanium ring while lifting free weights or swimming in salt water?',
        createdAt: '2026-02-15T09:30:00Z',
        answers: [
          {
            id: 'ans-02',
            userId: 'usr-admin',
            userName: 'Marcus Vance (Admin)',
            isAdmin: true,
            answer: 'The ring is 10 ATM certified (waterproof to 100 meters) and impervious to saltwater corrosion. For heavy barbell knurling, we advise wearing it on the non-dominant hand or using gym grips to prevent minor surface micro-scratches on the PVD coating.',
            helpfulCount: 14,
            createdAt: '2026-02-15T10:15:00Z'
          }
        ]
      }
    ];

    // Generate initial support tickets
    const initialSupportTickets: SupportTicket[] = [
      {
        id: 'tkt-01',
        ticketNumber: 'TKT-5510',
        userId: 'usr-alex',
        userName: 'Alex Rivera',
        userEmail: 'alex@nexora.store',
        subject: 'Inquiry regarding SkyRoute Drone Delivery landing coordinates',
        category: 'Orders & Shipping',
        status: 'In Progress',
        priority: 'Medium',
        createdAt: '2026-03-28T08:15:00Z',
        messages: [
          {
            id: 'msg-01',
            senderId: 'usr-alex',
            senderName: 'Alex Rivera',
            senderRole: 'customer',
            content: 'Hello NEXORA team! My recent order NEX-92841 is scheduled for drone dispatch. Can I specify delivery directly to my rooftop patio rather than the ground courtyard?',
            timestamp: '2026-03-28T08:15:00Z'
          },
          {
            id: 'msg-02',
            senderId: 'usr-admin',
            senderName: 'Marcus Vance (Admin)',
            senderRole: 'admin',
            content: 'Hi Alex! Absolutely. We have updated your dispatch waypoint with flight clearance coordinates for the rooftop terrace. Our drone vision pod will scan for the QR marker before tether descent.',
            timestamp: '2026-03-28T09:20:00Z'
          }
        ]
      }
    ];

    // Generate initial notifications
    const initialNotifications: Notification[] = [
      {
        id: 'notif-01',
        userId: 'usr-alex',
        title: 'Order Delivered! 🎉',
        message: 'Order NEX-89042 with Aetherion Spatial Pro X9 has been successfully delivered.',
        type: 'order',
        link: '/orders/ord-101',
        read: false,
        createdAt: '2026-03-02T15:20:00Z'
      },
      {
        id: 'notif-02',
        userId: 'usr-alex',
        title: 'Flash Sale Alert! ⚡',
        message: 'OmniHaptic Apex Hyper-Glide Mouse is now 30% OFF for the next 8 hours!',
        type: 'promo',
        link: '/product/omnihaptic-apex-hyper-glide-mouse',
        read: false,
        createdAt: '2026-03-28T06:00:00Z'
      },
      {
        id: 'notif-03',
        userId: 'usr-alex',
        title: 'Streak Bonus Unlocked 🔥',
        message: 'You have logged in 5 days in a row! 50 bonus reward points added to your vault.',
        type: 'reward',
        link: '/profile?tab=loyalty',
        read: true,
        createdAt: '2026-03-27T09:00:00Z'
      }
    ];

    const initialData: DatabaseSchema = {
      users: SEED_USERS,
      addresses: initialAddresses,
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,
      brands: SEED_BRANDS,
      carts: {
        'usr-alex': [
          {
            id: 'cart-init-01',
            productId: 'prod-05',
            variantId: 'var-05-a',
            name: 'Kinesis Form Split Ortholinear Mechanical Keyboard',
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
            price: 389.00,
            originalPrice: 449.00,
            quantity: 1,
            variantName: 'Tactile Silent Hall Effect',
            stock: 7
          }
        ]
      },
      orders: initialOrders,
      reviews: initialReviews,
      questions: initialQuestions,
      coupons: SEED_COUPONS,
      wishlists: {
        'usr-alex': ['prod-03', 'prod-06', 'prod-15']
      },
      notifications: initialNotifications,
      supportTickets: initialSupportTickets,
      priceAlerts: [],
      backInStockAlerts: []
    };

    this.saveDatabaseSync(initialData);
    return initialData;
  }

  private saveDatabaseSync(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save(): void {
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    this.saveDebounceTimer = setTimeout(() => {
      this.saveDatabaseSync(this.data);
    }, 150);
  }

  // --- Hashing & Auth ---
  public hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  public generateToken(userId: string): string {
    const payload = `${userId}:${Date.now()}`;
    const hmac = crypto.createHmac('sha256', 'nexora-secret-key-2026').update(payload).digest('hex');
    return `${Buffer.from(payload).toString('base64')}.${hmac}`;
  }

  public verifyToken(token: string): string | null {
    try {
      const [encodedPayload, receivedHmac] = token.split('.');
      if (!encodedPayload || !receivedHmac) return null;
      const payload = Buffer.from(encodedPayload, 'base64').toString('utf-8');
      const expectedHmac = crypto.createHmac('sha256', 'nexora-secret-key-2026').update(payload).digest('hex');
      if (expectedHmac !== receivedHmac) return null;
      const [userId] = payload.split(':');
      return userId || null;
    } catch {
      return null;
    }
  }

  // --- Users ---
  public getUsers(): SeedUser[] {
    return this.data.users;
  }

  public findUserById(id: string): SeedUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): SeedUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: { name: string; email: string; password: string; role?: 'customer' | 'admin'; referredBy?: string }): SeedUser {
    const newUser: SeedUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: this.hashPassword(userData.password),
      role: userData.role || 'customer',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      phone: '',
      dateOfBirth: '',
      rewardPoints: 100, // Sign-up bonus points!
      tier: 'Bronze',
      referralCode: `NEX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      shoppingStreak: 1,
      createdAt: new Date().toISOString()
    };

    if (userData.referredBy) {
      const referrer = this.data.users.find(u => u.referralCode === userData.referredBy);
      if (referrer) {
        referrer.rewardPoints += 150;
      }
    }

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<SeedUser>): SeedUser | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Addresses ---
  public getAddressesByUser(userId: string): Address[] {
    return this.data.addresses.filter(a => a.userId === userId);
  }

  public addAddress(address: Omit<Address, 'id'>): Address {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };
    if (newAddress.isDefault) {
      this.data.addresses.forEach(a => {
        if (a.userId === newAddress.userId) a.isDefault = false;
      });
    }
    this.data.addresses.push(newAddress);
    this.save();
    return newAddress;
  }

  public updateAddress(id: string, updates: Partial<Address>): Address | undefined {
    const address = this.data.addresses.find(a => a.id === id);
    if (!address) return undefined;
    if (updates.isDefault) {
      this.data.addresses.forEach(a => {
        if (a.userId === address.userId && a.id !== id) a.isDefault = false;
      });
    }
    Object.assign(address, updates);
    this.save();
    return address;
  }

  public deleteAddress(id: string): boolean {
    const idx = this.data.addresses.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.data.addresses.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.data.products;
  }

  public findProductByIdOrSlug(idOrSlug: string): Product | undefined {
    return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  public addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const product = this.data.products.find(p => p.id === id);
    if (!product) return undefined;
    Object.assign(product, updates);
    this.save();
    return product;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Categories & Brands ---
  public getCategories() {
    return this.data.categories;
  }

  public getBrands() {
    return this.data.brands;
  }

  // --- Cart ---
  public getCart(userIdOrSession: string): CartItem[] {
    return this.data.carts[userIdOrSession] || [];
  }

  public updateCart(userIdOrSession: string, items: CartItem[]): CartItem[] {
    this.data.carts[userIdOrSession] = items;
    this.save();
    return items;
  }

  public clearCart(userIdOrSession: string): void {
    delete this.data.carts[userIdOrSession];
    this.save();
  }

  // --- Orders ---
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public findOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Order {
    const orderNumber = `NEX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          description: `Order successfully placed with ${orderData.paymentMethod.toUpperCase()}`,
          completed: true
        },
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          description: 'Payment authorized and warehouse allocation confirmed',
          completed: true
        },
        {
          status: 'Packed',
          timestamp: '',
          description: 'Awaiting specialized automated packaging',
          completed: false
        },
        {
          status: 'Shipped',
          timestamp: '',
          description: 'Carrier handoff pending',
          completed: false
        },
        {
          status: 'Out for Delivery',
          timestamp: '',
          description: 'Local courier dispatch pending',
          completed: false
        },
        {
          status: 'Delivered',
          timestamp: '',
          description: 'Final delivery confirmation pending',
          completed: false
        }
      ]
    };

    // Deduct stock for each item
    for (const item of newOrder.items) {
      const product = this.data.products.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        if (item.variantId && product.variants) {
          const variant = product.variants.find(v => v.id === item.variantId);
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
        }
      }
    }

    // Reward points for order ($1 spent = 1 point)
    const user = this.findUserById(newOrder.userId);
    if (user) {
      user.rewardPoints += Math.floor(newOrder.grandTotal);
      if (user.rewardPoints > 2000) user.tier = 'Platinum';
      else if (user.rewardPoints > 1000) user.tier = 'Gold';
      else if (user.rewardPoints > 500) user.tier = 'Silver';
    }

    // Add notification
    this.addNotification({
      userId: newOrder.userId,
      title: 'Order Confirmed! 🚀',
      message: `Your order #${orderNumber} for $${newOrder.grandTotal.toFixed(2)} has been placed!`,
      type: 'order',
      link: `/orders/${newOrder.id}`,
      read: false
    });

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status'], note?: string): Order | undefined {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return undefined;
    order.status = status;

    const timelineItem = order.timeline.find(t => t.status === status);
    if (timelineItem) {
      timelineItem.completed = true;
      timelineItem.timestamp = new Date().toISOString();
      if (note) timelineItem.description = note;
    } else {
      order.timeline.push({
        status,
        timestamp: new Date().toISOString(),
        description: note || `Order status updated to ${status}`,
        completed: true
      });
    }

    // Send notification
    this.addNotification({
      userId: order.userId,
      title: `Order Update: ${status}`,
      message: `Order #${order.orderNumber} is now ${status}.`,
      type: 'order',
      link: `/orders/${order.id}`,
      read: false
    });

    this.save();
    return order;
  }

  public cancelOrder(orderId: string, reason: string): Order | undefined {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return undefined;
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return undefined;
    }

    order.status = 'Cancelled';
    order.cancelReason = reason;
    order.paymentStatus = 'refunded';
    order.timeline.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      description: `Cancelled: ${reason}. Full refund initiated.`,
      completed: true
    });

    // Restore stock
    for (const item of order.items) {
      const product = this.data.products.find(p => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
        if (item.variantId && product.variants) {
          const variant = product.variants.find(v => v.id === item.variantId);
          if (variant) {
            variant.stock += item.quantity;
          }
        }
      }
    }

    this.save();
    return order;
  }

  // --- Reviews ---
  public getReviewsByProduct(productId: string): Review[] {
    return this.data.reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>): Review {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };
    this.data.reviews.unshift(newReview);

    // Recalculate product rating
    const productReviews = this.data.reviews.filter(r => r.productId === reviewData.productId);
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const product = this.data.products.find(p => p.id === reviewData.productId);
    if (product) {
      product.rating = Number(avg.toFixed(1));
      product.reviewCount = productReviews.length;
    }

    // Award loyalty points for review
    const user = this.findUserById(reviewData.userId);
    if (user) {
      user.rewardPoints += 50;
    }

    this.save();
    return newReview;
  }

  public voteHelpfulReview(reviewId: string): Review | undefined {
    const review = this.data.reviews.find(r => r.id === reviewId);
    if (review) {
      review.helpfulCount += 1;
      this.save();
    }
    return review;
  }

  // --- Q&A ---
  public getQuestionsByProduct(productId: string): ProductQuestion[] {
    return this.data.questions.filter(q => q.productId === productId);
  }

  public addQuestion(productId: string, userId: string, userName: string, questionText: string): ProductQuestion {
    const question: ProductQuestion = {
      id: `q-${Date.now()}`,
      productId,
      userId,
      userName,
      question: questionText,
      createdAt: new Date().toISOString(),
      answers: []
    };
    this.data.questions.push(question);
    this.save();
    return question;
  }

  public addAnswer(questionId: string, userId: string, userName: string, isAdmin: boolean, answerText: string) {
    const question = this.data.questions.find(q => q.id === questionId);
    if (!question) return undefined;
    const answer = {
      id: `ans-${Date.now()}`,
      userId,
      userName,
      isAdmin,
      answer: answerText,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };
    question.answers.push(answer);
    this.save();
    return question;
  }

  // --- Coupons ---
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public findCouponByCode(code: string): Coupon | undefined {
    return this.data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  }

  public addCoupon(coupon: Omit<Coupon, 'id' | 'timesUsed'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      timesUsed: 0
    };
    this.data.coupons.push(newCoupon);
    this.save();
    return newCoupon;
  }

  // --- Wishlist ---
  public getWishlist(userId: string): Product[] {
    const productIds = this.data.wishlists[userId] || [];
    return this.data.products.filter(p => productIds.includes(p.id));
  }

  public toggleWishlist(userId: string, productId: string): { inWishlist: boolean; count: number } {
    if (!this.data.wishlists[userId]) {
      this.data.wishlists[userId] = [];
    }
    const list = this.data.wishlists[userId];
    const idx = list.indexOf(productId);
    let inWishlist = false;
    if (idx > -1) {
      list.splice(idx, 1);
      inWishlist = false;
    } else {
      list.push(productId);
      inWishlist = true;
    }
    this.save();
    return { inWishlist, count: list.length };
  }

  // --- Notifications ---
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.save();
  }

  // --- Support Tickets ---
  public getSupportTickets(userId?: string): SupportTicket[] {
    if (userId) {
      return this.data.supportTickets.filter(t => t.userId === userId);
    }
    return this.data.supportTickets;
  }

  public findSupportTicketById(id: string): SupportTicket | undefined {
    return this.data.supportTickets.find(t => t.id === id || t.ticketNumber === id);
  }

  public createSupportTicket(ticketData: {
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    category: SupportTicket['category'];
    message: string;
  }): SupportTicket {
    const ticketNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber,
      userId: ticketData.userId,
      userName: ticketData.userName,
      userEmail: ticketData.userEmail,
      subject: ticketData.subject,
      category: ticketData.category,
      status: 'Open',
      priority: 'Medium',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: ticketData.userId,
          senderName: ticketData.userName,
          senderRole: 'customer',
          content: ticketData.message,
          timestamp: new Date().toISOString()
        }
      ]
    };
    this.data.supportTickets.unshift(newTicket);
    this.save();
    return newTicket;
  }

  public addSupportMessage(ticketId: string, message: {
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'admin';
    content: string;
  }): SupportTicket | undefined {
    const ticket = this.data.supportTickets.find(t => t.id === ticketId);
    if (!ticket) return undefined;
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      ...message,
      timestamp: new Date().toISOString()
    });
    if (message.senderRole === 'admin' && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }
    this.save();
    return ticket;
  }

  public updateTicketStatus(ticketId: string, status: SupportTicket['status']): SupportTicket | undefined {
    const ticket = this.data.supportTickets.find(t => t.id === ticketId);
    if (!ticket) return undefined;
    ticket.status = status;
    this.save();
    return ticket;
  }

  // --- Price & Stock Alerts ---
  public subscribePriceAlert(userId: string, productId: string, targetPrice: number): PriceAlertSubscription {
    const alert: PriceAlertSubscription = {
      id: `alert-p-${Date.now()}`,
      userId,
      productId,
      targetPrice,
      createdAt: new Date().toISOString()
    };
    this.data.priceAlerts.push(alert);
    this.save();
    return alert;
  }

  public subscribeBackInStock(userId: string, productId: string): BackInStockSubscription {
    const alert: BackInStockSubscription = {
      id: `alert-s-${Date.now()}`,
      userId,
      productId,
      createdAt: new Date().toISOString()
    };
    this.data.backInStockAlerts.push(alert);
    this.save();
    return alert;
  }

  // --- Admin Analytics ---
  public getAnalytics() {
    const totalOrders = this.data.orders.length;
    const paidOrders = this.data.orders.filter(o => o.paymentStatus === 'paid' && o.status !== 'Cancelled');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
    const totalUsers = this.data.users.length;
    const totalProducts = this.data.products.length;
    const lowStockProducts = this.data.products.filter(p => p.stock <= 15);
    const pendingOrders = this.data.orders.filter(o => o.status === 'Order Placed' || o.status === 'Confirmed' || o.status === 'Packed');

    // Sales by Category
    const salesByCategory: Record<string, { revenue: number; count: number }> = {};
    for (const order of paidOrders) {
      for (const item of order.items) {
        const prod = this.data.products.find(p => p.id === item.productId);
        const cat = prod ? prod.category : 'Other';
        if (!salesByCategory[cat]) {
          salesByCategory[cat] = { revenue: 0, count: 0 };
        }
        salesByCategory[cat].revenue += item.price * item.quantity;
        salesByCategory[cat].count += item.quantity;
      }
    }

    // Top selling products
    const productSalesCount: Record<string, number> = {};
    for (const order of paidOrders) {
      for (const item of order.items) {
        productSalesCount[item.productId] = (productSalesCount[item.productId] || 0) + item.quantity;
      }
    }
    const topProducts = Object.entries(productSalesCount)
      .map(([id, sold]) => {
        const prod = this.data.products.find(p => p.id === id);
        return {
          id,
          name: prod ? prod.name : 'Unknown Product',
          sold,
          price: prod ? prod.price : 0,
          revenue: prod ? prod.price * sold : 0
        };
      })
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      totalUsers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      pendingOrdersCount: pendingOrders.length,
      salesByCategory,
      topProducts,
      recentOrders: this.data.orders.slice(0, 5)
    };
  }
}

export const db = new NexoraDatabase();
