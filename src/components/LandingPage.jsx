import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[#ffffff] selection:bg-[#CFA86E] selection:text-[#080E18]" style={{ backgroundColor: '#080E18', color: '#ffffff' }}>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[#CFA86E]/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-[#CFA86E] flex items-center justify-center font-bold text-[#080E18]">
            S
          </div>
          <span className="font-semibold tracking-wider uppercase text-sm">Smooth Operators</span>
        </div>
        <a
          href="/login?role=employee"
          className="text-xs font-bold tracking-widest uppercase border border-[#CFA86E] text-[#CFA86E] px-6 py-2.5 rounded hover:bg-[#CFA86E] hover:text-[#080E18] transition-colors duration-300"
        >
          Access Portal
        </a>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="max-w-4xl w-full text-center z-10 relative">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight" style={{ color: 'var(--color-gold-muted)' }}>
            Elevate Your Workforce
          </h1>
          <p className="text-lg md:text-xl text-[#9ca3af] max-w-2xl mx-auto mb-16 font-light">
            Your spatial HR command center. Manage operations, unlock insights, and empower your team with intelligence.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {/* Employee Portal Card */}
            <a
              href="/login?role=employee"
              className="group block p-8 border border-[#CFA86E]/30 rounded-xl bg-[#080E18] hover:border-[#CFA86E] hover:shadow-[0_0_30px_rgba(207,168,110,0.15)] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#CFA86E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-[#CFA86E] text-sm font-bold tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">01</div>
                <h2 className="text-2xl font-serif mb-2 transition-colors" style={{ color: 'var(--color-gold-muted)' }}>Employee Portal</h2>
                <p className="text-[#9ca3af] text-sm">Access your benefits, pay stubs, and internal resources.</p>

                <div className="mt-8 flex items-center text-[#CFA86E] text-sm font-semibold tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                  ENTER <span className="ml-2">→</span>
                </div>
              </div>
            </a>

            {/* HR / Administration Card */}
            <a
              href="/login?role=hr"
              className="group block p-8 border border-[#CFA86E]/30 rounded-xl bg-[#080E18] hover:border-[#CFA86E] hover:shadow-[0_0_30px_rgba(207,168,110,0.15)] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#CFA86E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-[#CFA86E] text-sm font-bold tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">02</div>
                <h2 className="text-2xl font-serif mb-2 transition-colors" style={{ color: 'var(--color-gold-muted)' }}>HR / Administration</h2>
                <p className="text-[#9ca3af] text-sm">Manage employee data, organizational charts, and company policies.</p>

                <div className="mt-8 flex items-center text-[#CFA86E] text-sm font-semibold tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                  ENTER <span className="ml-2">→</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#CFA86E]/5 rounded-full blur-[120px] pointer-events-none"></div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-[#4b5563] text-xs tracking-widest uppercase border-t border-[#ffffff]/5">
        © 2026 Smooth Operators Pvt. Ltd.
      </footer>
    </div>
  );
}
