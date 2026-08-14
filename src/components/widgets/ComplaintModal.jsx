import { useState } from 'react';

const CATEGORIES = ['Harassment', 'Policy Violation', 'Workplace Issue', 'Pay & Benefits', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High'];

const SEVERITY_COLORS = {
  Low: { bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.3)', text: '#60a5fa' },
  Medium: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' },
  High: { bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.3)', text: '#f87171' },
};

export default function ComplaintModal({ isOpen, onClose }) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubject('');
      setCategory('');
      setSeverity('Medium');
      setDescription('');
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const inputStyle = {
    background: 'rgba(26, 26, 34, 0.8)',
    border: '1px solid rgba(55, 55, 68, 0.8)',
    color: 'var(--color-text-main)',
    caretColor: 'var(--color-cyan-glow)',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(200, 169, 107, 0.4)';
    e.target.style.boxShadow = '0 0 0 3px rgba(200, 169, 107, 0.08)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(55, 55, 68, 0.8)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 200, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card-static w-full max-w-lg p-7 animate-fade-in-up relative"
        style={{
          boxShadow: '0 8px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(38, 38, 47, 0.9)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          aria-label="Close"
          id="complaint-close-btn"
        >
          ✕
        </button>

        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center justify-center py-12">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
              style={{ background: 'rgba(200, 169, 107, 0.1)', border: '1px solid rgba(200, 169, 107, 0.2)' }}
            >
              ✓
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Complaint Submitted</h3>
            <p className="text-sm text-text-secondary text-center">
              Your complaint has been filed. HR will review it shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)' }}
                >
                  âš ï¸
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">File a Complaint</h3>
                  <p className="text-xs text-text-secondary">Your complaint will be sent to HR confidentially</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Subject */}
              <div className="mb-4">
                <label htmlFor="complaint-subject" className="block text-xs font-semibold text-text-secondary mb-2 tracking-wide uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  id="complaint-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your concern"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Category + Severity row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="complaint-category" className="block text-xs font-semibold text-text-secondary mb-2 tracking-wide uppercase">
                    Category
                  </label>
                  <select
                    id="complaint-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 appearance-none cursor-pointer"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} style={{ background: '#08080C', color: '#fff' }}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2 tracking-wide uppercase">
                    Severity
                  </label>
                  <div className="flex gap-2">
                    {SEVERITIES.map((sev) => {
                      const colors = SEVERITY_COLORS[sev];
                      const isActive = severity === sev;
                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setSeverity(sev)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                          style={{
                            background: isActive ? colors.bg : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isActive ? colors.border : 'rgba(38,38,47,0.9)'}`,
                            color: isActive ? colors.text : 'var(--color-text-muted)',
                          }}
                        >
                          {sev}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="complaint-description" className="block text-xs font-semibold text-text-secondary mb-2 tracking-wide uppercase">
                  Description
                </label>
                <textarea
                  id="complaint-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your concern in detail..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 resize-none"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="complaint-submit-btn"
                className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #f87171, #dc2626)',
                  color: '#fff',
                  boxShadow: '0 4px 24px rgba(248, 113, 113, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 32px rgba(248, 113, 113, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 24px rgba(248, 113, 113, 0.2)';
                }}
              >
                Submit Complaint
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

