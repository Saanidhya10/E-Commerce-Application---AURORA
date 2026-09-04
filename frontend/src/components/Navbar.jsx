import React, { useState } from 'react';
import { ShoppingBag, Search, User, Shield, Package, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenOrders,
  isAdminView,
  setIsAdminView,
}) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { totalItemCount, openCart } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setIsAdminView(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AURORA
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '-4px',
              }}
            >
              LIFESTYLE & TECH
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        {!isAdminView && (
          <div
            style={{
              flex: 1,
              maxWidth: '520px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
            />
            <input
              type="text"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search premium electronics, fashion, gear..."
              style={{
                paddingLeft: '42px',
                paddingRight: '14px',
                height: '44px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(15, 23, 42, 0.6)',
              }}
            />
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Admin Portal Toggle */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className={isAdminView ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Shield size={16} />
              <span>{isAdminView ? 'Customer Store' : 'Admin Portal'}</span>
            </button>
          )}

          {/* Cart Trigger */}
          {!isAdminView && (
            <button
              onClick={openCart}
              className="btn btn-secondary"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-full)',
                padding: '10px 16px',
              }}
            >
              <ShoppingBag size={18} />
              <span>Cart</span>
              {totalItemCount > 0 && (
                <span
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '4px',
                    boxShadow: '0 0 10px var(--accent-primary-glow)',
                  }}
                >
                  {totalItemCount}
                </span>
              )}
            </button>
          )}

          {/* Auth Menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn btn-secondary"
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.88rem',
                  }}
                >
                  {user.email.split('@')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Signed in as</div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user.email}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-primary' : 'badge-success'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenOrders();
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <Package size={16} />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="btn btn-danger btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: '4px',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
