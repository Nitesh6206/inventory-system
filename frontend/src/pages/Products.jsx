import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { Edit2, Trash2, Package, Plus, X, Search, AlertTriangle } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: '',
    sku: '',
    price: '',
    stock: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── fetch products ──────────────────────────────────────────────
  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── create / update ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!form.name || !form.price || !form.stock || !form.sku) {
      toast.error('Name, price, stock and SKU are required');
      return;
    }

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    const request = form.id
      ? api.put(`/products/${form.id}`, payload)
      : api.post('/products', payload);

    request
      .then(() => {
        toast.success(isEditing ? 'Product updated!' : 'Product created!');
        fetchProducts();
        resetForm();
      })
      .catch((err) => toast.error(err.response?.data?.detail || 'Failed to create product'))
      .finally(() => setIsSaving(false));
  };

  // ── delete ──────────────────────────────────────────────────────
  const handleDelete = (id) => {
    setIsDeleting(true);
    api
      .delete(`/products/${id}`)
      .then(() => {
        toast.success('Product deleted');
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      })
      .catch(() => toast.error('Failed to delete product'))
      .finally(() => setIsDeleting(false));
  };

  // ── helpers ─────────────────────────────────────────────────────
  const editProduct = (product) => {
    setForm(product);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ id: null, name: '', sku: '', price: '', stock: '', description: '' });
    setIsEditing(false);
    setShowForm(false);
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const stockBadge = (stock) => {
    if (stock === 0) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (stock < 10) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Products</h1>
          <p className="text-sm text-slate-400 mt-1">{products.length} products in inventory</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); if (isEditing) resetForm(); }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          {showForm && !isEditing ? <X size={15} /> : <Plus size={15} />}
          {showForm && !isEditing ? 'Close' : 'New Product'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <Package size={15} className="text-violet-400" />
            {isEditing ? 'Edit Product' : 'New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Product Name *</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">SKU *</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors font-mono"
                placeholder="e.g. WH-001"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Price (₹) *</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Stock Quantity *</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Description</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="Brief product description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {isSaving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 text-sm text-slate-400 hover:text-white border border-slate-700/60 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/60 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-slate-500 ml-auto">{filtered.length} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider">Product</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">SKU</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Price</th>
                <th className="text-center text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Stock</th>
                <th className="text-right text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-700/30">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-700/60 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((p) => (
                    <tr key={p.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                            <Package size={16} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{p.name}</p>
                            {p.description && (
                              <p className="text-xs text-slate-500 truncate max-w-[200px]">{p.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-slate-400 bg-slate-700/40 px-2 py-1 rounded">{p.sku}</span>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-white">
                        ₹{parseFloat(p.price).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium border px-2.5 py-1 rounded-full ${stockBadge(p.stock)}`}>
                          {p.stock === 0 && <AlertTriangle size={10} />}
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {deleteConfirm === p.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-slate-400">Delete?</span>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={isDeleting}
                              className="text-xs text-red-400 hover:text-red-300 font-medium disabled:opacity-50"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => editProduct(p)}
                              className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Package size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}