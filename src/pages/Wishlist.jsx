import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

export const Wishlist = ({ onNavigate }) => {
  const { wishlistItems, toggleWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-obsidian-800 pb-4">
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Saved Wishlist ({wishlistItems.length})</h1>
        <p className="text-xs text-gray-400 mt-1">Your curated selection of haute couture favorites</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-obsidian-700 p-8 space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-400">Save your favorite pieces while browsing our fashion catalog.</p>
          <button
            onClick={() => onNavigate('Catalog')}
            className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={(slug) => onNavigate('ProductDetail', { slug })}
              onQuickAdd={() => onNavigate('ProductDetail', { slug: prod.slug })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
