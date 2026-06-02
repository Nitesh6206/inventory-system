import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { UserPlus, Users, Mail, Phone, MapPin, Search, ChevronRight } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  // ── fetch customers ─────────────────────────────────────────────
  const fetchCustomers = useCallback(() => {
    setIsLoading(true);
    api
      .get('/customers')
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setIsLoading(false));
  }, []);


  console.log('Customers:', customers);
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ── create customer ─────────────────────────────────────────────
  const handleSubmit = (e) => {

    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    e.preventDefault();
    setIsSaving(true);

    api
      .post('/customers', form)
      .then(() => {
        toast.success('Customer added successfully');
        fetchCustomers();
        setForm({ name: '', email: '', phone: '', address: '' });
        setShowForm(false);
      })
      .catch((err) => toast.error(err.response?.data?.detail || 'Failed to create customer'))
      .finally(() => setIsSaving(false));
  };

  // ── helpers ─────────────────────────────────────────────────────
  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) =>
    name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const avatarColor = (name) => {
    const colors = [
      'bg-violet-500/20 text-violet-300',
      'bg-sky-500/20 text-sky-300',
      'bg-emerald-500/20 text-emerald-300',
      'bg-amber-500/20 text-amber-300',
      'bg-rose-500/20 text-rose-300',
    ];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Customers</h1>
          <p className="text-sm text-slate-400 mt-1">{customers.length} total customers</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          <UserPlus size={15} />
          Add Customer
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <UserPlus size={15} className="text-violet-400" />
            New Customer
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Full Name *</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Email Address *</label>
              <input
                type="email"
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Phone</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Address</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                placeholder="Bengaluru, Karnataka"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {isSaving ? 'Adding...' : 'Add Customer'}
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

      {/* Search + Table */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/60 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-colors"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-slate-500 ml-auto flex items-center gap-1.5">
            <Users size={13} />
            {filtered.length} results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider">Customer</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Contact</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Location</th>
                <th className="text-right text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-700/30">
                      {[1, 2, 3, 4].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div
                            className="h-4 bg-slate-700/60 rounded animate-pulse"
                            style={{ width: `${60 + j * 10}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(customer.name)}`}>
                            {initials(customer.name)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{customer.name}</p>
                            <p className="text-xs text-slate-500">ID #{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="text-slate-300 flex items-center gap-1.5 text-xs">
                            <Mail size={11} className="text-slate-500" />
                            {customer.email}
                          </p>
                          {customer.phone && (
                            <p className="text-slate-400 flex items-center gap-1.5 text-xs">
                              <Phone size={11} className="text-slate-500" />
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {customer.address ? (
                          <p className="text-slate-400 text-xs flex items-center gap-1.5">
                            <MapPin size={11} className="text-slate-500 flex-shrink-0" />
                            {customer.address}
                          </p>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight
                          size={15}
                          className="text-slate-600 group-hover:text-slate-400 transition-colors ml-auto"
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No customers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}