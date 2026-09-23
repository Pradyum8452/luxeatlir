import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product, onSelect, onQuickAdd }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product.id);

  return (
    <div
      className="group relative bg-obsidian-850 rounded-2xl border border-obsidian-700/60 overflow-hidden transition-all duration-300 hover:border-gold-500/40 hover:shadow-2xl flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Box */}
      <div className="relative aspect-[3/4] bg-obsidian-900 overflow-hidden cursor-pointer" onClick={() => onSelect(product.slug)}>
        <img
          src={isHovered && product.secondary_image ? product.secondary_image : product.primary_image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discount_percent > 0 && (
          <div className="absolute top-3 left-3 bg-gold-500 text-obsidian-950 font-bold text-[10px] tracking-widest px-2.5 py-1 rounded-full uppercase shadow-md">
            {product.discount_percent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full glass-panel transition-all ${
            wishlisted ? 'text-rose-500 bg-obsidian-950' : 'text-gray-300 hover:text-rose-400'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay Bar on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="flex-1 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-semibold text-xs py-2.5 rounded-xl shadow-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product.slug);
            }}
            className="bg-obsidian-950/90 hover:bg-obsidian-950 text-gray-200 p-2.5 rounded-xl border border-obsidian-700 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="uppercase tracking-widest text-gold-500 font-medium">{product.category_name}</span>
            <div className="flex items-center gap-1 text-gold-400">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating || 4.9}</span>
            </div>
          </div>

          <h3
            onClick={() => onSelect(product.slug)}
            className="font-medium text-sm text-gray-100 group-hover:text-gold-400 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{product.fit || 'Tailored Fit'}</p>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((c, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-gray-600 shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-gray-500 font-medium">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-obsidian-700/60">
          <span className="text-base font-bold text-white">₹{product.price?.toLocaleString()}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-500 line-through">₹{product.mrp?.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};
