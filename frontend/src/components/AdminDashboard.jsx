import React, { useState, useEffect } from 'react';
import { Shield, DollarSign, ShoppingBag, Package, Users, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { orderApi } from '../api/orderApi';
import { productApi } from '../api/productApi';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';

export default function AdminDashboard({ categories, onProductAdded }) {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addProduct'
  const [loading, setLoading] = useState(false);

  // New Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    brand: '',
    categoryId: categories[0]?.id || '',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        adminApi.getDashboardStats(),
        orderApi.getAllOrders(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await orderApi.updateStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order #${orderId} status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10),
        imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        brand: productForm.brand,
        categoryId: parseInt(productForm.categoryId, 10),
      };

      const res = await productApi.create(payload);
      if (res.success) {
        showToast(`Product "${productForm.name}" created successfully!`);
        setProductForm({
          name: '',
          description: '',
          price: '',
          stock: '',
          imageUrl: '',
          brand: '',
          categoryId: categories[0]?.id || '',
        });
        if (onProductAdded) onProductAdded();
        loadDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="container">
        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Shield size={22} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Operations Portal</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Real-time platform revenue metrics, customer orders, and catalog management.
            </p>
          </div>

          <button onClick={loadDashboardData} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Top Analytics Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '36px',
          }}
        >
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Revenue</span>
              <DollarSign size={20} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats ? formatCurrency(stats.totalRevenue) : '₹0.00'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
              From delivered & placed orders
            </div>
          </div>

          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</span>
              <ShoppingBag size={20} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats ? stats.totalOrders : 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
              {stats ? `${stats.pendingOrders} pending fulfillment` : 'All time orders'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Catalog</span>
              <Package size={20} color="var(--accent-primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats ? stats.totalProducts : 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Products in stock
            </div>
          </div>

          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customers</span>
              <Users size={20} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats ? stats.totalUsers : 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Registered accounts
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addProduct')}
            className={`btn ${activeTab === 'addProduct' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === 'orders' && (
          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <th style={{ padding: '12px 14px' }}>ORDER ID</th>
                  <th style={{ padding: '12px 14px' }}>DATE</th>
                  <th style={{ padding: '12px 14px' }}>ITEMS</th>
                  <th style={{ padding: '12px 14px' }}>AMOUNT</th>
                  <th style={{ padding: '12px 14px' }}>PAYMENT</th>
                  <th style={{ padding: '12px 14px' }}>STATUS & ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.orderId}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <td style={{ padding: '16px 14px', fontWeight: 600 }}>#{order.orderId}</td>
                      <td style={{ padding: '16px 14px', color: 'var(--text-secondary)' }}>
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Recent'}
                      </td>
                      <td style={{ padding: '16px 14px', color: 'var(--text-secondary)' }}>
                        {order.items?.length || 0} items
                      </td>
                      <td style={{ padding: '16px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td style={{ padding: '16px 14px' }}>
                        <span className="badge badge-primary">{order.paymentStatus}</span>
                      </td>
                      <td style={{ padding: '16px 14px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                          style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-medium)',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Add Product Form */}
        {activeTab === 'addProduct' && (
          <div className="glass-card" style={{ maxWidth: '640px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add Product to Catalog</h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  placeholder="e.g. Wireless Gaming Mouse"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                  placeholder="Comprehensive description of materials, specifications, and features..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    placeholder="2499.00"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                    placeholder="50"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-input"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. Razer"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px' }}>
                <Plus size={18} />
                <span>Create & Publish Product</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
