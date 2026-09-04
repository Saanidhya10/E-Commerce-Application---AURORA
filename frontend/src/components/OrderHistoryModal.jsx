import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatCurrency } from '../utils/format';

export default function OrderHistoryModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getUserOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered</span>;
      case 'SHIPPED':
        return <span className="badge badge-primary">Shipped</span>;
      case 'PROCESSING':
        return <span className="badge badge-warning">Processing</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', padding: '32px' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Your Orders</h2>
          </div>
          <button
            onClick={onClose}
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

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Package size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
              <h4>No orders found</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                Your order history will show up here once you make your first purchase.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '10px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order ID</span>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>#{order.orderId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Date</span>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Line Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {(order.items || []).map((item) => (
                    <div
                      key={item.orderItemId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span>
                        {item.productName} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                      </span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total & Payment */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.95rem',
                  }}
                >
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Payment: <span style={{ color: 'var(--text-secondary)' }}>{order.paymentStatus}</span>
                  </span>
                  <div>
                    <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>Total:</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
