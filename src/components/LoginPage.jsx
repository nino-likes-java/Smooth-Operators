import { useState } from 'react';
import { useApp } from '../context/AppContext';

/* ── Credentials ── */
const CREDENTIALS = {
  employee: { email: 'employee@gmail.com', password: '123456789' },
  hr: { email: 'hr@gmail.com', password: '123456789' },
};

export default function LoginPage() {
  const { setRole, setIsLoggedIn } = useApp();
  const [selectedRole, setSelectedRole] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return params.get('role') === 'hr' ? 'hr' : 'employee';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isHR = selectedRole === 'hr';

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const creds = CREDENTIALS[selectedRole];
    if (email === creds.email && password === creds.password) {
      setIsLoading(true);
      setTimeout(() => {
        setRole(selectedRole);
        setIsLoggedIn(true);
      }, 700);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const selectPortal = (role) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col md:flex-row"
      style={{
        fontFamily: 'var(--font-family-sans)',
        backgroundColor: 'var(--color-navy-deep)', // Mobile fallback
      }}
    >
      {/* ── LEFT SIDE — BRAND / INFORMATION ── */}
      <div
        className="relative w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0"
        style={{
          background: 'var(--color-navy-deep)',
          color: 'var(--color-white-warm)',
        }}
      >
        <div className="max-w-md mx-auto md:mx-0">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: 'var(--color-white-warm)',
                color: 'var(--color-navy-deep)',
              }}
            >
              SO
            </div>
            <h1 className="text-xl font-bold tracking-wide">SMOOTH OPERATORS</h1>
          </div>
          
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-12"
            style={{ color: 'var(--color-gold-muted)' }}
          >
            Workforce & Operations Management System
          </p>

          <h2
            className="text-4xl md:text-5xl font-semibold mb-6 leading-tight"
            style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em' }}
          >
            Work should move.<br />
            People shouldn't have to wait.
          </h2>

          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ color: 'var(--color-text-muted-alt)' }}
          >
            Smooth Operators centralizes workforce operations, attendance, tasks, requests and organizational workflows into a single, authoritative platform.
          </p>

          <div
            className="absolute bottom-8 left-8 md:left-16 flex items-center gap-2 text-xs font-medium"
            style={{ color: 'var(--color-text-muted-alt)' }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-gold-muted)' }}
            />
            SECURE AUTHENTICATION
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE — LOGIN ── */}
      <div
        className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 relative"
        style={{ backgroundColor: 'var(--color-white-warm)' }}
      >
        <div className="w-full max-w-md mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: 'var(--color-gold-muted)' }}
            >
              Authorized Access
            </p>
            <h3
              className="text-2xl md:text-3xl font-semibold"
              style={{ color: 'var(--color-text-main)' }}
            >
              Sign in to your portal
            </h3>
          </div>

          {/* Portal Selector */}
          <div className="mb-8 flex flex-col gap-3">
            {/* Employee Portal Row */}
            <button
              type="button"
              onClick={() => selectPortal('employee')}
              className="w-full text-left px-5 py-4 border flex items-center justify-between transition-all duration-200 group"
              style={{
                borderColor: !isHR ? 'var(--color-gold-muted)' : 'rgba(23, 35, 50, 0.1)',
                backgroundColor: !isHR ? 'var(--color-white)' : 'transparent',
                boxShadow: !isHR ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
              }}
            >
              <div>
                <span
                  className="block text-xs font-bold mb-1"
                  style={{ color: 'var(--color-text-main)' }}
                >
                  01 — EMPLOYEE PORTAL
                </span>
                <span
                  className="block text-xs"
                  style={{ color: 'var(--color-text-muted-alt)' }}
                >
                  Workspace, attendance, tasks & requests
                </span>
              </div>
              <span
                className="text-xs font-bold transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: !isHR ? 'var(--color-gold-muted)' : 'var(--color-text-muted-alt)' }}
              >
                ENTER PORTAL →
              </span>
            </button>

            {/* HR Portal Row */}
            <button
              type="button"
              onClick={() => selectPortal('hr')}
              className="w-full text-left px-5 py-4 border flex items-center justify-between transition-all duration-200 group"
              style={{
                borderColor: isHR ? 'var(--color-gold-muted)' : 'rgba(23, 35, 50, 0.1)',
                backgroundColor: isHR ? 'var(--color-white)' : 'transparent',
                boxShadow: isHR ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
              }}
            >
              <div>
                <span
                  className="block text-xs font-bold mb-1"
                  style={{ color: 'var(--color-text-main)' }}
                >
                  02 — HR / ADMINISTRATION
                </span>
                <span
                  className="block text-xs"
                  style={{ color: 'var(--color-text-muted-alt)' }}
                >
                  Workforce control, approvals & operations
                </span>
              </div>
              <span
                className="text-xs font-bold transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: isHR ? 'var(--color-gold-muted)' : 'var(--color-text-muted-alt)' }}
              >
                ENTER PORTAL →
              </span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 px-4 py-3 text-sm font-medium border"
              style={{
                backgroundColor: '#FFF0F0',
                borderColor: '#FFD6D6',
                color: '#D8000C',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold mb-2 uppercase"
                style={{ color: 'var(--color-text-main)' }}
              >
                {isHR ? 'HR Email / ID' : 'Employee Email / ID'}
              </label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isHR ? 'hr@gmail.com' : 'employee@gmail.com'}
                required
                className="w-full px-4 py-3 border text-sm focus:outline-none focus:ring-1 transition-all"
                style={{
                  borderColor: 'rgba(23, 35, 50, 0.2)',
                  color: 'var(--color-text-main)',
                  backgroundColor: 'var(--color-white)',
                  '--tw-ring-color': 'var(--color-gold-muted)'
                }}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-bold mb-2 uppercase flex justify-between"
                style={{ color: 'var(--color-text-main)' }}
              >
                <span>Password</span>
                <span
                  className="font-medium hover:underline cursor-pointer"
                  style={{ color: 'var(--color-text-muted-alt)' }}
                >
                  Forgot password?
                </span>
              </label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border text-sm focus:outline-none focus:ring-1 transition-all"
                style={{
                  borderColor: 'rgba(23, 35, 50, 0.2)',
                  color: 'var(--color-text-main)',
                  backgroundColor: 'var(--color-white)',
                  '--tw-ring-color': 'var(--color-gold-muted)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-navy-deep)',
                color: 'var(--color-white-warm)',
              }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-white-warm)', borderTopColor: 'transparent' }} />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  SIGN IN →
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
