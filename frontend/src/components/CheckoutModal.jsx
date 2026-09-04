import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, CreditCard, Banknote, ShieldCheck, MapPin, Plus, ArrowRight, Zap } from 'lucide-react';
import { addressApi } from '../api/addressApi';
import { orderApi } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';

export default function CheckoutModal({ isOpen, onClose, onOrderCompleted }) {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // New Address Form
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
      setCompletedOrder(null);
    }
  }, [isOpen]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressApi.getUserAddresses();
      if (res.success && res.data) {
        setAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddressId(res.data[0].id);
        } else {
          setShowAddAddress(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.addressLine1 || !newAddress.city) {
      showToast('Please fill in required address fields', 'error');
      return;
    }

    try {
      const res = await addressApi.addAddress(newAddress);
      if (res.success && res.data) {
        showToast('Address saved');
        setAddresses((prev) => [...prev, res.data]);
        setSelectedAddressId(res.data.id);
        setShowAddAddress(false);
        setNewAddress({
          fullName: '',
          phoneNumber: '',
          addressLine1: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'United States',
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && addresses.length > 0) {
      showToast('Please select a shipping address', 'error');
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await orderApi.createOrder(selectedAddressId, paymentMethod);
      if (res.success && res.data) {
        setCompletedOrder(res.data);
        await clearCart();
        showToast('Order confirmed and placed successfully!');
        if (onOrderCompleted) onOrderCompleted();
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '32px' }}
      >
        {/* Modal Header */}
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
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>
            {completedOrder ? 'Order Confirmed' : 'Checkout & Payment'}
          </h2>
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

        {/* Order Completed Confirmation State */}
        {completedOrder ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={40} color="var(--accent-emerald)" />
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Thank you for your order!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
              Your order <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>#{completedOrder.orderId}</span> has been placed and is being prepared.
            </p>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '28px',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Order Status:</span>
                <span className="badge badge-success">{completedOrder.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Payment Status:</span>
                <span className="badge badge-primary">{completedOrder.paymentStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Total Paid:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatCurrency(completedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <button onClick={onClose} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {/* Step 1: Shipping Address Selection */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--accent-cyan)" />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Shipping Address</h4>
                </div>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--accent-primary)', gap: '4px' }}
                  >
                    <Plus size={14} />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {showAddAddress ? (
                <form
                  onSubmit={handleSaveAddress}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        required
                        placeholder="Aarav Sharma"
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newAddress.phoneNumber}
                        onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                        required
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label className="form-label">Street / Apartment / Society *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      required
                      placeholder="Flat 402, Palm Heights, Outer Ring Road"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                        placeholder="Bengaluru"
                      />
                    </div>
                    <div>
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="Karnataka"
                      />
                    </div>
                    <div>
                      <label className="form-label">PIN Code</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        placeholder="560103"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {addresses.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      No saved addresses found. Please add a new shipping address.
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${selectedAddressId === addr.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          background: selectedAddressId === addr.id ? 'rgba(99, 102, 241, 0.08)' : 'rgba(30, 41, 59, 0.3)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                        }}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          style={{ marginTop: '4px', accentColor: 'var(--accent-primary)' }}
                        />
                        <div style={{ fontSize: '0.9rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {addr.fullName} • {addr.phoneNumber}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CreditCard size={18} color="var(--accent-primary)" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Payment Method</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: Zap },
                  { id: 'CARD', label: 'Cards (RuPay / Visa / MC)', icon: CreditCard },
                  { id: 'COD', label: 'Cash on Delivery (Pay on Delivery)', icon: Banknote },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${paymentMethod === item.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: paymentMethod === item.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(30, 41, 59, 0.4)',
                      color: paymentMethod === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <item.icon size={20} color={paymentMethod === item.id ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary Line */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items ({cart?.items?.length || 0}):</span>
                <span>{formatCurrency(cart?.totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Express Delivery:</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>FREE</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                }}
              >
                <span>Total:</span>
                <span style={{ color: 'var(--accent-primary)' }}>{formatCurrency(cart?.totalAmount)}</span>
              </div>
            </div>

            {/* Submit Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || (!selectedAddressId && addresses.length === 0)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>{placingOrder ? 'Processing Order...' : `Pay & Place Order • ${formatCurrency(cart?.totalAmount)}`}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
