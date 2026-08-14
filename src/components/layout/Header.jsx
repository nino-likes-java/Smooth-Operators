import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

const PROFILES = {
  employee: {
    name: 'Alex Morgan',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    employeeId: 'EMP-2247',
    email: 'employee@gmail.com',
    avatar: 'ðŸ§‘â€ðŸ’»',
    avatarBg: 'linear-gradient(135deg, #2DD4FF 0%, #9333EA 100%)',
  },
  hr: {
    name: 'Rachel HR',
    role: 'HR Admin Manager',
    department: 'Human Resources',
    employeeId: 'HR-0012',
    email: 'hr@gmail.com',
    avatar: 'ðŸ›¡ï¸',
    avatarBg: 'linear-gradient(135deg, #9333EA 0%, #a78bfa 100%)',
  },
};

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
  const profile = PROFILES[role] || PROFILES.employee;
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

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsLogoMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setIsLogoMenuOpen]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLogoMenuOpen(false);
  };

  // Menu items â€” "Change Password" removed per spec
  const menuItems = [
    {
      icon: 'ðŸ‘¤',
      label: 'View Profile',
      id: 'menu-account',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: 'âš™ï¸',
      label: 'Settings',
      id: 'menu-settings',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: 'ðŸ””',
      label: 'Notifications',
      id: 'menu-notifications',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: 'â“',
      label: 'Help & Support',
      id: 'menu-help',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: null,
      label: null,
      divider: true,
    },
    {
      icon: 'ðŸšª',
      label: 'Logout',
      id: 'menu-logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Badge count for right panel button
  const panelBadgeCount = isHR ? unreadHrMessages : 0;

  return (
    <>
      <style>{`
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);     }
        }
      `}</style>

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
        {/* â”€â”€ Left: Profile Avatar Button â”€â”€ */}
        <div className="relative" ref={logoMenuRef}>
          <button
            id="logo-menu-trigger"
            aria-label="Open account menu"
            aria-expanded={isLogoMenuOpen}
            onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
            className="flex items-center gap-3 group cursor-pointer select-none rounded-xl px-2 py-1 transition-all duration-200"
            style={{
              background: isLogoMenuOpen ? 'rgba(45,212,255,0.07)' : 'transparent',
              border: isLogoMenuOpen
                ? '1px solid rgba(45,212,255,0.25)'
                : '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isLogoMenuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              if (!isLogoMenuOpen) e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Avatar orb with gradient */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 relative"
              style={{
                background: profile.avatarBg,
                boxShadow: isLogoMenuOpen ? '0 0 14px rgba(45,212,255,0.3)' : 'none',
              }}
            >
              {profile.avatar}
              {/* Online dot */}
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: '#4ade80', borderColor: 'rgba(5,5,15,0.9)' }}
              />
            </div>

            {/* Name + role */}
            <div className="hidden sm:block text-left">
              <h1 className="text-xs font-bold leading-tight">
                <span className="gradient-text">{profile.name.split(' ')[0]}</span>
              </h1>
              <p className="text-[10px] text-text-muted tracking-wide">
                {isHR ? 'HR Admin' : 'Employee'}
              </p>
            </div>

            {/* Chevron */}
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted transition-transform duration-300 hidden sm:block"
              style={{ transform: isLogoMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isLogoMenuOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-72 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(19, 19, 25, 0.97)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(55,55,68,0.8)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                zIndex: 200,
                animation: 'slideDownFade 0.18s cubic-bezier(0.34,1.2,0.64,1)',
              }}
              id="logo-dropdown-menu"
            >
              {/* Profile header */}
              <div
                className="px-5 py-4 flex items-center gap-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,212,255,0.05), rgba(147,51,234,0.07))',
                  borderBottom: '1px solid rgba(38,38,47,0.9)',
                }}
              >
                {/* Large avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 relative"
                  style={{
                    background: profile.avatarBg,
                    boxShadow: '0 8px 24px rgba(45,212,255,0.18)',
                  }}
                >
                  {profile.avatar}
                  <span
                    className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ background: '#4ade80', borderColor: 'rgba(19,19,25,0.97)' }}
                  />
                </div>
                {/* Info */}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">{profile.name}</p>
                  <p className="text-[10px] text-text-secondary truncate">{profile.role}</p>
                  <p className="text-[10px] text-text-muted truncate">{profile.email}</p>
                  <span
                    className="inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(45,212,255,0.1)', color: '#2DD4FF', border: '1px solid rgba(45,212,255,0.2)' }}
                  >
                    {profile.employeeId}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 px-2">
                {menuItems.map((item, i) => {
                  if (item.divider) {
                    return (
                      <div
                        key={i}
                        className="my-1.5 mx-2"
                        style={{ height: 1, background: 'rgba(38,38,47,0.9)' }}
                      />
                    );
                  }
                  return (
                    <button
                      key={i}
                      id={item.id}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all duration-150 cursor-pointer group"
                      style={{
                        color: item.danger ? '#f87171' : 'rgba(255,255,255,0.72)',
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
                        e.currentTarget.style.color = item.danger ? '#f87171' : 'rgba(255,255,255,0.72)';
                      }}
                    >
                      <span className="text-base w-5 text-center">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 group-hover:opacity-40 transition-opacity">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* â”€â”€ Center: Role Badge â”€â”€ */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(38, 38, 47, 0.9)',
            border: '1px solid rgba(55, 55, 68, 0.8)',
          }}
          id="role-badge"
        >
          <span>{isHR ? 'ðŸ›¡ï¸' : 'ðŸ‘¤'}</span>
          <span className="gradient-text">{isHR ? 'HR Admin' : 'Employee'}</span>
        </div>

        {/* â”€â”€ Right: Hamburger â”€â”€ */}
        <button
          id="hamburger-panel-btn"
          aria-label="Open announcements and messages panel"
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className="relative w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-all duration-300 cursor-pointer"
          style={{
            background: isSidePanelOpen ? 'rgba(45,212,255,0.1)' : 'rgba(255,255,255,0.04)',
            border: isSidePanelOpen
              ? '1px solid rgba(45,212,255,0.3)'
              : '1px solid rgba(55,55,68,0.8)',
          }}
          onMouseEnter={(e) => {
            if (!isSidePanelOpen) {
              e.currentTarget.style.background = 'rgba(38,38,47,0.9)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSidePanelOpen) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(55,55,68,0.8)';
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
                background: isSidePanelOpen ? '#2DD4FF' : 'rgba(255,255,255,0.7)',
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
    </>
  );
}

