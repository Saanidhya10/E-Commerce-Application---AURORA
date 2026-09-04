import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import { productApi } from './api/productApi';
import { categoryApi } from './api/categoryApi';
import { useAuth } from './context/AuthContext';
import { Sparkles, Compass } from 'lucide-react';

export default function App() {
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals & Views
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getAll(selectedCategory, searchTerm);
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenOrders={() => setOrderHistoryOpen(true)}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {isAdminView && isAdmin ? (
          <AdminDashboard categories={categories} onProductAdded={loadProducts} />
        ) : (
          <>
            {/* Hero & Category Filter */}
            <HeroBanner
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Product Catalog Grid */}
            <section style={{ padding: '32px 0 64px 0' }}>
              <div className="container">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Compass size={22} color="var(--accent-primary)" />
                    <h2 style={{ fontSize: '1.65rem', fontWeight: 700 }}>
                      {searchTerm
                        ? `Results for "${searchTerm}"`
                        : selectedCategory
                        ? categories.find((c) => c.id === selectedCategory)?.name || 'Collection'
                        : 'Featured Precision Gear'}
                    </h2>
                  </div>

                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Showing {products.length} products
                  </span>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                    <Sparkles size={36} color="var(--accent-primary)" style={{ margin: '0 auto 12px auto' }} />
                    <p style={{ fontSize: '1.05rem' }}>Loading curated collections...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div
                    className="glass-card"
                    style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}
                  >
                    <Compass size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ marginBottom: '8px' }}>No items found</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
                      We couldn't find any products matching your criteria. Try adjusting your search or category filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={setSelectedProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <footer
        className="glass"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '48px 0 24px 0',
          marginTop: 'auto',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '36px',
              marginBottom: '40px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={20} color="var(--accent-primary)" />
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                  }}
                >
                  AURORA
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Engineering precision, elevated everyday lifestyle, and timeless modern aesthetics.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: 'var(--text-primary)' }}>Collections</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li>Electronics & Audio</li>
                <li>Fashion & Eyewear</li>
                <li>Home & Living</li>
                <li>Sports & Outdoor</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: 'var(--text-primary)' }}>Customer Care</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li>Pan-India Express Delivery</li>
                <li>Track Order Status (Blue Dart / Delhivery)</li>
                <li>100% Genuine & BIS Certified</li>
                <li>24/7 Support Concierge</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: 'var(--text-primary)' }}>Payments & Trust</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6 }}>
                All prices inclusive of GST. Protected by 256-bit SSL encryption. Supporting UPI (GPay, PhonePe, Paytm), RuPay, Visa, and Mastercard.
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <div>© {new Date().getFullYear()} AURORA E-Commerce Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCompleted={() => loadProducts()}
      />

      <OrderHistoryModal
        isOpen={orderHistoryOpen}
        onClose={() => setOrderHistoryOpen(false)}
      />

      <AuthModal />
    </div>
  );
}
