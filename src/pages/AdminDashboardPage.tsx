import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  RefreshCw,
  Send,
  Tag
} from 'lucide-react';
import { Product, Order, SupportTicket, Coupon } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AdminDashboardProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'coupons' | 'tickets'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Product Add / Edit modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Neural & Audio');
  const [prodBrand, setProdBrand] = useState('Aetherion Labs');
  const [prodPrice, setProdPrice] = useState('299.99');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('349.99');
  const [prodStock, setProdStock] = useState('25');
  const [prodTagline, setProdTagline] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');

  // Coupon create modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('15');
  const [couponMinOrder, setCouponMinOrder] = useState('100');

  // Ticket reply in admin
  const [ticketReply, setTicketReply] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [anRes, prodRes, ordRes, coupRes, tktRes] = await Promise.all([
        fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/products?limit=100'),
        fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/coupons', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/support/tickets', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (anRes.ok) setAnalytics(await anRes.json());
      if (prodRes.ok) {
        const pData = await prodRes.json();
        setProducts(pData.products || []);
      }
      if (ordRes.ok) setOrders(await ordRes.json());
      if (coupRes.ok) setCoupons(await coupRes.json());
      if (tktRes.ok) setTickets(await tktRes.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-neutral-400">
          This portal requires verified administrative privileges. Use the "Demo Admin" button in the sign-in modal to evaluate.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Open modal to add product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Neural & Audio');
    setProdBrand('Aetherion Labs');
    setProdPrice('299.99');
    setProdOriginalPrice('349.99');
    setProdStock('25');
    setProdTagline('');
    setProdDescription('');
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdBrand(p.brand);
    setProdPrice(String(p.price));
    setProdOriginalPrice(String(p.originalPrice));
    setProdStock(String(p.stock));
    setProdTagline(p.tagline);
    setProdDescription(p.description);
    setProdImage(p.images[0]);
    setIsProductModalOpen(true);
  };

  // Save product (create or update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(prodPrice) || 99;
    const originalPrice = parseFloat(prodOriginalPrice) || price;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const payload = {
      name: prodName,
      tagline: prodTagline || 'Precision engineering grade hardware',
      description: prodDescription || 'Engineered with highest grade materials and certified specs.',
      category: prodCategory,
      categorySlug: prodCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: prodBrand,
      price,
      originalPrice,
      discountPercentage: discount,
      stock: parseInt(prodStock, 10) || 10,
      sku: `NX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      images: [prodImage],
      tags: [prodCategory.toLowerCase(), prodBrand.toLowerCase()],
      specifications: editingProduct ? editingProduct.specifications : [
        { group: 'General', items: [{ label: 'Certification', value: 'Lab Verified' }, { label: 'Warranty', value: '2 Years' }] }
      ],
      sustainability: {
        ecoScore: 'A' as const,
        materials: 'Recycled aerospace composite',
        recyclablePackaging: true,
        carbonNeutralShipping: true
      },
      shippingInfo: { estimatedDays: 2, freeShipping: true, shippingCost: 0 },
      seller: { name: `${prodBrand} Direct`, rating: 4.95, badge: 'Official Manufacturer' }
    };

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(editingProduct ? 'Product updated successfully' : 'New product published to catalog', 'success');
        setIsProductModalOpen(false);
        loadData();
      }
    } catch {
      showToast('Operation failed', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Product removed from catalog', 'info');
        loadData();
      }
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, note: `Status updated to ${status} by admin console` })
      });
      if (res.ok) {
        showToast(`Order status updated to ${status}`, 'success');
        loadData();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // Quick Restock Product
  const handleRestock = async (product: Product, addAmount: number) => {
    try {
      const newStock = product.stock + addAmount;
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        showToast(`Restocked ${product.name}: now ${newStock} units`, 'success');
        loadData();
      }
    } catch {
      showToast('Failed to restock', 'error');
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          description: couponDesc || `${couponDiscount}% promotional discount`,
          discountType: 'percentage',
          discountValue: parseFloat(couponDiscount) || 10,
          minOrderValue: parseFloat(couponMinOrder) || 50,
          expiresAt: '2027-12-31T23:59:59Z',
          usageLimit: 1000,
          isActive: true
        })
      });
      if (res.ok) {
        showToast(`Coupon ${couponCode} created!`, 'success');
        setIsCouponModalOpen(false);
        setCouponCode('');
        loadData();
      }
    } catch {
      showToast('Failed to create coupon', 'error');
    }
  };

  // Admin reply to support ticket
  const handleAdminTicketReply = async (ticketId: string) => {
    if (!ticketReply.trim()) return;
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: ticketReply.trim() })
      });
      if (res.ok) {
        showToast('Reply dispatched to customer', 'success');
        setTicketReply('');
        loadData();
      }
    } catch {
      showToast('Failed to reply', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold text-white font-heading">
              NEXORA Admin Command Center
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Global catalog control, logistics fulfillment, revenue analytics & inventory monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh database records"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAddProduct}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Analytics & Revenue' },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'inventory', label: 'Inventory & Restock' },
          { id: 'coupons', label: `Coupons (${coupons.length})` },
          { id: 'tickets', label: `Support Tickets (${tickets.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Analytics & Metrics */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-1">
              <span className="text-[11px] text-neutral-400 font-semibold uppercase">Gross Revenue</span>
              <div className="text-2xl font-bold text-cyan-400 font-heading">
                ${analytics.totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">↑ 18.4% this month</span>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-1">
              <span className="text-[11px] text-neutral-400 font-semibold uppercase">Total Orders</span>
              <div className="text-2xl font-bold text-white font-heading">
                {analytics.totalOrders}
              </div>
              <span className="text-[10px] text-neutral-500 font-medium">
                {analytics.pendingOrdersCount} awaiting dispatch
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-1">
              <span className="text-[11px] text-neutral-400 font-semibold uppercase">Avg Order Value</span>
              <div className="text-2xl font-bold text-white font-heading">
                ${analytics.avgOrderValue}
              </div>
              <span className="text-[10px] text-cyan-400 font-medium">Flagship weighted</span>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-1">
              <span className="text-[11px] text-neutral-400 font-semibold uppercase">Low Stock Alerts</span>
              <div className="text-2xl font-bold text-amber-400 font-heading">
                {analytics.lowStockCount}
              </div>
              <span className="text-[10px] text-amber-300 font-medium">Need replenishment</span>
            </div>
          </div>

          {/* Sales Breakdown by Category & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Category */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sales Volume by Division
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.salesByCategory || {}).map(([cat, data]: any) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">{cat}</span>
                      <span className="text-cyan-400 font-semibold">${data.revenue.toFixed(2)} ({data.count} units)</span>
                    </div>
                    <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (data.revenue / (analytics.totalRevenue || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Performing Hardware Models
              </h3>
              <div className="space-y-3">
                {analytics.topProducts?.map((tp: any, idx: number) => (
                  <div key={tp.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-400 font-bold">#{idx + 1}</span>
                      <span className="text-neutral-200 font-medium truncate max-w-[200px]">{tp.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">${tp.revenue.toFixed(2)}</div>
                      <div className="text-[10px] text-neutral-500">{tp.sold} units dispatched</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Management CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">Total catalog inventory: {products.length} models</span>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Brand</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-neutral-950 shrink-0" />
                      <div className="min-w-0 max-w-[220px]">
                        <div className="font-semibold text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-neutral-500">{p.sku}</div>
                      </div>
                    </td>
                    <td className="p-3.5 text-neutral-300">{p.category}</td>
                    <td className="p-3.5 text-neutral-300">{p.brand}</td>
                    <td className="p-3.5 font-bold text-cyan-400">${p.price.toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className={`font-semibold ${p.stock <= 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-300">{p.rating}★ ({p.reviewCount})</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/40 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Order</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Update Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{order.orderNumber}</div>
                      <div className="text-[10px] text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-neutral-200">{order.customerName}</div>
                      <div className="text-[10px] text-neutral-500">{order.customerEmail}</div>
                    </td>
                    <td className="p-3.5 font-bold text-cyan-400">${order.grandTotal.toFixed(2)}</td>
                    <td className="p-3.5 text-neutral-300 uppercase">{order.deliveryMethod}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300'
                          : order.status === 'Cancelled'
                          ? 'bg-rose-950 text-rose-300'
                          : 'bg-cyan-950 text-cyan-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={order.status}
                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value as any)}
                        className="bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-[11px] text-white"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Inventory & Restock */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/60 flex items-center gap-3 text-xs text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Inventory Replenishment Monitor</span>
              <p className="text-[11px] text-amber-400/80">
                Products with 15 or fewer units trigger automated restock warnings to prevent backorders.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5 text-right">Immediate Restock Injection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {products
                  .filter(p => p.stock <= 20)
                  .map(p => (
                    <tr key={p.id} className="hover:bg-neutral-900/50">
                      <td className="p-3.5 font-semibold text-white">{p.name}</td>
                      <td className="p-3.5 text-neutral-400">{p.category}</td>
                      <td className="p-3.5">
                        <span className={`font-bold ${p.stock <= 10 ? 'text-rose-400' : 'text-amber-400'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleRestock(p, 10)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-xs font-semibold"
                        >
                          +10 Units
                        </button>
                        <button
                          onClick={() => handleRestock(p, 25)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-xs font-semibold"
                        >
                          +25 Units
                        </button>
                        <button
                          onClick={() => handleRestock(p, 50)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold"
                        >
                          +50 Batch
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Coupons Management */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400">Active promotional discounts</span>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
            >
              + Create New Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map(c => (
              <div key={c.id} className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-cyan-400 font-mono">{c.code}</span>
                  <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950">
                    {c.discountValue}% OFF
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{c.description}</p>
                <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-500 flex justify-between">
                  <span>Min Order: ${c.minOrderValue}</span>
                  <span>Used: {c.timesUsed} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Customer Support Dispatch */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs text-neutral-400 font-semibold block mb-1">Customer Inquiries</span>
            {tickets.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedTicketId === t.id ? 'bg-cyan-950/40 border-cyan-500' : 'bg-neutral-900/40 border-neutral-800'
                }`}
              >
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span className="font-mono text-cyan-400 font-bold">{t.ticketNumber}</span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">{t.status}</span>
                </div>
                <h4 className="text-xs font-semibold text-white mt-1">{t.subject}</h4>
                <p className="text-[11px] text-neutral-500 mt-1">From: {t.userName} ({t.userEmail})</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex flex-col h-[500px]">
            {selectedTicketId ? (
              (() => {
                const tkt = tickets.find(t => t.id === selectedTicketId);
                if (!tkt) return null;
                return (
                  <>
                    <div className="pb-3 border-b border-neutral-800">
                      <h3 className="text-sm font-bold text-white">{tkt.subject}</h3>
                      <p className="text-[11px] text-neutral-400">{tkt.userName} · {tkt.category}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 space-y-3">
                      {tkt.messages.map(m => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-2xl text-xs space-y-1 ${
                            m.senderRole === 'admin'
                              ? 'bg-cyan-950/60 border border-cyan-800 text-white ml-auto max-w-[80%]'
                              : 'bg-neutral-950 border border-neutral-800 text-neutral-200 mr-auto max-w-[80%]'
                          }`}
                        >
                          <div className="text-[10px] text-neutral-400 font-semibold">{m.senderName}</div>
                          <p>{m.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write official technician response..."
                        value={ticketReply}
                        onChange={e => setTicketReply(e.target.value)}
                        className="flex-1 p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                      />
                      <button
                        onClick={() => handleAdminTicketReply(tkt.id)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-neutral-500">
                Select a ticket on the left to review communication thread.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Hardware Model'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="Neural & Audio">Neural & Audio</option>
                    <option value="Smart Wearables">Smart Wearables</option>
                    <option value="Ambient & Smart Home">Ambient & Smart Home</option>
                    <option value="Cyber & Modular EDC">Cyber & Modular EDC</option>
                    <option value="Ergonomic Workstations">Ergonomic Workstations</option>
                    <option value="Optics & Visual Tech">Optics & Visual Tech</option>
                    <option value="Autonomous Drones & Bots">Autonomous Drones & Bots</option>
                    <option value="Clean Energy & Power">Clean Energy & Power</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={e => setProdBrand(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={e => setProdPrice(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodOriginalPrice}
                    onChange={e => setProdOriginalPrice(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={e => setProdStock(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={prodTagline}
                  onChange={e => setProdTagline(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={e => setProdImage(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
                >
                  {editingProduct ? 'Save Updates' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Create New Coupon</h4>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white uppercase font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Discount %</label>
                <input
                  type="number"
                  required
                  value={couponDiscount}
                  onChange={e => setCouponDiscount(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Min Order Value ($)</label>
                <input
                  type="number"
                  required
                  value={couponMinOrder}
                  onChange={e => setCouponMinOrder(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
