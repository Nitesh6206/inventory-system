import { useState } from "react";

const LayoutDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const OrdersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const BoxesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/>
    <path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/>
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/>
    <path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/>
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/>
    <path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>
  </svg>
);

const MENU = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { id: "products",  label: "Products",  icon: PackageIcon,      badge: null },
  { id: "customers", label: "Customers", icon: UsersIcon,         badge: null },
  { id: "orders",    label: "Orders",    icon: OrdersIcon,        badge: "3"  },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sidebar-root {
          font-family: 'DM Sans', sans-serif;
          width: ${collapsed ? "72px" : "240px"};
          min-height: 100vh;
          background: #080c14;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
        }

        /* subtle grid texture */
        .sidebar-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .sidebar-logo-area {
          padding: 20px 16px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          min-height: 64px;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6d5aff, #a78bfa);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(109,90,255,0.35);
        }
        .logo-text {
          opacity: ${collapsed ? 0 : 1};
          transform: ${collapsed ? "translateX(-8px)" : "translateX(0)"};
          transition: opacity 200ms ease, transform 200ms ease;
          white-space: nowrap;
          overflow: hidden;
        }
        .logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #fff;
          letter-spacing: -0.3px;
          line-height: 1;
        }
        .logo-sub {
          font-size: 10px;
          color: #475569;
          margin-top: 2px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* collapse toggle */
        .collapse-btn {
          position: absolute;
          top: 20px;
          right: -12px;
          width: 24px;
          height: 24px;
          background: #0f1623;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: color 150ms, background 150ms, box-shadow 150ms;
          z-index: 10;
        }
        .collapse-btn:hover {
          color: #fff;
          background: #1e293b;
          box-shadow: 0 0 0 3px rgba(109,90,255,0.2);
        }

        /* nav */
        .sidebar-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .nav-section-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #334155;
          padding: 8px 8px 4px;
          white-space: nowrap;
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          height: ${collapsed ? "0px" : "auto"};
          transition: opacity 180ms ease;
        }
        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: ${collapsed ? "11px" : "10px 12px"};
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 160ms ease;
          color: #64748b;
          background: transparent;
          text-align: left;
          white-space: nowrap;
          justify-content: ${collapsed ? "center" : "flex-start"};
        }
        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
          border-color: rgba(255,255,255,0.06);
        }
        .nav-item.active {
          background: rgba(109,90,255,0.15);
          color: #a78bfa;
          border-color: rgba(109,90,255,0.25);
        }
        .nav-item.active .nav-icon {
          color: #a78bfa;
        }
        /* active left bar */
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 25%;
          height: 50%;
          width: 3px;
          background: #6d5aff;
          border-radius: 0 2px 2px 0;
        }
        .nav-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          color: inherit;
        }
        .nav-label {
          font-size: 13.5px;
          font-weight: 500;
          opacity: ${collapsed ? 0 : 1};
          transform: ${collapsed ? "translateX(-6px)" : "translateX(0)"};
          transition: opacity 180ms ease, transform 180ms ease;
          flex: 1;
          overflow: hidden;
        }
        .nav-badge {
          background: #6d5aff;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 20px;
          line-height: 16px;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 150ms ease;
          flex-shrink: 0;
        }

        /* tooltip on collapsed */
        .nav-tooltip {
          display: none;
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e293b;
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          border: 1px solid rgba(255,255,255,0.08);
          z-index: 100;
        }
        .nav-tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #1e293b;
        }
        .collapsed-mode .nav-item:hover .nav-tooltip {
          display: block;
        }

        /* bottom user */
        .sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 150ms;
          justify-content: ${collapsed ? "center" : "flex-start"};
        }
        .user-row:hover { background: rgba(255,255,255,0.05); }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: linear-gradient(135deg, #1e3a5f, #2d5a8a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #93c5fd;
          flex-shrink: 0;
          border: 1px solid rgba(147,197,253,0.15);
        }
        .user-info {
          opacity: ${collapsed ? 0 : 1};
          transform: ${collapsed ? "translateX(-6px)" : "translateX(0)"};
          transition: opacity 180ms ease, transform 180ms ease;
          overflow: hidden;
          min-width: 0;
        }
        .user-name {
          font-size: 12.5px;
          font-weight: 500;
          color: #cbd5e1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role {
          font-size: 10px;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(34,197,94,0.5);
          margin-left: auto;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 150ms;
        }
      `}</style>

      <div className={`sidebar-root ${collapsed ? "collapsed-mode" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo-area">
          <div className="logo-icon">
            <BoxesIcon />
          </div>
          <div className="logo-text">
            <div className="logo-name">InvManage</div>
            <div className="logo-sub">Inventory System</div>
          </div>

          {/* Collapse toggle */}
          <button className="collapse-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand" : "Collapse"}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>

          {MENU.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              className={`nav-item ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
              {/* tooltip only visible when collapsed */}
              <span className="nav-tooltip">{label}{badge ? ` (${badge})` : ""}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-row">
            <div className="avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">admin@store.com</div>
            </div>
            <div className="status-dot" title="Online" />
          </div>
        </div>
      </div>
    </>
  );
}