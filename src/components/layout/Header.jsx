import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const {
    role,
    setIsLoggedIn,
    isSidePanelOpen,
    setIsSidePanelOpen,
    isLogoMenuOpen,
    setIsLogoMenuOpen,
    hasNewAnnouncements,
    unreadHrMessages,
  } = useApp();

  const isHR = role === 'hr';
  const logoMenuRef = useRef(null);

  // Close logo menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (logoMenuRef.current && !logoMenuRef.current.contains(e.target)) {
        setIsLogoMenuOpen(false);
      }
    }
    if (isLogoMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isLogoMenuOpen, setIsLogoMenuOpen]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLogoMenuOpen(false);
  };

  const menuItems = [
    {
      icon: '👤',
      label: 'Account Preferences',
      id: 'menu-account',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: '⚙️',
      label: 'Settings',
      id: 'menu-settings',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: '🔒',
      label: 'Change Password',
      id: 'menu-password',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: null,
      label: null,
      divider: true,
    },
    {
      icon: '🚪',
      label: 'Logout',
      id: 'menu-logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Badge count for right panel button
  const panelBadgeCount = isHR ? unreadHrMessages : 0;

  return (
    <header
      className="fixed top-0 left-0 right-0 glass-card-static flex items-center justify-between px-6 py-3"
      style={{
        zIndex: 50,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        backdropFilter: 'blur(30px)',
      }}
    >
      {/* ── Left: Collapsible Logo ── */}
      <div className="relative" ref={logoMenuRef}>
        <button
          id="logo-menu-trigger"
          aria-label="Open account menu"
          aria-expanded={isLogoMenuOpen}
          onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
          className="flex items-center gap-3 group cursor-pointer select-none rounded-xl px-2 py-1 transition-all duration-200 hover:bg-white/[0.06]"
        >
          {/* Logo orb */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold animate-pulse-glow flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #7c3aed)' }}
          >
            S
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-tight leading-tight">
              <span className="gradient-text">Smooth Operators</span>
            </h1>
            <p className="text-[10px] text-text-muted tracking-widest uppercase">
              Spatial Dashboard
            </p>
          </div>

          {/* Chevron */}
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted transition-transform duration-300 hidden sm:block"
            style={{
              transform: isLogoMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isLogoMenuOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-56 glass-card-static animate-fade-in-up overflow-hidden"
            style={{
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
              zIndex: 200,
            }}
            id="logo-dropdown-menu"
          >
            {/* User info header */}
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base border-2"
                  style={{ borderColor: 'rgba(0, 245, 255, 0.4)' }}
                >
                  {isHR ? '🛡️' : '🧑‍💻'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">
                    {isHR ? 'HR Admin' : 'Alex Morgan'}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {isHR ? 'hr@gmail.com' : 'employee@gmail.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1.5">
              {menuItems.map((item, i) => {
                if (item.divider) {
                  return (
                    <div
                      key={i}
                      className="my-1 mx-3"
                      style={{ height: 1, background: 'rgba(255,255,255,0.07)' }}
                    />
                  );
                }
                return (
                  <button
                    key={i}
                    id={item.id}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      color: item.danger ? '#f87171' : 'rgba(255,255,255,0.75)',
                      background: 'transparent',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = item.danger
                        ? 'rgba(248,113,113,0.08)'
                        : 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = item.danger ? '#ff6b6b' : '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = item.danger
                        ? '#f87171'
                        : 'rgba(255,255,255,0.75)';
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Center: Role Badge ── */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        id="role-badge"
      >
        <span>{isHR ? '🛡️' : '👤'}</span>
        <span className="gradient-text">{isHR ? 'HR Admin' : 'Employee'}</span>
      </div>

      {/* ── Right: Hamburger ── */}
      <button
        id="hamburger-panel-btn"
        aria-label="Open announcements and messages panel"
        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
        className="relative w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-all duration-300 cursor-pointer"
        style={{
          background: isSidePanelOpen ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.04)',
          border: isSidePanelOpen
            ? '1px solid rgba(0,245,255,0.3)'
            : '1px solid rgba(255,255,255,0.1)',
        }}
        onMouseEnter={(e) => {
          if (!isSidePanelOpen) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSidePanelOpen) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }
        }}
      >
        {/* 3-line hamburger */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === 1 ? 14 : 18,
              height: 2,
              background: isSidePanelOpen ? '#00f5ff' : 'rgba(255,255,255,0.7)',
            }}
          />
        ))}

        {/* Red dot indicator */}
        {(hasNewAnnouncements || panelBadgeCount > 0) && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #f87171, #dc2626)' }}
          >
            {panelBadgeCount > 0 ? panelBadgeCount : ''}
          </span>
        )}
      </button>
    </header>
  );
}
