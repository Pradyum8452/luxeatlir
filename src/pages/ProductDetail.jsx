import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck, Ruler, ChevronDown, ChevronUp, Play, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { ProductCard } from '../components/ProductCard';
import { useToast } from '../context/ToastContext';

export const ProductDetail = ({ slug, onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState('specs');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      api
        .getProductBySlug(slug)
        .then((res) => {
          if (res.product) {
            setData(res);
            if (res.images && res.images.length > 0) {
              setSelectedImg(res.images[0].image_url);
            }
            if (res.variants && res.variants.length > 0) {
              setSelectedColor(res.variants[0].color_name);
              setSelectedSize(res.variants[0].size);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-gray-400 space-y-3">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading Product Detail...</p>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="py-20 text-center text-gray-400">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <button onClick={() => onNavigate('Catalog')} className="mt-4 text-gold-400 hover:underline">Return to Catalog</button>
      </div>
    );
  }

  const { product, images, variants, related, reviews } = data;
  const wishlisted = isWishlisted(product.id);

  // Extract unique colors
  const uniqueColors = Array.from(
    new Map(variants.map((v) => [v.color_name, { name: v.color_name, hex: v.color_hex }])).values()
  );

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const currentVariant = variants.find(
    (v) => v.color_name === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = async () => {
    if (!currentVariant) {
      addToast('Please select color and size variant', 'error');
      return;
    }
    await addToCart(currentVariant.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!currentVariant) {
      addToast('Please select color and size variant', 'error');
      return;
    }
    const res = await addToCart(currentVariant.id, quantity);
    if (res.success) {
      onNavigate('Checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Top Product Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* IMAGE GALLERY COLUMN */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-obsidian-900 rounded-2xl overflow-hidden border border-obsidian-700 shadow-2xl">
            <img
              src={selectedImg || product.primary_image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 bg-gold-500 text-obsidian-950 font-bold text-xs tracking-widest px-3 py-1 rounded-full uppercase">
                {product.discount_percent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full glass-panel ${
                wishlisted ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images && images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImg(img.image_url)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImg === img.image_url ? 'border-gold-500 scale-105' : 'border-obsidian-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT SPECIFICATIONS COLUMN */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-gold-500 font-mono tracking-[0.2em] uppercase mb-1">
              <span>{product.category_name} • {product.gender}</span>
              <span className="text-gray-500">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating || 4.9}</span>
              <span className="text-xs text-gray-400">({reviews ? reviews.length : 14} verified reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 py-3 border-y border-obsidian-800">
            <span className="text-3xl font-bold text-white">₹{product.price?.toLocaleString()}</span>
            {product.mrp > product.price && (
              <span className="text-lg text-gray-500 line-through">₹{product.mrp?.toLocaleString()}</span>
            )}
            <span className="text-xs text-gold-400 font-semibold">(Inclusive of 12% GST)</span>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Color: <span className="text-gold-400 font-normal">{selectedColor}</span>
            </label>
            <div className="flex items-center gap-2">
              {uniqueColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                    selectedColor === c.name
                      ? 'border-gold-500 bg-gold-500/10 text-white font-semibold'
                      : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-600" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Size: <span className="text-gold-400 font-normal">{selectedSize}</span>
              </label>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-gold-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {sizes.map((s) => {
                const match = variants.find((v) => v.color_name === selectedColor && v.size === s);
                const isAvailable = match && match.stock_quantity > 0;

                return (
                  <button
                    key={s}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === s
                        ? 'border-gold-500 bg-gold-500 text-obsidian-950 shadow-lg'
                        : isAvailable
                        ? 'border-obsidian-700 bg-obsidian-850 text-gray-200 hover:border-gold-500/50'
                        : 'border-obsidian-850 bg-obsidian-950 text-gray-600 cursor-not-allowed line-through'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Message Alert */}
          {currentVariant && (
            <div className="text-xs">
              {currentVariant.stock_quantity > 0 ? (
                currentVariant.stock_quantity <= 5 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Hurry! Only {currentVariant.stock_quantity} left in stock for {selectedColor} ({selectedSize}).</span>
                  </div>
                ) : (
                  <span className="text-emerald-400 font-medium">✓ In Stock & Ready to Dispatch</span>
                )
              ) : (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-medium">
                  ✕ Out of Stock for selected size.
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector & CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-4">
              <div className="flex items-center border border-obsidian-700 rounded-xl bg-obsidian-850 px-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-white p-1.5 font-bold text-base">-</button>
                <span className="px-4 text-xs font-bold text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-white p-1.5 font-bold text-base">+</button>
              </div>

              <button
                disabled={!currentVariant || currentVariant.stock_quantity <= 0}
                onClick={handleAddToCart}
                className="flex-1 bg-gold-500 hover:bg-gold-400 disabled:bg-obsidian-800 disabled:text-gray-600 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            <button
              disabled={!currentVariant || currentVariant.stock_quantity <= 0}
              onClick={handleBuyNow}
              className="w-full bg-obsidian-800 hover:bg-obsidian-700 border border-gold-500/40 text-gold-400 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors"
            >
              Buy Now with Express Checkout
            </button>
          </div>

          {/* Accordion Specs Tabs */}
          <div className="pt-6 border-t border-obsidian-800 space-y-3">
            {/* Specs & Fabric */}
            <div className="border border-obsidian-700 rounded-xl overflow-hidden bg-obsidian-850">
              <button
                onClick={() => setOpenTab(openTab === 'specs' ? '' : 'specs')}
                className="w-full p-4 text-left text-xs font-bold text-white uppercase tracking-wider flex justify-between items-center"
              >
                <span>Material, Fabric & Silhouette Fit</span>
                {openTab === 'specs' ? <ChevronUp className="w-4 h-4 text-gold-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {openTab === 'specs' && (
                <div className="p-4 text-xs text-gray-300 space-y-2 border-t border-obsidian-700 font-light leading-relaxed">
                  <p>• <strong>Composition:</strong> {product.material || '100% Organic Heavyweight Cotton'}</p>
                  <p>• <strong>Fabrication:</strong> {product.fabric || '300 GSM French Terry'}</p>
                  <p>• <strong>Fit:</strong> {product.fit || 'Oversized Boxy Silhouette'}</p>
                  <p className="pt-2">{product.description}</p>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="border border-obsidian-700 rounded-xl overflow-hidden bg-obsidian-850">
              <button
                onClick={() => setOpenTab(openTab === 'care' ? '' : 'care')}
                className="w-full p-4 text-left text-xs font-bold text-white uppercase tracking-wider flex justify-between items-center"
              >
                <span>Garment Care Instructions</span>
                {openTab === 'care' ? <ChevronUp className="w-4 h-4 text-gold-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {openTab === 'care' && (
                <div className="p-4 text-xs text-gray-300 space-y-1.5 border-t border-obsidian-700 font-light">
                  <p>{product.care_instructions || 'Machine wash cold inside out with like colors. Line dry in shade. Do not tumble dry. Low iron if needed.'}</p>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="border border-obsidian-700 rounded-xl overflow-hidden bg-obsidian-850">
              <button
                onClick={() => setOpenTab(openTab === 'shipping' ? '' : 'shipping')}
                className="w-full p-4 text-left text-xs font-bold text-white uppercase tracking-wider flex justify-between items-center"
              >
                <span>Shipping & 15-Day Exchange Guarantee</span>
                {openTab === 'shipping' ? <ChevronUp className="w-4 h-4 text-gold-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {openTab === 'shipping' && (
                <div className="p-4 text-xs text-gray-300 space-y-2 border-t border-obsidian-700 font-light">
                  <p>• <strong>Dispatch:</strong> Orders placed before 2:00 PM are dispatched same day.</p>
                  <p>• <strong>Delivery:</strong> 3-5 business days across India.</p>
                  <p>• <strong>Exchanges:</strong> Free 15-day size or color exchange pickup from your doorstep.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related && related.length > 0 && (
        <section className="pt-10 border-t border-obsidian-800">
          <h3 className="font-serif text-2xl font-bold text-white tracking-wide mb-6">Complete the Look (Related Styles)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(s) => onNavigate('ProductDetail', { slug: s })}
                onQuickAdd={() => {}}
              />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal Popup */}
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}

    </div>
  );
};
