import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export const QuickAddModal = ({ product, onClose }) => {
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      api.getProductBySlug(product.slug).then((res) => {
        if (res.variants) {
          setVariants(res.variants);
          if (res.variants.length > 0) {
            setSelectedColor(res.variants[0].color_name);
            setSelectedSize(res.variants[0].size);
          }
        }
        setLoading(false);
      });
    }
  }, [product]);

  if (!product) return null;

  // Extract unique colors & sizes
  const uniqueColors = Array.from(
    new Map(variants.map((v) => [v.color_name, { name: v.color_name, hex: v.color_hex }])).values()
  );

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const currentVariant = variants.find(
    (v) => v.color_name === selectedColor && v.size === selectedSize
  );

  const handleAdd = () => {
    if (currentVariant) {
      addToCart(currentVariant.id, 1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-obsidian-900 border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-4 mb-6">
          <img
            src={product.primary_image}
            alt={product.name}
            className="w-20 h-24 object-cover rounded-xl border border-obsidian-700"
          />
          <div>
            <span className="text-[10px] tracking-widest text-gold-500 font-bold uppercase">{product.category_name}</span>
            <h3 className="text-base font-semibold text-white mt-1">{product.name}</h3>
            <p className="text-sm font-bold text-gold-400 mt-1">₹{product.price?.toLocaleString()}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-gray-400">Loading variant inventory...</div>
        ) : (
          <div className="space-y-5">
            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Color: <span className="text-gold-400 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {uniqueColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      selectedColor === c.name
                        ? 'border-gold-500 bg-gold-500/10 text-white font-medium'
                        : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-gray-600" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Select Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((s) => {
                  const match = variants.find((v) => v.color_name === selectedColor && v.size === s);
                  const isAvailable = match && match.stock_quantity > 0;
                  const isLow = match && match.stock_quantity > 0 && match.stock_quantity <= 5;

                  return (
                    <button
                      key={s}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(s)}
                      className={`relative py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedSize === s
                          ? 'border-gold-500 bg-gold-500 text-obsidian-950 font-bold'
                          : isAvailable
                          ? 'border-obsidian-700 bg-obsidian-850 text-gray-200 hover:border-gold-500/50'
                          : 'border-obsidian-800 bg-obsidian-950 text-gray-600 cursor-not-allowed line-through'
                      }`}
                    >
                      {s}
                      {isLow && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-obsidian-950 text-[8px] font-bold px-1 rounded-full">
                          Low
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Availability Alert */}
            {currentVariant && (
              <div className="text-xs text-gray-400">
                {currentVariant.stock_quantity > 0 ? (
                  currentVariant.stock_quantity <= 5 ? (
                    <span className="text-amber-400 font-medium">⚠️ Only {currentVariant.stock_quantity} left in stock for this size!</span>
                  ) : (
                    <span className="text-emerald-400">✓ In Stock ({currentVariant.stock_quantity} available)</span>
                  )
                ) : (
                  <span className="text-rose-400 font-medium">✕ Out of stock for this variant</span>
                )}
              </div>
            )}

            {/* Add to Bag Button */}
            <button
              disabled={!currentVariant || currentVariant.stock_quantity <= 0}
              onClick={handleAdd}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-obsidian-800 disabled:text-gray-600 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
