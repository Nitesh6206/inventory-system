import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { ShoppingBag, Users, ClipboardList, TrendingUp, ArrowUpRight, Package } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      api.get('/products'),
      api.get('/customers'),
      api.get('/orders'),
    ])
      .then(([products, customers, orders]) => {
        if (cancelled) return;
        const totalRevenue = orders.data.reduce(
          (sum, o) => sum + (parseFloat(o.total) || 0),
          0
        );
        setStats({
          products: products.data.length,
          customers: customers.data.length,
          orders: orders.data.length,
          revenue: totalRevenue,
          recentOrders: orders.data.slice(-5).reverse(),
        });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const statCards = [
    {
      label: 'Total Revenue',
      value: stats ? `₹${stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—',
      icon: TrendingUp,
      color: 'from-violet-500/20 to-violet-600/5',
      iconColor: 'text-violet-400',
      border: 'border-violet-500/20',
      badge: '+12.5%',
    },
    {
      label: 'Total Orders',
      value: stats?.orders ?? '—',
      icon: ClipboardList,
      color: 'from-sky-500/20 to-sky-600/5',
      iconColor: 'text-sky-400',
      border: 'border-sky-500/20',
      badge: '+8.2%',
    },
    {
      label: 'Customers',
      value: stats?.customers ?? '—',
      icon: Users,
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconColor: 'text-emerald-400',
      border: 'border-emerald-500/20',
      badge: '+3.1%',
    },
    {
      label: 'Products',
      value: stats?.products ?? '—',
      icon: Package,
      color: 'from-amber-500/20 to-amber-600/5',
      iconColor: 'text-amber-400',
      border: 'border-amber-500/20',
      badge: 'Active',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-xl border ${card.border} bg-gradient-to-br ${card.color} backdrop-blur-sm p-5 group hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-slate-800/60 ${card.iconColor}`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium text-slate-300 bg-slate-700/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowUpRight size={11} />
                  {card.badge}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white tracking-tight">
                  {isLoading
                    ? <span className="animate-pulse bg-slate-700 rounded w-16 h-8 inline-block" />
                    : card.value}
                </p>
                <p className="text-sm text-slate-400 mt-1">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          </div>
          <span className="text-xs text-slate-500">Last 5 orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider">Order</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Customer</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Total</th>
                <th className="text-center text-xs text-slate-500 font-medium px-4 py-3 uppercase tracking-wider">Status</th>
                <th className="text-right text-xs text-slate-500 font-medium px-6 py-3 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-700/30">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-700/60 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : stats?.recentOrders?.map((order) => (
                    <tr key={order.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-300">#{String(order.id).padStart(4, '0')}</td>
                      <td className="px-4 py-4 text-slate-300">Customer #{order.customer_id}</td>
                      <td className="px-4 py-4 text-right font-semibold text-white">
                        ₹{parseFloat(order.total).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && (!stats?.recentOrders || stats.recentOrders.length === 0) && (
            <div className="text-center py-12 text-slate-500 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}