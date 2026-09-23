import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickAddModal } from '../components/QuickAddModal';

export const Catalog = ({ initialParams = {}, onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [gender, setGender] = useState(initialParams.gender || 'All');
  const [category, setCategory] = useState(initialParams.category || '');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [fit, setFit] = useState('');
  const [search, setSearch] = useState(initialParams.search || '');
  const [sort, setSort] = useState(initialParams.collection || 'newest');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedQuickAddProduct, setSelectedQuickAddProduct] = useState(null);

  const fetchCatalog = () => {
    setLoading(true);
    const params = {
      gender: gender !== 'All' ? gender : '',
      category,
      size,
      color,
      fit,
      search,
      sort,
      maxPrice: maxPrice < 25000 ? maxPrice : ''
    };

    api
      .getProducts(params)
      .then((res) => {
        if (Array.isArray(res)) setProducts(res);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.getCategories().then((res) => Array.isArray(res) && setCategories(res));
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [gender, category, size, color, fit, search, sort, maxPrice]);

  const resetFilters = () => {
    setGender('All');
    setCategory('');
    setSize('');
    setColor('');
    setFit('');
    setSearch('');
    setSort('newest');
    setMaxPrice(25000);
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const colors = ['Black', 'White', 'Beige', 'Charcoal', 'Champagne', 'Indigo', 'Emerald', 'Navy'];
  const fits = ['Oversized', 'Relaxed', 'Slim', 'Tailored', 'Straight', 'Bias Cut'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-obsidian-800 pb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
            {gender !== 'All' ? `${gender}'s Apparel` : 'Full Fashion Catalog'}
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Displaying {products.length} luxury haute couture pieces
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-obsidian-850 border border-obsidian-700 text-xs text-white placeholder-gray-500 rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:border-gold-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
          </div>

          {/* Sort Selector */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-obsidian-850 border border-obsidian-700 text-xs text-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-gold-500"
          >
            <option value="newest">Sort by: Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="bestsellers">Best Sellers</option>
            <option value="discount">Highest Discount</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden bg-obsidian-850 border border-obsidian-700 p-2 rounded-xl text-gray-300 flex items-center gap-1 text-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className={`md:block space-y-6 glass-panel p-6 rounded-2xl border border-obsidian-700 h-fit ${showMobileFilters ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between border-b border-obsidian-700 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Refine Filters</h3>
            </div>
            <button onClick={resetFilters} className="text-[11px] text-gold-400 hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['All', 'Men', 'Women', 'Unisex'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-1.5 px-3 rounded-lg border text-center transition-all ${
                    gender === g
                      ? 'border-gold-500 bg-gold-500/10 text-white font-bold'
                      : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-gold-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Size Matrix</label>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(size === s ? '' : s)}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${
                    size === s
                      ? 'border-gold-500 bg-gold-500 text-obsidian-950 font-bold'
                      : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Color Palette</label>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(color === c ? '' : c)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                    color === c
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-bold'
                      : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Fit Silhouette</label>
            <div className="flex flex-wrap gap-1.5">
              {fits.map((f) => (
                <button
                  key={f}
                  onClick={() => setFit(fit === f ? '' : f)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                    fit === f
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-bold'
                      : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              <span>Max Price</span>
              <span className="text-gold-400">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold-500 bg-obsidian-800"
            />
          </div>
        </aside>

        {/* MAIN PRODUCT GRID */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="py-20 text-center text-sm text-gray-400 space-y-3">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Fetching Luxe Atelier Catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center glass-panel rounded-2xl border border-obsidian-700 p-8 space-y-4">
              <Filter className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">No Products Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No luxury apparel pieces match your selected filter criteria. Try resetting filters or adjusting search keywords.
              </p>
              <button
                onClick={resetFilters}
                className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={(slug) => onNavigate('ProductDetail', { slug })}
                  onQuickAdd={(p) => setSelectedQuickAddProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Quick Add Modal Popup */}
      {selectedQuickAddProduct && (
        <QuickAddModal
          product={selectedQuickAddProduct}
          onClose={() => setSelectedQuickAddProduct(null)}
        />
      )}

    </div>
  );
};
