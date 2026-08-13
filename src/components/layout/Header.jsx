import { useApp } from '../../context/AppContext';

export default function Header() {
  const { role, setIsLoggedIn } = useApp();
  const isHR = role === 'hr';

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 glass-card-static flex items-center justify-between px-8 py-3"
      style={{
        zIndex: 50,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        backdropFilter: 'blur(30px)',
      }}
    >
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold animate-pulse-glow"
          style={{
            background: 'linear-gradient(135deg, #00f5ff, #7c3aed)',
          }}
        >
          S
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight leading-tight">
            <span className="gradient-text">Smooth Operators</span>
          </h1>
          <p className="text-[11px] text-text-muted tracking-widest uppercase">
            Spatial Dashboard
          </p>
        </div>
      </div>

      {/* Role Badge + Actions */}
      <div className="flex items-center gap-4">
        {/* Role Badge (static — no toggle) */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          id="role-badge"
        >
          <span>{isHR ? '🛡️' : '👤'}</span>
          <span className="gradient-text">
            {isHR ? 'HR Admin' : 'Employee'}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1]"
          id="notification-bell"
          aria-label="Notifications"
        >
          <span className="text-lg">🔔</span>
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #7c3aed)' }}
          >
            3
          </span>
        </button>

        {/* User Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
          style={{ borderColor: 'rgba(0, 245, 255, 0.4)' }}
          id="user-avatar"
        >
          🧑‍💻
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-white/[0.08]"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text-secondary)',
          }}
          id="logout-btn"
          aria-label="Log out"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 80, 80, 0.3)';
            e.currentTarget.style.color = '#ff6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}

