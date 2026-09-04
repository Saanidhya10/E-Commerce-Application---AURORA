import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';

export default function ProductDetailModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product.id, quantity, product.name);
    setAdding(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Product Image */}
          <div
            style={{
              position: 'relative',
              minHeight: '360px',
              backgroundColor: '#0a0f1d',
              overflow: 'hidden',
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Product Info & Controls */}
          <div
            style={{
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-primary">{product.categoryName || 'Collection'}</span>
                {product.brand && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    by {product.brand}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '12px' }}>
                {product.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>4.9</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>(128 reviews)</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>•</div>
                <span style={{ color: product.stock > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '16px',
                }}
              >
                {formatCurrency(product.price)}
              </div>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}
              >
                {product.description}
              </p>

              {/* Guarantees */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <Truck size={16} color="var(--accent-cyan)" />
                  <span>Dispatched from Mumbai / Bengaluru hub within 24 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={16} color="var(--accent-emerald)" />
                  <span>Includes Official GST Invoice & 2-Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Quantity and CTA */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Quantity:</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '8px 14px', fontWeight: 600, fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock <= 0 || adding}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <ShoppingBag size={20} />
                <span>{adding ? 'Adding...' : `Add ${quantity} to Cart • ${formatCurrency(product.price * quantity)}`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
