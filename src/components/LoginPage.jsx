import { useState } from 'react';
import { useApp } from '../context/AppContext';

/* ── Credentials ── */
const CREDENTIALS = {
  employee: { email: 'employee@gmail.com', password: '123456789' },
  hr: { email: 'hr@gmail.com', password: '123456789' },
};

/* ── SVG Social Icons ── */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);

/* ── Eye toggle ── */
const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

/* ── Floating particles ── */
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 8,
    opacity: Math.random() * 0.25 + 0.05,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0
              ? 'var(--color-cyan-glow)'
              : p.id % 3 === 1
                ? 'var(--color-violet-deep)'
                : 'var(--color-violet-light)',
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: `blur(${p.size > 2 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}

const SOCIALS = [
  { Icon: LinkedInIcon, label: 'LinkedIn' },
  { Icon: TwitterIcon, label: 'X' },
  { Icon: InstagramIcon, label: 'Instagram' },
  { Icon: GitHubIcon, label: 'GitHub' },
  { Icon: GlobeIcon, label: 'Website' },
];

export default function LoginPage() {
  const { setRole, setIsLoggedIn } = useApp();
  const [selectedRole, setSelectedRole] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return params.get('role') === 'hr' ? 'hr' : 'employee';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--color-text-primary)',
    caretColor: 'var(--color-cyan-glow)',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)';
    e.target.style.boxShadow = '0 0 0 3px rgba(0, 245, 255, 0.08)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="fixed inset-0 flex"
      style={{
        background: '#000000',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      {/* ════════════ LEFT — Branding ════════════ */}
      <div
        className="relative hidden lg:flex flex-col items-center justify-center"
        style={{
          width: '50%',
          background: 'radial-gradient(ellipse at 40% 40%, rgba(124, 58, 237, 0.14) 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, rgba(0, 245, 255, 0.08) 0%, transparent 55%), #000',
        }}
      >
        <FloatingParticles />

        {/* Ambient orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600,
            height: 600,
            top: '-15%',
            left: '-12%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400,
            height: 400,
            bottom: '5%',
            right: '0%',
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-12">
          {/* Logo */}
          <div
            className="animate-fade-in-up w-28 h-28 rounded-3xl flex items-center justify-center text-5xl font-extrabold mb-10 animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #7c3aed)',
              boxShadow: '0 0 60px rgba(0, 245, 255, 0.3), 0 0 120px rgba(124, 58, 237, 0.18)',
              animationDelay: '0s',
              animationFillMode: 'backwards',
            }}
          >
            S
          </div>

          {/* Company Name — BIG */}
          <h1
            className="animate-fade-in-up gradient-text font-extrabold tracking-tight leading-[0.9] text-center select-none"
            style={{
              fontSize: 'clamp(4rem, 6vw, 6.5rem)',
              animationDelay: '0.12s',
              animationFillMode: 'backwards',
            }}
          >
            Smooth
          </h1>
          <h1
            className="animate-fade-in-up gradient-text font-extrabold tracking-tight leading-[0.9] text-center select-none"
            style={{
              fontSize: 'clamp(4rem, 6vw, 6.5rem)',
              animationDelay: '0.2s',
              animationFillMode: 'backwards',
            }}
          >
            Operators
          </h1>

          <p
            className="animate-fade-in-up text-text-muted tracking-[0.4em] uppercase text-xs mt-5 font-medium"
            style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
          >
            Private Limited
          </p>

          <p
            className="animate-fade-in-up text-text-secondary text-sm text-center mt-6 max-w-xs leading-relaxed"
            style={{ animationDelay: '0.38s', animationFillMode: 'backwards' }}
          >
            Your spatial HR command center — powered by intelligence.
          </p>

          {/* Social icons */}
          <div
            className="animate-fade-in-up flex items-center gap-3 mt-10"
            style={{ animationDelay: '0.48s', animationFillMode: 'backwards' }}
          >
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                id={`social-${label.toLowerCase().replace(/[^a-z]/g, '')}`}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 text-text-muted hover:text-white"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 245, 255, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <p
          className="absolute bottom-6 text-text-muted text-xs"
          style={{ zIndex: 10 }}
        >
          © 2026 Smooth Operators Pvt. Ltd.
        </p>
      </div>

      {/* ── Vertical divider ── */}
      <div
        className="hidden lg:block w-px self-stretch"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.15) 30%, rgba(124, 58, 237, 0.15) 70%, transparent)',
        }}
      />

      {/* ════════════ RIGHT — Login Form ════════════ */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center px-6"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(124, 58, 237, 0.06) 0%, transparent 60%), #000',
        }}
      >
        {/* Mobile-only branding (shown when left panel is hidden) */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-4 animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #7c3aed)' }}
          >
            S
          </div>
          <h1
            className="gradient-text font-extrabold tracking-tight text-3xl"
          >
            Smooth Operators
          </h1>
          <p className="text-text-muted tracking-[0.3em] uppercase text-[10px] mt-1 font-medium">
            Private Limited
          </p>
        </div>

        {/* Login card */}
        <div
          className="animate-fade-in-up w-full max-w-sm"
          style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}
        >
          {/* Heading */}
          <div className="mb-7">
            <h2
              className="text-2xl font-bold text-text-primary mb-1"
            >
              Welcome back
            </h2>
            <p className="text-text-secondary text-sm">
              Sign in to your {isHR ? 'HR Admin' : 'Employee'} account
            </p>
          </div>

          {/* Role Toggle */}
          <div className="mb-7">
            <div
              className="toggle-track flex items-center"
              onClick={() => {
                setSelectedRole(isHR ? 'employee' : 'hr');
                setEmail('');
                setPassword('');
                setError('');
              }}
              role="button"
              tabIndex={0}
              aria-label={`Switch to ${isHR ? 'Employee' : 'HR'} login`}
              id="login-role-toggle"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRole(isHR ? 'employee' : 'hr');
                  setEmail('');
                  setPassword('');
                  setError('');
                }
              }}
            >
              <div
                className="toggle-thumb"
                style={{ left: isHR ? '111px' : '3px' }}
              />
              <span
                className={`relative z-10 flex-1 text-center text-sm font-semibold transition-colors duration-300 select-none ${
                  !isHR ? 'text-white' : 'text-text-secondary'
                }`}
              >
                👤 Employee
              </span>
              <span
                className={`relative z-10 flex-1 text-center text-sm font-semibold transition-colors duration-300 select-none ${
                  isHR ? 'text-white' : 'text-text-secondary'
                }`}
              >
                🛡️ HR
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-5 px-4 py-2.5 rounded-xl text-xs font-medium"
              style={{
                background: 'rgba(255, 60, 60, 0.08)',
                border: '1px solid rgba(255, 60, 60, 0.2)',
                color: '#ff6b6b',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-text-secondary mb-2 tracking-wide uppercase"
              >
                {isHR ? 'HR Email' : 'Employee Email'}
              </label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isHR ? 'hr@gmail.com' : 'employee@gmail.com'}
                required
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-text-secondary mb-2 tracking-wide uppercase"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 pr-12"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="toggle-password-visibility"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                className="text-xs font-medium transition-colors duration-200 hover:underline"
                style={{ color: 'var(--color-cyan-glow)' }}
                id="forgot-password-link"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-400 relative overflow-hidden"
              style={{
                background: isLoading
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'linear-gradient(135deg, #00f5ff, #7c3aed)',
                color: '#fff',
                boxShadow: isLoading
                  ? 'none'
                  : '0 4px 24px rgba(0, 245, 255, 0.25), 0 0 48px rgba(124, 58, 237, 0.15)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 32px rgba(0, 245, 255, 0.35), 0 0 64px rgba(124, 58, 237, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 24px rgba(0, 245, 255, 0.25), 0 0 48px rgba(124, 58, 237, 0.15)';
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    style={{ animation: 'spin-slow 0.8s linear infinite' }}
                  />
                  Signing in…
                </span>
              ) : (
                `Sign in as ${isHR ? 'HR Admin' : 'Employee'}`
              )}
            </button>
          </form>

          {/* Mobile-only socials */}
          <div className="lg:hidden mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-text-muted text-[10px] tracking-widest uppercase">Connect</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div className="flex items-center justify-center gap-3">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-white transition-colors duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
