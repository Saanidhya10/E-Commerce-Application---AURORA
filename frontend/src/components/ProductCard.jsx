import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (adding) return;

    setAdding(true);
    const success = await addToCart(product.id, 1, product.name);
    setAdding(false);

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="glass-card"
      onClick={() => onQuickView(product)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Product Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '85%',
          overflow: 'hidden',
          backgroundColor: '#0a0f1d',
        }}
      >
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-smooth)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Brand Tag */}
        {product.brand && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {product.brand}
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span
            className="badge badge-danger"
            style={{ position: 'absolute', top: '12px', right: '12px' }}
          >
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span
            className="badge badge-warning"
            style={{ position: 'absolute', top: '12px', right: '12px' }}
          >
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div
        style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {product.categoryName || 'Curated Item'}
            </span>

            {/* Simulated Star Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                4.9
              </span>
            </div>
          </div>

          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              marginBottom: '8px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5rem',
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              marginBottom: '14px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.45,
            }}
          >
            {product.description}
          </p>
        </div>

        {/* Pricing & Add Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Price</div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {formatCurrency(product.price)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
            style={{
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              fontSize: '0.88rem',
            }}
          >
            {added ? (
              <>
                <Check size={16} color="var(--accent-emerald)" />
                <span>Added</span>
              </>
            ) : adding ? (
              <span>Adding...</span>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
