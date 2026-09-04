import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    closeAuthModal,
    login,
    register,
    loginDemo,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (authModalTab === 'login') {
      await login(email, password);
    } else {
      await register(name, email, password);
    }

    setSubmitting(false);
  };

  const handleDemoLogin = async (role) => {
    setSubmitting(true);
    await loginDemo(role);
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '32px' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
              {authModalTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {authModalTab === 'login'
                ? 'Sign in to access your bag, orders, and saved addresses'
                : 'Join AURORA to unlock express checkout and member perks'}
            </p>
          </div>

          <button
            onClick={closeAuthModal}
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

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setAuthModalTab('login')}
            className={`btn btn-sm ${authModalTab === 'login' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1 }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthModalTab('register')}
            className={`btn btn-sm ${authModalTab === 'register' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1 }}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authModalTab === 'register' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  required
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ marginTop: '8px', width: '100%' }}
          >
            <span>{submitting ? 'Please wait...' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '10px',
            }}
          >
            <Sparkles size={14} color="var(--accent-primary)" />
            <span>Instant One-Click Demo Access:</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              disabled={submitting}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '8px' }}
            >
              Demo Customer (India)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={submitting}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '8px' }}
            >
              <Shield size={14} color="var(--accent-primary)" />
              Demo Admin (India)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
