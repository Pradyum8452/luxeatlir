import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Star, Award, TrendingUp, ChevronRight, Eye } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickAddModal } from '../components/QuickAddModal';

export const Home = ({ onNavigate }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedQuickAddProduct, setSelectedQuickAddProduct] = useState(null);

  useEffect(() => {
    api.getCategories().then((res) => Array.isArray(res) && setCategories(res));
    api.getProducts({ collection: 'new' }).then((res) => Array.isArray(res) && setNewArrivals(res.slice(0, 8)));
    api.getProducts({ collection: 'bestsellers' }).then((res) => Array.isArray(res) && setBestSellers(res.slice(0, 8)));
  }, []);

  const featuredCollections = [
    { title: "Men's Collection", gender: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop" },
    { title: "Women's Couture", gender: "Women", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop" },
    { title: "Unisex Essentials", gender: "Unisex", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop" }
  ];

  const customerReviews = [
    { name: "Vikramaditya S.", location: "Mumbai", review: "The 300 GSM Obsidian Heavyweight Tee has an unparalleled drape. Tailoring quality rivals top Milanese fashion houses.", rating: 5, item: "Obsidian Heavyweight Tee" },
    { name: "Ananya R.", location: "Bengaluru", review: "The Sculpted Satin Midi Dress fit like it was custom made for me. Flawless fabric quality and elegant packaging.", rating: 5, item: "Atelier Satin Midi Dress" },
    { name: "Rohan M.", location: "Delhi", review: "Selvedge denim crafted with true Japanese loom precision. Rigid yet breaks in beautifully. Highly recommended.", rating: 5, item: "Japanese Selvedge Jeans" }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-obsidian-800">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop"
            alt="Haute Couture Hero"
            className="w-full h-full object-cover object-center brightness-[0.4] scale-105 transition-transform duration-10000 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-6 z-10 pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-gold-500/30 text-gold-400 text-xs uppercase tracking-[0.25em] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn / Winter 2026 Collection</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-wider leading-tight">
            ELEGANCE REFINED. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-white to-gold-600 font-normal italic">
              UNCOMPROMISED QUALITY.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Crafted from 300 GSM French Terry, 14.5 oz Japanese shuttle-loom denim, and pure mulberry silk. Designed for the modern purist.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('Catalog', { gender: 'Men' })}
              className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Shop Men</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('Catalog', { gender: 'Women' })}
              className="bg-obsidian-850/90 hover:bg-obsidian-800 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl border border-gold-500/40 transition-all flex items-center gap-2"
            >
              <span>Shop Women</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">CURATED SELECTION</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide mt-1">Featured Collections</h2>
          </div>
          <button
            onClick={() => onNavigate('Catalog')}
            className="text-xs text-gold-400 hover:text-white uppercase tracking-widest flex items-center gap-1 mt-4 md:mt-0 font-medium"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCollections.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('Catalog', { gender: item.gender })}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer border border-obsidian-700/60 shadow-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-300 mt-1">Discover Haute Couture</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS CAROUSEL/GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-obsidian-800 pb-4">
          <div>
            <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">JUST DROPPED</span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-wide mt-1">New Arrivals</h2>
          </div>
          <button
            onClick={() => onNavigate('Catalog', { collection: 'new' })}
            className="text-xs text-gold-400 hover:text-white uppercase tracking-widest"
          >
            View New Drops →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={(slug) => onNavigate('ProductDetail', { slug })}
              onQuickAdd={(p) => setSelectedQuickAddProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* BRAND STORY & PHILOSOPHY */}
      <section className="bg-obsidian-850 border-y border-obsidian-700/80 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">HERITAGE & CRAFTSMANSHIP</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              THE ART OF UNCOMPROMISING TAILORING.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Founded on the belief that clothing should be a physical manifestation of quiet luxury, Luxe Atelier shuns mass production. Every garment is handcrafted in limited batches using shuttle-loom selvages, long-staple organic cottons, and Tuscan vegetable-tanned leathers.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-obsidian-700">
              <div>
                <h4 className="text-2xl font-serif font-bold text-gold-400">100% Organic</h4>
                <p className="text-xs text-gray-400 mt-1">Certified sustainable textiles</p>
              </div>
              <div>
                <h4 className="text-2xl font-serif font-bold text-gold-400">Limited Batch</h4>
                <p className="text-xs text-gray-400 mt-1">Numbered production runs</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop"
              alt="Atelier Craftsmanship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* BEST SELLERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-obsidian-800 pb-4">
          <div>
            <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">MOST COVETED</span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-wide mt-1">Best Sellers</h2>
          </div>
          <button
            onClick={() => onNavigate('Catalog', { collection: 'bestsellers' })}
            className="text-xs text-gold-400 hover:text-white uppercase tracking-widest"
          >
            View All Best Sellers →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={(slug) => onNavigate('ProductDetail', { slug })}
              onQuickAdd={(p) => setSelectedQuickAddProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">DISCOVER BY CATEGORY</span>
          <h2 className="font-serif text-3xl font-bold text-white tracking-wide mt-1">Explore Every Silhouette</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('Catalog', { category: cat.slug })}
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-obsidian-700/60 shadow-lg"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-obsidian-950/60 group-hover:bg-obsidian-950/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                <h3 className="font-serif text-base font-bold text-white group-hover:text-gold-400 transition-colors">{cat.name}</h3>
                <span className="text-[10px] text-gold-500 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Shop Now</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">CLIENT TESTIMONIALS</span>
          <h2 className="font-serif text-3xl font-bold text-white tracking-wide mt-1">Verified Patron Reviews</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev, idx) => (
            <div key={idx} className="bg-obsidian-850 p-6 rounded-2xl border border-obsidian-700 space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-gold-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">"{rev.review}"</p>
              <div className="pt-2 border-t border-obsidian-700/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{rev.name}</p>
                  <p className="text-[10px] text-gray-500">{rev.location}</p>
                </div>
                <span className="text-[10px] bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded-full font-mono">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK ADD MODAL POPUP */}
      {selectedQuickAddProduct && (
        <QuickAddModal
          product={selectedQuickAddProduct}
          onClose={() => setSelectedQuickAddProduct(null)}
        />
      )}

    </div>
  );
};
