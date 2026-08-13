import { useApp } from '../../context/AppContext';

export default function Header() {
  const { role, setRole } = useApp();
  const isHR = role === 'hr';

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

      {/* Role Toggle */}
      <div className="flex items-center gap-4">
        <div
          className="toggle-track flex items-center"
          onClick={() => setRole(isHR ? 'employee' : 'hr')}
          role="button"
          tabIndex={0}
          aria-label={`Switch to ${isHR ? 'Employee' : 'HR'} view`}
          id="role-toggle"
        >
          <div
            className="toggle-thumb"
            style={{ left: isHR ? '111px' : '3px' }}
          />
          <span
            className={`relative z-10 flex-1 text-center text-sm font-semibold transition-colors duration-300 ${
              !isHR ? 'text-white' : 'text-text-secondary'
            }`}
          >
            Employee
          </span>
          <span
            className={`relative z-10 flex-1 text-center text-sm font-semibold transition-colors duration-300 ${
              isHR ? 'text-white' : 'text-text-secondary'
            }`}
          >
            HR
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
      </div>
    </header>
  );
}
