import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { ShoppingBag, Plus, X, Trash2, ChevronDown, ClipboardList } from 'lucide-react';

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: 1 }],
  });
  const [showForm, setShowForm] = useState(false);

  // ── fetch products (needed for order form) ──────────────────────
  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'));
  }, []);

  // ── fetch customers (needed for order form) ─────────────────────
  useEffect(() => {
    api
      .get('/customers')
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error('Failed to load customers'));
  }, []);

  // ── fetch orders ────────────────────────────────────────────────
  const fetchOrders = useCallback(() => {
    setIsLoading(true);
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── create order ────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customer_id) return toast.error('Please select a customer');
    setIsSubmitting(true);

    api
      .post('/orders', form)
      .then(() => {
        toast.success('Order placed successfully!');
        // refresh both orders and products (stock changed)
        fetchOrders();
        api.get('/products').then((res) => setProducts(res.data));
        setForm({ customer_id: '', items: [{ product_id: '', quantity: 1 }] });
        setShowForm(false);
      })
      .catch((err) => toast.error(err.response?.data?.detail || 'Failed to create order'))
      .finally(() => setIsSubmitting(false));
  };

  // ── item helpers ────────────────────────────────────────────────
  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1 }],
    }));

  const removeItem = (index) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const getCustomerName = (id) => {
    const c = customers.find((c) => c.id == id);
    return c ? c.name : `Customer #${id}`;
  };

  const orderTotal = form.items.reduce((sum, item) => {
    const product = products.find((p) => p.id == item.product_id);
    return sum + (product ? parseFloat(product.price) * item.quantity : 0);
  }, 0);

  const statusConfig = {
    completed: { label: 'Completed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    pending:   { label: 'Pending',   color: 'text-amber-400 bg-amber-400/10 border-amber-400/20'   },
    cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20'         },
  };

  const getStatus = (status) =>
    statusConfig[status?.toLowerCase()] || {
      label: status,
      color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Close' : 'New Order'}
        </button>
      </div>

      {/* Create Order Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <ShoppingBag size={15} className="text-violet-400" />
            Create New Order
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Select */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Customer *</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors pr-10"
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  required
                >
                  <option value="" className="bg-slate-900">Select a customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.name} — {c.email}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400 font-medium">Order Items *</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus size={12} />
                  Add item
                </button>
              </div>

              <div className="space-y-2">
                {form.items.map((item, index) => {
                  const selectedProduct = products.find((p) => p.id == item.product_id);
                  return (
                    <div key={index} className="flex gap-3 items-start bg-slate-900/40 border border-slate-700/40 rounded-lg p-3">
                      <div className="flex-1 relative">
                        <select
                          className="w-full appearance-none bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors pr-8"
                          value={item.product_id}
                          onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                          required
                        >
                          <option value="" className="bg-slate-900">Select product...</option>
                          {products.map((p) => (
                            <option
                              key={p.id}
                              value={p.id}
                              className="bg-slate-900"
                              disabled={p.stock === 0}
                            >
                              {p.name} — ₹{p.price} (Stock: {p.stock})
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          max={selectedProduct?.stock || 999}
                          className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          required
                        />
                      </div>

                      {selectedProduct && (
                        <div className="w-24 py-2 text-right">
                          <span className="text-sm font-semibold text-white">
                            ₹{(parseFloat(selectedProduct.price) * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={form.items.length === 1}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Order Total */}
              {orderTotal > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                  <span className="text-sm text-slate-400">Estimated Total</span>
                  <span className="text-lg font-bold text-white">
                    ₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    Place Order
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 text-sm text-slate-400 hover:text-white border border-slate-700/60 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-700/60">
          <ClipboardList size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-white">All Orders</h2>
          <span className="ml-auto text-xs text-slate-500">{orders.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider">Order ID</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Customer</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Total</th>
                <th className="text-center text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Status</th>
                <th className="text-right text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider">Date</th>
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
                : [...orders].reverse().map((order) => {
                    const status = getStatus(order.status);
                    return (
                      <tr key={order.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-slate-300">#{String(order.id).padStart(4, '0')}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                              {getCustomerName(order.customer_id).charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-300">{getCustomerName(order.customer_id)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-white">
                          ₹{parseFloat(order.total).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full ${status.color}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500 text-xs">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!isLoading && orders.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}