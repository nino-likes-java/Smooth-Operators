import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

// Simple inline SVG icons to replace emojis
const UserIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const UserAvatarIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ShieldIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const ShieldAvatarIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const BellIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const HelpIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const LogoutIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

const PROFILES = {
  employee: {
    name: 'Alex Morgan',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    employeeId: 'EMP-2247',
    email: 'employee@company.com',
    avatar: <UserAvatarIcon />,
    avatarBg: 'var(--color-navy-dark)',
  },
  hr: {
    name: 'Rachel HR',
    role: 'HR Admin Manager',
    department: 'Human Resources',
    employeeId: 'HR-0012',
    email: 'hr@company.com',
    avatar: <ShieldAvatarIcon />,
    avatarBg: 'var(--color-navy-dark)',
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

  const menuItems = [
    {
      icon: <UserIcon />,
      label: 'View Profile',
      id: 'menu-account',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: <SettingsIcon />,
      label: 'Settings',
      id: 'menu-settings',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: <BellIcon />,
      label: 'Notifications',
      id: 'menu-notifications',
      onClick: () => setIsLogoMenuOpen(false),
    },
    {
      icon: <HelpIcon />,
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
      icon: <LogoutIcon />,
      label: 'Logout',
      id: 'menu-logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

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
        className="fixed top-0 left-0 right-0 glass-card-static flex items-center justify-between px-6 py-3 border-b"
        style={{
          zIndex: 50,
          borderRadius: 0,
          background: 'var(--color-navy)',
          borderColor: 'var(--color-gold-muted)',
          backdropFilter: 'blur(30px)',
        }}
      >
        {/* ──── Left: Profile Avatar Button ──── */}
        <div className="relative" ref={logoMenuRef}>
          <button
            id="logo-menu-trigger"
            aria-label="Open account menu"
            aria-expanded={isLogoMenuOpen}
            onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
            className="flex items-center gap-3 group cursor-pointer select-none rounded-xl px-2 py-1 transition-all duration-200"
            style={{
              background: isLogoMenuOpen ? 'rgba(200,169,107,0.07)' : 'transparent',
              border: isLogoMenuOpen
                ? '1px solid var(--color-gold-muted)'
                : '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isLogoMenuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              if (!isLogoMenuOpen) e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Avatar orb */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 relative border border-gold-muted/30 text-gold-muted"
              style={{
                background: profile.avatarBg,
                boxShadow: isLogoMenuOpen ? '0 0 14px rgba(200,169,107,0.3)' : 'none',
              }}
            >
              {profile.avatar}
              {/* Online dot */}
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: 'var(--color-gold-light)', borderColor: 'var(--color-navy-dark)' }}
              />
            </div>

            {/* Name + role */}
            <div className="hidden sm:block text-left">
              <h1 className="text-xs font-bold leading-tight font-playfair text-text-light tracking-wide">
                <span>{profile.name.split(' ')[0]}</span>
              </h1>
              <p className="text-[10px] text-text-muted-alt tracking-wide font-sans">
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
              className="text-gold-muted transition-transform duration-300 hidden sm:block"
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
                background: 'var(--color-navy-dark)',
                backdropFilter: 'blur(30px)',
                border: '1px solid var(--color-gold-muted)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                zIndex: 200,
                animation: 'slideDownFade 0.18s cubic-bezier(0.34,1.2,0.64,1)',
              }}
              id="logo-dropdown-menu"
            >
              {/* Profile header */}
              <div
                className="px-5 py-4 flex items-center gap-4"
                style={{
                  background: 'var(--color-navy)',
                  borderBottom: '1px solid rgba(200,169,107,0.3)',
                }}
              >
                {/* Large avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative border border-gold-muted/40 text-gold-muted"
                  style={{
                    background: profile.avatarBg,
                    boxShadow: '0 8px 24px rgba(200,169,107,0.1)',
                  }}
                >
                  {profile.avatar}
                  <span
                    className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ background: 'var(--color-gold-light)', borderColor: 'var(--color-navy-dark)' }}
                  />
                </div>
                {/* Info */}
                <div className="min-w-0 font-sans">
                  <p className="text-sm font-bold text-text-light truncate font-playfair">{profile.name}</p>
                  <p className="text-[10px] text-gold-muted truncate">{profile.role}</p>
                  <p className="text-[10px] text-text-muted-alt truncate">{profile.email}</p>
                  <span
                    className="inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full text-gold-muted border border-gold-muted/30 bg-gold-muted/10"
                  >
                    {profile.employeeId}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 px-2 font-sans">
                {menuItems.map((item, i) => {
                  if (item.divider) {
                    return (
                      <div
                        key={i}
                        className="my-1.5 mx-2"
                        style={{ height: 1, background: 'rgba(200,169,107,0.2)' }}
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
                        color: item.danger ? '#f87171' : 'var(--color-text-muted-alt)',
                        background: 'transparent',
                        border: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = item.danger
                          ? 'rgba(248,113,113,0.08)'
                          : 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = item.danger ? '#ff6b6b' : 'var(--color-text-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = item.danger ? '#f87171' : 'var(--color-text-muted-alt)';
                      }}
                    >
                      <span className="flex items-center justify-center w-5">{item.icon}</span>
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

        {/* ──── Center: Role Badge ──── */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold font-sans border border-gold-muted/40 bg-navy text-gold-light shadow-sm"
          id="role-badge"
        >
          <span className="flex items-center justify-center opacity-80">{isHR ? <ShieldIcon /> : <UserIcon />}</span>
          <span>{isHR ? 'HR Admin' : 'Employee'}</span>
        </div>

        {/* ──── Right: Hamburger ──── */}
        <button
          id="hamburger-panel-btn"
          aria-label="Open announcements and messages panel"
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className="relative w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-all duration-300 cursor-pointer"
          style={{
            background: isSidePanelOpen ? 'rgba(200,169,107,0.1)' : 'transparent',
            border: isSidePanelOpen
              ? '1px solid var(--color-gold-muted)'
              : '1px solid rgba(200,169,107,0.4)',
          }}
          onMouseEnter={(e) => {
            if (!isSidePanelOpen) {
              e.currentTarget.style.background = 'var(--color-navy-dark)';
              e.currentTarget.style.borderColor = 'var(--color-gold-light)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSidePanelOpen) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(200,169,107,0.4)';
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
                background: isSidePanelOpen ? 'var(--color-gold-light)' : 'var(--color-text-muted-alt)',
              }}
            />
          ))}

          {/* Red dot indicator */}
          {(hasNewAnnouncements || panelBadgeCount > 0) && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-navy-dark border border-navy-dark"
              style={{ background: 'var(--color-gold-light)' }}
            >
              {panelBadgeCount > 0 ? panelBadgeCount : ''}
            </span>
          )}
        </button>
      </header>
    </>
  );
}
