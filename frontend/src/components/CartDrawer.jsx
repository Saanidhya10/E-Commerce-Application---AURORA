import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';

export default function CartDrawer({ onProceedToCheckout }) {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, totalItemCount } = useCart();

  if (!isCartOpen) return null;

  const items = cart?.items || [];
  const totalAmount = Number(cart?.totalAmount || 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 10, 19, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={closeCart}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Bag</h3>
            <span className="badge badge-primary">{totalItemCount} items</span>
          </div>

          <button
            onClick={closeCart}
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Items Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={28} color="var(--text-muted)" />
              </div>
              <h4 style={{ color: 'var(--text-primary)' }}>Your bag is empty</h4>
              <p style={{ fontSize: '0.88rem', maxWidth: '240px' }}>
                Explore our curated collections and add your favorite items.
              </p>
              <button
                onClick={closeCart}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '8px' }}
              >
                Explore Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: '#070a13',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"
                    alt={item.productName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.productName}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      style={{
                        color: 'var(--text-muted)',
                        padding: '4px',
                        cursor: 'pointer',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-rose)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatCurrency(item.price)}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        background: 'rgba(15, 23, 42, 0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        style={{ padding: '4px 8px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        style={{ padding: '4px 8px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Checkout Action */}
        {items.length > 0 && (
          <div
            style={{
              padding: '24px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(15, 23, 42, 0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formatCurrency(totalAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Express Shipping</span>
              <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>FREE</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total</span>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--accent-primary)',
                }}
              >
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <button
              onClick={() => {
                closeCart();
                onProceedToCheckout();
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
