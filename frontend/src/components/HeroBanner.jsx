import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export default function HeroBanner({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div style={{ padding: '36px 0 24px 0' }}>
      <div className="container">
        {/* Main Promo Glass Card */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-hero)',
            border: '1px solid var(--border-subtle)',
            padding: '48px 40px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '280px',
              height: '280px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'var(--accent-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <Zap size={14} />
              <span>FESTIVE MEGA SALE • UP TO 40% OFF</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                marginBottom: '16px',
                lineHeight: 1.15,
              }}
            >
              Curated Precision for the{' '}
              <span
                style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Modern Explorer
              </span>
            </h1>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                marginBottom: '28px',
                lineHeight: 1.6,
              }}
            >
              Discover high-performance audio, everyday luxury watches, artisanal home gear,
              and fitness technology designed for uncompromising quality.
            </p>

            {/* Value Propositions */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <Truck size={18} color="var(--accent-cyan)" />
                <span>Free Express Delivery Across India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                <span>100% Genuine & BIS Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <RefreshCw size={18} color="var(--accent-amber)" />
                <span>7-Day Easy Returns & Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            padding: '24px 4px 8px 4px',
            scrollbarWidth: 'none',
          }}
        >
          <button
            onClick={() => onSelectCategory(null)}
            className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', whiteSpace: 'nowrap' }}
          >
            All Collections
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', whiteSpace: 'nowrap' }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
