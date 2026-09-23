import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit3, Trash2, Search, Check, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Add Product
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [gender, setGender] = useState('Men');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [fabric, setFabric] = useState('');
  const [fit, setFit] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Variant Matrix Form
  const [colorName, setColorName] = useState('Obsidian Black');
  const [colorHex, setColorHex] = useState('#0B0B0E');
  const [stockQuantity, setStockQuantity] = useState(15);

  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchProducts = () => {
    setLoading(true);
    Promise.all([api.getProducts(), api.getCategories()]).then(([pRes, cRes]) => {
      if (Array.isArray(pRes)) setProducts(pRes);
      if (Array.isArray(cRes)) setCategories(cRes);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!sku || !name || !price) {
      addToast('SKU, Name, and Price are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      const variants = sizes.map((s) => ({
        color_name: colorName,
        color_hex: colorHex,
        size: s,
        stock_quantity: Number(stockQuantity)
      }));

      const res = await api.createProduct({
        sku,
        name,
        category_id: categoryId,
        gender,
        description,
        material,
        fabric,
        fit,
        care_instructions: careInstructions,
        price: Number(price),
        mrp: Number(mrp || price),
        images: [imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
        variants
      });

      if (res.success) {
        addToast(`Product ${name} created with color/size stock matrix!`, 'success');
        setShowAddModal(false);
        fetchProducts();
      } else {
        addToast(res.error || 'Failed to create product', 'error');
      }
    } catch (err) {
      addToast('Error creating product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to discontinue this product?')) {
      await api.deleteProduct(id);
      addToast('Product discontinued', 'info');
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-obsidian-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Product Catalog & Variant Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">Publish new haute couture collections and configure variant stock matrix</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Gender</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">MRP</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-obsidian-850/50 transition-colors">
                <td className="py-3.5 px-4 font-mono text-gray-400">{p.sku}</td>
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                  <img src={p.primary_image} alt={p.name} className="w-8 h-10 object-cover rounded border border-obsidian-700" />
                  <span>{p.name}</span>
                </td>
                <td className="py-3.5 px-4 text-gray-300">{p.category_name}</td>
                <td className="py-3.5 px-4 text-gray-400">{p.gender}</td>
                <td className="py-3.5 px-4 font-bold text-white">₹{p.price?.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-gray-500 line-through">₹{p.mrp?.toLocaleString()}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button onClick={() => handleDelete(p.id)} className="text-rose-400 hover:text-rose-300 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-obsidian-700 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Create New Apparel Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">SKU Number *</label>
                  <input type="text" required placeholder="LUXE-TSH-999" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Product Name *</label>
                  <input type="text" required placeholder="Cashmere Zip Hoodie" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Category *</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Gender *</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Selling Price (₹) *</label>
                  <input type="number" required placeholder="4999" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">MRP (₹) *</label>
                  <input type="number" required placeholder="7999" value={mrp} onChange={(e) => setMrp(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Image URL</label>
                <input type="url" placeholder="https://images.unsplash.com/photo-..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Material</label>
                  <input type="text" placeholder="100% Organic Heavyweight Cotton" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Fit Silhouette</label>
                  <input type="text" placeholder="Oversized Boxy Fit" value={fit} onChange={(e) => setFit(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                </div>
              </div>

              <div className="border-t border-obsidian-800 pt-3 space-y-2">
                <h4 className="font-bold text-gold-400 uppercase tracking-wider">Initial Variant Matrix (All Sizes XS-XXXL)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" placeholder="Color Name" value={colorName} onChange={(e) => setColorName(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                  <input type="text" placeholder="Color Hex (#000000)" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                  <input type="number" placeholder="Initial Stock Qty" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest"
              >
                {submitting ? 'Publishing...' : 'Publish Product to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
