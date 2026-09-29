import { Router, Request, Response, NextFunction } from 'express';
import { db } from './db';
import { GoogleGenAI } from '@google/genai';
import { Product } from '../types/index.ts';

export const apiRouter = Router();

// Middleware to authenticate user via Authorization header Bearer token
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.substring(7);
  const userId = db.verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
  const user = db.findUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}

// Optional auth: sets (req as any).user if valid token provided
function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const userId = db.verifyToken(token);
    if (userId) {
      const user = db.findUserById(userId);
      if (user) {
        (req as any).user = user;
      }
    }
  }
  next();
}

// ================= AUTH ROUTES =================
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, referredBy } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = db.createUser({ name, email, password, referredBy });
  const token = db.generateToken(newUser.id);
  const { passwordHash: _, ...safeUser } = newUser;
  return res.status(201).json({ user: safeUser, token });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const hashedInput = db.hashPassword(password);
  if (user.passwordHash !== hashedInput) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = db.generateToken(user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser, token });
});

apiRouter.get('/auth/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

apiRouter.put('/auth/profile', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, phone, dateOfBirth, avatar } = req.body;
  const updated = db.updateUser(user.id, {
    ...(name && { name }),
    ...(phone !== undefined && { phone }),
    ...(dateOfBirth !== undefined && { dateOfBirth }),
    ...(avatar && { avatar })
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

apiRouter.post('/auth/change-password', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  if (user.passwordHash !== db.hashPassword(currentPassword)) {
    return res.status(400).json({ error: 'Current password incorrect' });
  }
  db.updateUser(user.id, { passwordHash: db.hashPassword(newPassword) });
  return res.json({ message: 'Password updated successfully' });
});

apiRouter.post('/auth/claim-streak', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const today = new Date().toISOString().split('T')[0];
  if (user.lastLoginDate === today) {
    return res.json({ message: 'Already claimed today', streak: user.shoppingStreak, rewardPoints: user.rewardPoints });
  }
  const newStreak = (user.shoppingStreak || 0) + 1;
  const bonusPoints = 25 * (newStreak > 7 ? 3 : newStreak > 3 ? 2 : 1);
  const updated = db.updateUser(user.id, {
    shoppingStreak: newStreak,
    lastLoginDate: today,
    rewardPoints: user.rewardPoints + bonusPoints
  });
  db.addNotification({
    userId: user.id,
    title: 'Daily Streak Bonus! 🔥',
    message: `Streak Day ${newStreak}: +${bonusPoints} points claimed!`,
    type: 'reward',
    link: '/profile?tab=loyalty',
    read: false
  });
  const { passwordHash: _, ...safeUser } = updated!;
  return res.json({ user: safeUser, bonusPoints, message: `Streak bonus of +${bonusPoints} points claimed!` });
});

// ================= PRODUCTS ROUTES =================
apiRouter.get('/products', (req: Request, res: Response) => {
  let products = [...db.getProducts()];

  const {
    q,
    category,
    department,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    discount,
    sort,
    tag,
    page = '1',
    limit = '16'
  } = req.query as Record<string, string>;

  // Search filter
  if (q && q.trim()) {
    const searchTerms = q.toLowerCase().trim().split(/\s+/);
    products = products.filter(p => {
      const matchString = `${p.name} ${p.description} ${p.brand} ${p.category} ${p.department || ''} ${(p.tags || []).join(' ')} ${p.sku || ''}`.toLowerCase();
      return searchTerms.every(term => matchString.includes(term));
    });
  }

  // Category / Department / Division filter
  const catFilter = (category || department || (req.query as any).division || '').trim();
  if (catFilter && catFilter.toLowerCase() !== 'all' && catFilter.toLowerCase() !== 'all departments') {
    const clean = catFilter.toLowerCase();
    const slugifiedFilter = clean.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    products = products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pDept = (p.department || '').toLowerCase();
      const pSlug = (p.categorySlug || '').toLowerCase();
      const slugifiedCat = pCat.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const slugifiedDept = pDept.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return (
        pCat === clean ||
        pDept === clean ||
        pSlug === clean ||
        slugifiedCat === slugifiedFilter ||
        slugifiedDept === slugifiedFilter ||
        pSlug === slugifiedFilter ||
        pCat.includes(clean) ||
        clean.includes(pCat) ||
        pDept.includes(clean) ||
        clean.includes(pDept)
      );
    });
  }

  // Brand filter
  if (brand && brand.toLowerCase() !== 'all') {
    const cleanBrand = brand.toLowerCase().trim();
    products = products.filter(p => p.brand.toLowerCase() === cleanBrand || p.brand.toLowerCase().includes(cleanBrand));
  }

  // Price range
  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) products = products.filter(p => p.price >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) products = products.filter(p => p.price <= max);
  }

  // Rating
  if (minRating) {
    const rating = parseFloat(minRating);
    if (!isNaN(rating)) products = products.filter(p => p.rating >= rating);
  }

  // In stock
  if (inStock === 'true' || inStock === '1') {
    products = products.filter(p => p.stock > 0);
  }

  // Minimum discount
  if (discount) {
    const d = parseFloat(discount);
    if (!isNaN(d)) products = products.filter(p => (p.discount ?? p.discountPercentage) >= d);
  }

  // Tag filter
  if (tag) {
    products = products.filter(p => (p.tags || []).some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  // Sorting: Most Popular, Price Low to High, Price High to Low, Highest Rated, Newest, Biggest Discount
  const sortKey = (sort || '').toLowerCase().trim();
  if (sortKey === 'price-asc' || sortKey === 'price_asc' || sortKey.includes('low to high') || sortKey === 'price-low-to-high') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortKey === 'price-desc' || sortKey === 'price_desc' || sortKey.includes('high to low') || sortKey === 'price-high-to-low') {
    products.sort((a, b) => b.price - a.price);
  } else if (sortKey === 'rating' || sortKey.includes('highest rated') || sortKey === 'highest-rated') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sortKey === 'discount' || sortKey.includes('discount') || sortKey === 'biggest-discount') {
    products.sort((a, b) => (b.discount ?? b.discountPercentage) - (a.discount ?? a.discountPercentage));
  } else if (sortKey === 'newest' || sortKey.includes('new') || sortKey === 'new-arrivals') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // Default: Most Popular
    products.sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating));
  }

  const total = products.length;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 16;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = products.slice(startIndex, startIndex + limitNum);

  return res.json({
    products: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  });
});

apiRouter.get('/products/flash-deals', (_req: Request, res: Response) => {
  const deals = db.getProducts()
    .filter(p => p.flashSale || p.discountPercentage >= 20)
    .slice(0, 8);
  return res.json(deals);
});

apiRouter.get('/products/deal-radar', (_req: Request, res: Response) => {
  const radar = db.getProducts()
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 10);
  return res.json(radar);
});

apiRouter.get('/products/featured', (_req: Request, res: Response) => {
  const featured = db.getProducts().filter(p => p.featured).slice(0, 8);
  return res.json(featured);
});

apiRouter.get('/products/trending', (_req: Request, res: Response) => {
  const trending = db.getProducts().filter(p => p.trending).slice(0, 8);
  return res.json(trending);
});

apiRouter.get('/products/recommendations', optionalAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const allProducts = db.getProducts();

  let recommended: Product[] = [];
  if (user) {
    const userOrders = db.getOrders(user.id);
    const purchasedCategories = new Set<string>();
    userOrders.forEach(o => o.items.forEach(i => {
      const p = db.findProductByIdOrSlug(i.productId);
      if (p) purchasedCategories.add(p.category);
    }));

    if (purchasedCategories.size > 0) {
      recommended = allProducts.filter(p => purchasedCategories.has(p.category)).slice(0, 8);
    }
  }

  if (recommended.length < 8) {
    const fallback = allProducts
      .filter(p => !recommended.some(r => r.id === p.id))
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, 8 - recommended.length);
    recommended.push(...fallback);
  }

  return res.json(recommended);
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = db.findProductByIdOrSlug(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Related products
  const related = db.getProducts()
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  // Frequently bought together
  const frequentlyBought = db.getProducts()
    .filter(p => p.id !== product.id && (p.categorySlug === product.categorySlug || p.brand === product.brand))
    .slice(0, 2);

  return res.json({ product, related, frequentlyBought });
});

// Reviews
apiRouter.get('/products/:id/reviews', (req: Request, res: Response) => {
  const reviews = db.getReviewsByProduct(req.params.id);
  return res.json(reviews);
});

apiRouter.post('/products/:id/reviews', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { rating, title, comment, images } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  // Check if user bought this product
  const userOrders = db.getOrders(user.id);
  const hasPurchased = userOrders.some(o =>
    o.status === 'Delivered' && o.items.some(i => i.productId === req.params.id)
  );

  const newReview = db.addReview({
    productId: req.params.id,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    rating: Number(rating),
    title: title || 'Verified Experience',
    comment,
    images: images || [],
    verifiedPurchase: hasPurchased
  });

  return res.status(201).json(newReview);
});

apiRouter.post('/reviews/:id/helpful', (_req: Request, res: Response) => {
  const review = db.voteHelpfulReview(_req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  return res.json(review);
});

// Q&A
apiRouter.get('/products/:id/questions', (req: Request, res: Response) => {
  const questions = db.getQuestionsByProduct(req.params.id);
  return res.json(questions);
});

apiRouter.post('/products/:id/questions', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { question } = req.body;
  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: 'Question must be at least 5 characters' });
  }
  const q = db.addQuestion(req.params.id, user.id, user.name, question.trim());
  return res.status(201).json(q);
});

apiRouter.post('/questions/:id/answers', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { answer } = req.body;
  if (!answer || answer.trim().length < 5) {
    return res.status(400).json({ error: 'Answer must be at least 5 characters' });
  }
  const updated = db.addAnswer(req.params.id, user.id, user.name, user.role === 'admin', answer.trim());
  if (!updated) return res.status(404).json({ error: 'Question not found' });
  return res.status(201).json(updated);
});

// Alerts
apiRouter.post('/products/:id/price-alert', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { targetPrice } = req.body;
  const alert = db.subscribePriceAlert(user.id, req.params.id, Number(targetPrice));
  db.addNotification({
    userId: user.id,
    title: 'Price Alert Set 🎯',
    message: `You will receive a notification when the price reaches $${Number(targetPrice).toFixed(2)}.`,
    type: 'price_drop',
    link: `/product/${req.params.id}`,
    read: false
  });
  return res.json({ message: 'Price alert successfully created', alert });
});

apiRouter.post('/products/:id/stock-alert', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const alert = db.subscribeBackInStock(user.id, req.params.id);
  db.addNotification({
    userId: user.id,
    title: 'Back in Stock Alert Registered 🔔',
    message: `We will ping you the moment fresh inventory lands at our fulfillment center.`,
    type: 'stock',
    link: `/product/${req.params.id}`,
    read: false
  });
  return res.json({ message: 'Stock alert registered', alert });
});

// ================= CATEGORIES & BRANDS =================
apiRouter.get('/categories', (_req: Request, res: Response) => {
  return res.json(db.getCategories());
});

apiRouter.get('/brands', (_req: Request, res: Response) => {
  return res.json(db.getBrands());
});

// ================= CART ROUTES =================
apiRouter.get('/cart', optionalAuth, (req: Request, res: Response) => {
  const userIdOrSession = (req as any).user?.id || (req.headers['x-session-id'] as string) || 'anon-session';
  const cart = db.getCart(userIdOrSession);
  return res.json(cart);
});

apiRouter.post('/cart', optionalAuth, (req: Request, res: Response) => {
  const userIdOrSession = (req as any).user?.id || (req.headers['x-session-id'] as string) || 'anon-session';
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  // Validate stock limits
  const validatedItems = items.map(item => {
    const product = db.findProductByIdOrSlug(item.productId);
    const maxStock = product ? product.stock : item.stock;
    const finalQuantity = Math.min(item.quantity, maxStock);
    return {
      ...item,
      quantity: Math.max(1, finalQuantity),
      stock: maxStock
    };
  });

  const savedCart = db.updateCart(userIdOrSession, validatedItems);
  return res.json(savedCart);
});

apiRouter.delete('/cart', optionalAuth, (req: Request, res: Response) => {
  const userIdOrSession = (req as any).user?.id || (req.headers['x-session-id'] as string) || 'anon-session';
  db.clearCart(userIdOrSession);
  return res.json({ message: 'Cart cleared' });
});

// ================= WISHLIST ROUTES =================
apiRouter.get('/wishlist', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const items = db.getWishlist(user.id);
  return res.json(items);
});

apiRouter.post('/wishlist/toggle', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required' });
  const result = db.toggleWishlist(user.id, productId);
  return res.json(result);
});

// ================= COUPONS ROUTES =================
apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });

  const coupon = db.findCouponByCode(code);
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or expired coupon code' });
  }

  const sub = parseFloat(subtotal) || 0;
  if (sub < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Coupon requires a minimum order value of $${coupon.minOrderValue.toFixed(2)}`
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (sub * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, sub);
  }

  return res.json({
    valid: true,
    code: coupon.code,
    description: coupon.description,
    discountAmount: Number(discountAmount.toFixed(2))
  });
});

// ================= ORDERS ROUTES =================
apiRouter.get('/orders', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const orders = db.getOrders(user.role === 'admin' ? undefined : user.id);
  return res.json(orders);
});

apiRouter.get('/orders/:id', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const order = db.findOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (user.role !== 'admin' && order.userId !== user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  return res.json(order);
});

apiRouter.post('/orders', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    items,
    shippingAddress,
    deliveryMethod,
    paymentMethod,
    subtotal,
    discount,
    couponCode,
    shippingFee,
    tax,
    grandTotal
  } = req.body;

  if (!items || !items.length || !shippingAddress || !deliveryMethod || !paymentMethod) {
    return res.status(400).json({ error: 'Incomplete order payload' });
  }

  // Verify stock availability
  for (const item of items) {
    const prod = db.findProductByIdOrSlug(item.productId);
    if (!prod || prod.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for product: ${item.name}. Available: ${prod ? prod.stock : 0}`
      });
    }
  }

  const order = db.createOrder({
    userId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    items,
    shippingAddress,
    deliveryMethod,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    subtotal: Number(subtotal),
    discount: Number(discount || 0),
    couponCode,
    shippingFee: Number(shippingFee || 0),
    tax: Number(tax || 0),
    grandTotal: Number(grandTotal),
    status: 'Confirmed',
    trackingNumber: `NX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    carrier: deliveryMethod === 'drone' ? 'SkyRoute Autonomous Drone Courier' : 'Nexora HyperFleet Logistics',
    estimatedDelivery: new Date(Date.now() + (deliveryMethod === 'drone' ? 1 : deliveryMethod === 'express' ? 2 : 4) * 86400000).toISOString()
  });

  // Clear user's cart after successful purchase
  db.clearCart(user.id);

  return res.status(201).json(order);
});

apiRouter.post('/orders/:id/cancel', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { reason } = req.body;
  const order = db.findOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (user.role !== 'admin' && order.userId !== user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const cancelled = db.cancelOrder(order.id, reason || 'Customer requested cancellation');
  if (!cancelled) {
    return res.status(400).json({ error: 'Cannot cancel order in current state' });
  }
  return res.json(cancelled);
});

// ================= ADDRESSES ROUTES =================
apiRouter.get('/addresses', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json(db.getAddressesByUser(user.id));
});

apiRouter.post('/addresses', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const address = db.addAddress({
    ...req.body,
    userId: user.id
  });
  return res.status(201).json(address);
});

apiRouter.put('/addresses/:id', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const updated = db.updateAddress(req.params.id, req.body);
  if (!updated || updated.userId !== user.id) {
    return res.status(404).json({ error: 'Address not found' });
  }
  return res.json(updated);
});

apiRouter.delete('/addresses/:id', authenticate, (req: Request, res: Response) => {
  const success = db.deleteAddress(req.params.id);
  return res.json({ success });
});

// ================= NOTIFICATIONS ROUTES =================
apiRouter.get('/notifications', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json(db.getNotifications(user.id));
});

apiRouter.post('/notifications/:id/read', authenticate, (req: Request, res: Response) => {
  db.markNotificationAsRead(req.params.id);
  return res.json({ success: true });
});

apiRouter.post('/notifications/read-all', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  db.markAllNotificationsAsRead(user.id);
  return res.json({ success: true });
});

// ================= SUPPORT TICKETS ROUTES =================
apiRouter.get('/support/tickets', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const tickets = db.getSupportTickets(user.role === 'admin' ? undefined : user.id);
  return res.json(tickets);
});

apiRouter.post('/support/tickets', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { subject, category, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required' });
  }
  const ticket = db.createSupportTicket({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    subject,
    category: category || 'General',
    message
  });
  return res.status(201).json(ticket);
});

apiRouter.post('/support/tickets/:id/messages', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Message content is required' });
  const updated = db.addSupportMessage(req.params.id, {
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    content
  });
  if (!updated) return res.status(404).json({ error: 'Ticket not found' });
  return res.json(updated);
});

// ================= ADMIN ROUTES =================
apiRouter.get('/admin/analytics', authenticate, requireAdmin, (_req: Request, res: Response) => {
  const analytics = db.getAnalytics();
  return res.json(analytics);
});

apiRouter.post('/admin/products', authenticate, requireAdmin, (req: Request, res: Response) => {
  const newProduct = db.addProduct(req.body);
  return res.status(201).json(newProduct);
});

apiRouter.put('/admin/products/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  return res.json(updated);
});

apiRouter.delete('/admin/products/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  return res.json({ success: deleted });
});

apiRouter.put('/admin/orders/:id/status', authenticate, requireAdmin, (req: Request, res: Response) => {
  const { status, note } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  return res.json(updated);
});

apiRouter.get('/admin/coupons', authenticate, requireAdmin, (_req: Request, res: Response) => {
  return res.json(db.getCoupons());
});

apiRouter.post('/admin/coupons', authenticate, requireAdmin, (req: Request, res: Response) => {
  const coupon = db.addCoupon(req.body);
  return res.status(201).json(coupon);
});

// ================= AI & INTELLIGENT FEATURES =================
// 1. Smart Product Finder (questionnaire matcher)
apiRouter.post('/ai/finder', (req: Request, res: Response) => {
  const { need, budget, preference } = req.body;
  const products = db.getProducts();

  const scored = products.map(prod => {
    let score = 50; // base score

    if (need && prod.category.toLowerCase().includes(need.toLowerCase())) {
      score += 30;
    }
    if (preference) {
      const prefLower = preference.toLowerCase();
      if (prod.tags.some(t => t.toLowerCase().includes(prefLower))) score += 15;
      if (prod.description.toLowerCase().includes(prefLower)) score += 10;
    }

    if (budget) {
      const maxBudget = parseFloat(budget);
      if (!isNaN(maxBudget)) {
        if (prod.price <= maxBudget) score += 15;
        else if (prod.price <= maxBudget * 1.2) score += 5;
        else score -= 20;
      }
    }

    return { product: prod, matchScore: Math.min(99, Math.max(45, score)) };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return res.json(scored.slice(0, 6));
});

// 2. Smart Shopping Assistant (Gemini AI + Catalog context fallback)
apiRouter.post('/ai/assistant', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const allProducts = db.getProducts();

  // Try Gemini API if key is set
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const catalogSummary = allProducts.slice(0, 20).map(p =>
        `- ${p.name} ($${p.price}): ${p.tagline} [Category: ${p.category}, Tags: ${p.tags.join(', ')}]`
      ).join('\n');

      const systemPrompt = `You are NEXORA Concierge, a knowledgeable, sophisticated e-commerce shopping advisor for the NEXORA platform.
Your tone is sleek, futuristic, polite, and helpful. Recommend products from this curated catalog:
${catalogSummary}
Format your response with concise markdown. Highlight product names and key specs clearly. Keep responses under 150 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
        ]
      });

      const reply = response.text || "I found several options in our catalog that match your requirements.";
      // Extract matching products
      const suggestedProducts = allProducts.filter(p =>
        reply.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]) ||
        message.toLowerCase().includes(p.category.toLowerCase().split(' ')[0])
      ).slice(0, 3);

      return res.json({ reply, suggestedProducts });
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic concierge:', err);
    }
  }

  // Heuristic Smart Concierge Fallback
  const q = message.toLowerCase();
  const matched = allProducts.filter(p =>
    q.includes(p.category.toLowerCase().split(' ')[0]) ||
    p.tags.some(t => q.includes(t)) ||
    q.includes(p.brand.toLowerCase().split(' ')[0]) ||
    q.includes('audio') && p.categorySlug === 'neural-audio' ||
    q.includes('sound') && p.categorySlug === 'neural-audio' ||
    q.includes('watch') && p.categorySlug === 'smart-wearables' ||
    q.includes('drone') && p.categorySlug === 'drones-robotics' ||
    q.includes('mouse') && p.categorySlug === 'gaming-peripherals' ||
    q.includes('desk') && p.categorySlug === 'workstations'
  );

  const topPick = matched[0] || allProducts[0];
  const reply = `Welcome to NEXORA Concierge! Based on your interest in "${message}", I recommend exploring our **${topPick.name}** ($${topPick.price}). It features ${topPick.tagline} with an impressive ${topPick.rating}★ rating from ${topPick.reviewCount} verified owners. Let me know if you want detailed acoustic, battery, or ergonomic specifications!`;

  return res.json({
    reply,
    suggestedProducts: matched.length > 0 ? matched.slice(0, 3) : [topPick, allProducts[1], allProducts[2]]
  });
});

// 3. Surprise Daily Deal Generator
apiRouter.get('/ai/surprise-deal', (_req: Request, res: Response) => {
  const products = db.getProducts();
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  const surpriseDiscounts = [25, 30, 35, 40];
  const discount = surpriseDiscounts[Math.floor(Math.random() * surpriseDiscounts.length)];
  const surpriseCode = `SECRET-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return res.json({
    product: randomProduct,
    discountPercentage: discount,
    promoCode: surpriseCode,
    expiresInMinutes: 45
  });
});
