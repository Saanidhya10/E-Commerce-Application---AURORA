import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }

    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, productName = 'Item') => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your cart', 'info');
      openAuthModal('login');
      return false;
    }

    try {
      const res = await cartApi.addItem(productId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        showToast(`Added ${productName} to your cart!`);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to add item to cart', 'error');
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const res = await cartApi.updateQuantity(cartItemId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await cartApi.removeItem(cartItemId);
      if (res.success && res.data) {
        setCart(res.data);
        showToast('Item removed from cart');
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart({ items: [], totalAmount: 0 });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const totalItemCount = (cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
