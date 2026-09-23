import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const fetchCart = async () => {
    try {
      const res = await api.getCart();
      if (res && res.items) {
        setCart(res);
      }
    } catch (e) {
      console.error('Fetch cart error:', e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (variantId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await api.addToCart(variantId, quantity);
      if (res.success) {
        await fetchCart();
        addToast('Added to bag successfully!', 'success');
        setIsOpen(true); // Open drawer automatically
        return { success: true };
      } else {
        addToast(res.error || 'Failed to add item', 'error');
        return { success: false, error: res.error };
      }
    } catch (err) {
      addToast('Error adding item to bag', 'error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.updateCartItem(itemId, quantity);
      if (res.success) {
        await fetchCart();
      } else {
        addToast(res.error || 'Cannot update quantity', 'error');
      }
    } catch (e) {
      addToast('Failed to update quantity', 'error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.removeCartItem(itemId);
      await fetchCart();
      addToast('Item removed from bag', 'info');
    } catch (e) {
      addToast('Failed to remove item', 'error');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
