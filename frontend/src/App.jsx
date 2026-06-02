import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const PAGE_META = {
  dashboard: {
    title: 'Dashboard',
    sub: "Welcome back — here's what's happening today.",
  },
  products: {
    title: 'Products',
    sub: 'Manage your inventory and product catalogue.',
  },
  customers: {
    title: 'Customers',
    sub: 'View and manage your customer accounts.',
  },
  orders: {
    title: 'Orders',
    sub: 'Track and process incoming orders.',
  },
};

const PAGES = {
  dashboard: Dashboard,
  products: Products,
  customers: Customers,
  orders: Orders,
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const meta = PAGE_META[activeTab];
  const PageComponent = PAGES[activeTab];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-shell">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="app-main">
          {/* Header */}
          <header className="topbar">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="topbar-title">
                {meta.title}
              </h1>

              <div className="topbar-separator" />

              <span className="topbar-sub hidden md:block">
                {meta.sub}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="topbar-date hidden sm:block">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>

              <div className="status-pill">
                <span className="status-dot" />
                Live
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="app-content">
            <div
              className="content-inner"
              key={activeTab}
            >
              <PageComponent />
            </div>
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: '#0f1623',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e2e8f0',
            fontSize: '13px',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;