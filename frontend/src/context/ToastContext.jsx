import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: toast.type === 'error' ? 'rgba(30, 20, 30, 0.95)' : 'rgba(20, 30, 45, 0.95)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
              boxShadow: 'var(--shadow-lg)',
              backdropFilter: 'blur(16px)',
              color: '#fff',
              fontSize: '0.92rem',
              fontWeight: 500,
              minWidth: '280px',
              maxWidth: '420px',
              animation: 'slideUp 0.25s ease-out'
            }}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={20} color="var(--accent-rose)" />
            ) : toast.type === 'info' ? (
              <Info size={20} color="var(--accent-cyan)" />
            ) : (
              <CheckCircle2 size={20} color="var(--accent-emerald)" />
            )}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'var(--text-muted)', display: 'flex', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
