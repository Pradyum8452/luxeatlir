import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistIds(new Set());
      setWishlistItems([]);
      return;
    }
    try {
      const items = await api.getWishlist();
      if (Array.isArray(items)) {
        setWishlistItems(items);
        setWishlistIds(new Set(items.map((i) => i.id)));
      }
    } catch (e) {
      console.error('Wishlist error:', e);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      addToast('Please login to save items to your wishlist', 'info');
      return false;
    }
    try {
      const res = await api.toggleWishlist(productId);
      if (res.added) {
        addToast('Saved to your wishlist', 'success');
      } else {
        addToast('Removed from wishlist', 'info');
      }
      await fetchWishlist();
      return res.added;
    } catch (e) {
      addToast('Failed to update wishlist', 'error');
      return false;
    }
  };

  const isWishlisted = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        isWishlisted,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
