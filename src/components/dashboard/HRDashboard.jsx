import { useState, useEffect } from 'react';
import AttendanceHeatmap from '../widgets/AttendanceHeatmap';
import FinancialDonut from '../widgets/FinancialDonut';
import {
  attendanceData,
  budgetData,
  hrStats,
  hrActions,
  complaints as initialComplaints,
  announcements as initialAnnouncements,
} from '../../data/dummyData';

/* ────── Helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */
const STATUS_STYLES = {
  Pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  'In Review': { bg: 'rgba(223, 201, 147, 0.1)', border: 'rgba(223, 201, 147, 0.2)', text: '#DFC993' },
  Resolved: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
};
const SEVERITY_COLORS = { Low: '#60a5fa', Medium: '#fbbf24', High: '#f87171' };

function DepartmentBar({ name, count, total, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-secondary w-24 truncate">{name}</span>
      <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(count / total) * 100}%`, background: color, boxShadow: `0 0 8px ${color}40` }} />
      </div>
      <span className="text-xs text-text-muted w-8 text-right">{count}</span>
    </div>
  );
}

/* ────── Shared Popup Shell ────────────────────────────────────────────────────────────────────────────────────────────────── */
function DetailPopup({ title, icon, onClose, children, wide }) {
  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 1000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <div
          className="relative rounded-2xl overflow-hidden mx-4"
          style={{
            width: '100%',
            maxWidth: wide ? 640 : 520,
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-surface-border)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, rgba(13,32,53,0.07), rgba(200,169,107,0.05))',
              borderBottom: '1px solid rgba(38,38,47,0.9)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <h2 className="text-base font-bold text-text-primary">{title}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted transition-all hover:bg-white/10 hover:text-white">✕</button>
          </div>
          <div className="p-6 max-h-[72vh] overflow-y-auto">{children}</div>
        </div>
      </div>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.9) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-xs font-semibold" style={{ color: color || 'var(--color-text-primary)' }}>{value}</span>
    </div>
  );
}

/* ────── Popup Components ────────────────────────────────────────────────────────────────────────────────────────────────────── */
function TotalEmployeesPopup({ stats, onClose }) {
  return (
    <DetailPopup title="Total Employees" icon="👥" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        {[
          { label: 'Total', value: stats.totalEmployees, color: '#C8A96B' },
          { label: 'New Hires', value: stats.newHires, color: '#4ade80' },
          { label: 'Open Roles', value: stats.openPositions, color: '#f87171' },
        ].map((c, i) => (
          <div key={i} className="flex-1 p-4 rounded-xl text-center" style={{ background: `${c.color}0d`, border: `1px solid ${c.color}30` }}>
            <p className="text-3xl font-black" style={{ color: c.color }}>{c.value}</p>
            <p className="text-[10px] text-text-muted mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs font-bold text-text-secondary mb-3">By Department</p>
      <div className="space-y-3">
        {stats.departments.map((d, i) => <DepartmentBar key={i} name={d.name} count={d.count} total={stats.totalEmployees} color={d.color} />)}
      </div>
    </DetailPopup>
  );
}

function NewHiresPopup({ stats, onClose }) {
  const hires = [
    { name: 'Jordan Lee', role: 'Backend Engineer', dept: 'Engineering', date: 'Aug 8' },
    { name: 'Nisha Patel', role: 'UX Researcher', dept: 'Design', date: 'Aug 5' },
    { name: 'Carlos Vega', role: 'Sales Analyst', dept: 'Sales', date: 'Aug 1' },
    { name: 'Mei Zhang', role: 'Data Scientist', dept: 'Product', date: 'Jul 28' },
  ];
  return (
    <DetailPopup title={`New Hires — ${stats.newHires} This Month`} icon="🆕" onClose={onClose}>
      <div className="space-y-3">
        {hires.map((h, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(200,169,107,0.15), rgba(13,32,53,0.15))', border: '1px solid rgba(200,169,107,0.15)', color: '#C8A96B' }}>
              {h.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">{h.name}</p>
              <p className="text-[10px] text-text-muted">{h.role} · {h.dept}</p>
            </div>
            <span className="text-[10px] text-text-muted">{h.date}</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>New</span>
          </div>
        ))}
      </div>
    </DetailPopup>
  );
}

function AttritionPopup({ stats, onClose }) {
  const reasons = [
    { reason: 'Better Opportunity', pct: 42, color: '#f87171' },
    { reason: 'Work-Life Balance', pct: 28, color: '#fbbf24' },
    { reason: 'Career Growth', pct: 18, color: '#DFC993' },
    { reason: 'Relocation', pct: 12, color: '#60a5fa' },
  ];
  return (
    <DetailPopup title="Attrition Analysis" icon="📉" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-4 rounded-xl text-center" style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <p className="text-3xl font-black" style={{ color: '#f87171' }}>{stats.attritionRate}%</p>
          <p className="text-[10px] text-text-muted mt-1">Current Rate</p>
        </div>
        <div className="flex-1 p-4 rounded-xl text-center" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <p className="text-3xl font-black" style={{ color: '#4ade80' }}>−0.5%</p>
          <p className="text-[10px] text-text-muted mt-1">vs Last Month</p>
        </div>
      </div>
      <p className="text-xs font-bold text-text-secondary mb-3">Exit Interview Reasons</p>
      <div className="space-y-3">
        {reasons.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-36 truncate">{r.reason}</span>
            <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(38,38,47,0.9)' }}>
              <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: r.color }}>{r.pct}%</span>
          </div>
        ))}
      </div>
    </DetailPopup>
  );
}

function OpenPositionsPopup({ stats, onClose }) {
  const positions = [
    { title: 'Sr. Backend Engineer', dept: 'Engineering', urgency: 'Urgent', since: 'Jun 12' },
    { title: 'Product Designer', dept: 'Design', urgency: 'High', since: 'Jul 5' },
    { title: 'Sales Manager', dept: 'Sales', urgency: 'Medium', since: 'Jul 20' },
    { title: 'Data Analyst', dept: 'Product', urgency: 'High', since: 'Aug 1' },
    { title: 'DevOps Engineer', dept: 'Engineering', urgency: 'Urgent', since: 'Aug 5' },
  ];
  const urgencyColor = { Urgent: '#f87171', High: '#fbbf24', Medium: '#60a5fa' };
  return (
    <DetailPopup title={`Open Positions (${stats.openPositions})`} icon="📋" onClose={onClose}>
      <div className="space-y-3">
        {positions.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
            <div>
              <p className="text-sm font-semibold text-text-primary">{p.title}</p>
              <p className="text-[10px] text-text-muted">{p.dept} · Open since {p.since}</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${urgencyColor[p.urgency]}15`, border: `1px solid ${urgencyColor[p.urgency]}40`, color: urgencyColor[p.urgency] }}>{p.urgency}</span>
          </div>
        ))}
      </div>
    </DetailPopup>
  );
}

const APPROVAL_DATA = [
  { name: 'Priya Sharma', type: 'Casual Leave', days: '2 days', date: 'Aug 18-19', dept: 'Engineering', attendance: 92, tasks: 87, daysLeft: 4 },
  { name: 'Raj Patel', type: 'Work From Home', days: '1 day', date: 'Aug 16', dept: 'Product', attendance: 88, tasks: 74, daysLeft: 2 },
  { name: 'Sarah Chen', type: 'Sick Leave', days: '3 days', date: 'Aug 14-16', dept: 'Design', attendance: 79, tasks: 61, daysLeft: 0 },
  { name: 'Mike Johnson', type: 'Earned Leave', days: '5 days', date: 'Aug 25-29', dept: 'Marketing', attendance: 95, tasks: 93, daysLeft: 11 },
  { name: 'Aisha Khan', type: 'Casual Leave', days: '1 day', date: 'Aug 20', dept: 'Operations', attendance: 85, tasks: 78, daysLeft: 6 },
];

function MiniStatBar({ label, pct, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-text-muted w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(38,38,47,0.9)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[9px] font-bold w-7 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}

function ApprovalsPopup({ stats, onClose }) {
  const approvals = APPROVAL_DATA;
  const [decisions, setDecisions] = useState({});
  const decide = (i, val) => setDecisions((d) => ({ ...d, [i]: val }));
  const attColor = (p) => p >= 90 ? '#4ade80' : p >= 80 ? '#fbbf24' : '#f87171';
  return (
    <DetailPopup title={`Pending Approvals (${stats.pendingApprovals})`} icon="⏳" onClose={onClose}>
      <div className="space-y-4">
        {approvals.map((item, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
            {/* Header row: name + timing badge only */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                <p className="text-[10px] text-text-muted">{item.type} · {item.days} · {item.date} · {item.dept}</p>
              </div>
              {item.daysLeft > 0
                ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>⏰ {item.daysLeft}d away</span>
                : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>Starts today</span>
              }
            </div>
            {/* Stats */}
            <div className="space-y-1.5 mb-3">
              <MiniStatBar label="Attendance" pct={item.attendance} color={attColor(item.attendance)} />
              <MiniStatBar label="Tasks done" pct={item.tasks} color="#DFC993" />
            </div>
            {/* Action row: buttons OR decision badge */}
            {decisions[i] ? (
              <div className="flex items-center justify-center py-2 rounded-lg" style={{ background: decisions[i] === 'approved' ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)', border: `1px solid ${decisions[i] === 'approved' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                <span className="text-xs font-bold" style={{ color: decisions[i] === 'approved' ? '#4ade80' : '#f87171' }}>{decisions[i] === 'approved' ? '✓ Approved' : '✕ Rejected'}</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => decide(i, 'approved')} className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>✓ Approve</button>
                <button onClick={() => decide(i, 'rejected')} className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>✕ Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DetailPopup>
  );
}


const CATEGORY_COLORS = {
  Policy: '#f87171', Event: '#C8A96B', Holiday: '#4ade80',
  Benefit: '#0D2035', Achievement: '#fbbf24', General: '#DFC993',
};

function PostAnnouncementPopup({ onClose, onPost }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [message, setMessage] = useState('');
  const [posted, setPosted] = useState(false);

  function handlePost() {
    if (!title.trim() || !message.trim()) return;
    onPost && onPost({ title: title.trim(), body: message.trim(), tag: category, tagColor: CATEGORY_COLORS[category] || '#DFC993' });
    setPosted(true);
    setTimeout(() => onClose(), 1500);
  }

  return (
    <DetailPopup title="Post Announcement" icon="📢" onClose={onClose}>
      {posted ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <span className="text-4xl">📢</span>
          <p className="text-sm font-bold text-text-primary">Posted successfully!</p>
          <p className="text-xs text-text-muted">Your announcement is now live for all employees.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-muted block mb-2">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm text-text-primary" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }} placeholder="Announcement title..." />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-muted block mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {['Policy', 'Event', 'Holiday', 'Benefit', 'Achievement', 'General'].map((c) => (
                <button key={c} onClick={() => setCategory(c)} className="py-2 rounded-lg text-xs font-medium transition-all" style={{ background: category === c ? `${CATEGORY_COLORS[c]}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${category === c ? CATEGORY_COLORS[c] + '50' : 'rgba(38,38,47,0.9)'}`, color: category === c ? CATEGORY_COLORS[c] : 'var(--color-text-secondary)' }}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-muted block mb-2">Message</label>
            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm text-text-primary resize-none" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }} placeholder="Write your announcement..." />
          </div>
          <button onClick={handlePost} disabled={!title.trim() || !message.trim()} className="w-full py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: title.trim() && message.trim() ? 'linear-gradient(135deg, #0D2035, #C8A96B)' : 'rgba(38,38,47,0.9)', color: title.trim() && message.trim() ? '#000' : 'rgba(255,255,255,0.3)', cursor: title.trim() && message.trim() ? 'pointer' : 'not-allowed' }}>Post to All Employees</button>
        </div>
      )}
    </DetailPopup>
  );
}

function BudgetBreakdownPopup({ onClose }) {
  return (
    <DetailPopup title="Department Budget Breakdown" icon="💸" onClose={onClose}>
      <div className="mb-5">
        <FinancialDonut data={budgetData} title="Budget Allocation" />
      </div>
      <div className="space-y-2">
        {budgetData.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-text-secondary">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text-primary">{item.value}%</span>
              <span className="text-[10px] text-text-muted">₹{(item.value * 1.2).toFixed(0)}L</span>
            </div>
          </div>
        ))}
      </div>
    </DetailPopup>
  );
}

function DepartmentDetailPopup({ dept, stats, onClose }) {
  if (!dept) return null;
  return (
    <DetailPopup title={`${dept.name} Department`} icon="🏢" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-4 rounded-xl text-center" style={{ background: `${dept.color}0d`, border: `1px solid ${dept.color}30` }}>
          <p className="text-3xl font-black" style={{ color: dept.color }}>{dept.count}</p>
          <p className="text-[10px] text-text-muted mt-1">Headcount</p>
        </div>
        <div className="flex-1 p-4 rounded-xl text-center" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
          <p className="text-3xl font-black text-text-primary">{Math.floor(dept.count * 0.12)}</p>
          <p className="text-[10px] text-text-muted mt-1">New Hires</p>
        </div>
        <div className="flex-1 p-4 rounded-xl text-center" style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <p className="text-3xl font-black" style={{ color: '#f87171' }}>{Math.max(1, Math.floor(dept.count * 0.04))}</p>
          <p className="text-[10px] text-text-muted mt-1">Open Positions</p>
        </div>
      </div>
      <div className="rounded-xl" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
        <div className="px-4">
          <InfoRow label="Manager" value="TBD" />
          <InfoRow label="Budget Share" value={`${((dept.count / stats.totalEmployees) * 100).toFixed(0)}%`} color={dept.color} />
          <InfoRow label="Avg Tenure" value="2.4 yrs" />
          <InfoRow label="Attrition" value="4.2%" color="#fbbf24" />
        </div>
      </div>
    </DetailPopup>
  );
}

function ComplaintDetailPopup({ complaint, onClose, onResolve, onUpdateStatus }) {
  if (!complaint) return null;
  const [status, setStatus] = useState(complaint.status);
  const [resolving, setResolving] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const currentSt = STATUS_STYLES[status] || STATUS_STYLES['Pending'];

  function handleMarkInReview() {
    setStatus('In Review');
    onUpdateStatus && onUpdateStatus(complaint.id, 'In Review');
  }

  function handleMarkResolved() {
    setStatus('Resolved');
    setResolving(true);
    setCountdown(5);
    onUpdateStatus && onUpdateStatus(complaint.id, 'Resolved');
    onResolve && onResolve(complaint.id);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) { onClose(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <DetailPopup title="Complaint Detail" icon="📩" onClose={onClose}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: currentSt.bg, border: `1px solid ${currentSt.border}`, color: currentSt.text }}>{status}</span>
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: SEVERITY_COLORS[complaint.severity] }} />
        <span className="text-xs font-semibold" style={{ color: SEVERITY_COLORS[complaint.severity] }}>{complaint.severity}</span>
        <span className="text-[10px] text-text-muted ml-auto">{complaint.date}</span>
      </div>
      <h3 className="text-sm font-bold text-text-primary mb-3">{complaint.subject}</h3>
      <p className="text-xs text-text-secondary leading-relaxed mb-5">{complaint.description}</p>
      <div className="rounded-xl mb-5" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
        <div className="px-4">
          <InfoRow label="Filed by" value={complaint.employee} color="#C8A96B" />
          <InfoRow label="Department" value={complaint.department} />
          <InfoRow label="ID" value={complaint.id} />
        </div>
      </div>
      {resolving && (
        <div className="flex items-center justify-center gap-2 py-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <span className="text-sm">✓</span>
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>Resolved — closing in {countdown}s</span>
        </div>
      )}
      {status === 'Resolved' && !resolving && (
        <div className="flex items-center justify-center gap-2 py-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>✓ This complaint has been resolved</span>
        </div>
      )}
      {status === 'Pending' && !resolving && (
        <div className="flex gap-2">
          <button
            onClick={handleMarkInReview}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.35)', color: '#fb923c' }}
          >🔍 Mark In Review</button>
          <button
            onClick={handleMarkResolved}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}
          >✓ Mark Resolved</button>
        </div>
      )}
      {status === 'In Review' && !resolving && (
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-1.5 py-2 rounded-xl" style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}>
            <span className="text-xs ml-3 font-semibold" style={{ color: '#fb923c' }}>🔍 Under Review</span>
          </div>
          <button
            onClick={handleMarkResolved}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}
          >✓ Mark Resolved</button>
        </div>
      )}
    </DetailPopup>
  );
}

function AnnouncementPopup({ item, onClose }) {
  if (!item) return null;
  return (
    <DetailPopup title={item.title} icon="📢" onClose={onClose}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: `${item.tagColor}15`, color: item.tagColor, border: `1px solid ${item.tagColor}30` }}>{item.tag}</span>
        <span className="text-[10px] text-text-muted">{item.date}</span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
      <div className="mt-5 rounded-xl" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
        <div className="px-4">
          <InfoRow label="Category" value={item.tag} color={item.tagColor} />
          <InfoRow label="Posted" value={item.date} />
          <InfoRow label="Audience" value="All Employees" />
        </div>
      </div>
    </DetailPopup>
  );
}

/* ────── Clickable HR Stat Card ────────────────────────────────────────────────────────────────────────────────────────── */
function HRStatCard({ icon, label, value, trend, trendUp, color, delay, onClick }) {
  return (
    <div
      className={`glass-card p-5 animate-fade-in-up ${delay} cursor-pointer group transition-all duration-200 hover:scale-[1.02]`}
      style={{ opacity: 0 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}15` }}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
      {trend && <p className="text-[10px] font-semibold mt-2" style={{ color: trendUp ? '#C8A96B' : '#f87171' }}>{trendUp ? '↑' : '↓'} {trend}</p>}
      <p className="text-[10px] text-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
    </div>
  );
}

/* ────── Tab Pages ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────── */
function OverviewPage({ stats, onPopup, complaints, onTabChange }) {
  const totalDeptCount = stats.departments.reduce((s, d) => s + d.count, 0);
  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="glass-card p-7 relative overflow-hidden animate-fade-in-up" style={{ opacity: 0 }}>
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(13, 32, 53, 0.1), rgba(200, 169, 107, 0.06))' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">HR Control Center</p>
            <h2 className="text-2xl font-bold text-text-primary">Organization Overview 🏢</h2>
            <p className="text-sm text-text-secondary mt-1">Managing {stats.totalEmployees} employees across {stats.departments.length} departments</p>
          </div>
          <button
            onClick={() => onTabChange('complaints')}
            className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:scale-105"
            style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', color: '#f87171' }}
          >
            📩 {complaints.filter((c) => c.status !== 'Resolved').length} Open Complaints
          </button>
        </div>
      </div>

      {/* Clickable Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        <HRStatCard icon="👥" label="Total Employees" value={stats.totalEmployees} trend="+12 this month" trendUp color="#C8A96B" delay="delay-100" onClick={() => onPopup('total-employees')} />
        <HRStatCard icon="🆕" label="New Hires" value={stats.newHires} trend="+4 vs last month" trendUp color="#0D2035" delay="delay-200" onClick={() => onPopup('new-hires')} />
        <HRStatCard icon="📉" label="Attrition Rate" value={`${stats.attritionRate}%`} trend="-0.5% improvement" trendUp color="#DFC993" delay="delay-300" onClick={() => onPopup('attrition')} />
        <HRStatCard icon="📋" label="Open Positions" value={stats.openPositions} trend="3 urgent" trendUp={false} color="#123452" delay="delay-400" onClick={() => onPopup('open-positions')} />
      </div>

      {/* Quick Actions — 2×2 grid for breathing room */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
        {hrActions.map((action, i) => (
          <button
            key={i}
            className="glass-card p-5 text-left cursor-pointer group relative flex items-center gap-4"
            id={`hr-action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
            style={action.isComplaint ? { border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)' } : undefined}
            onClick={() => {
              if (action.label === 'Approvals') { onPopup('approvals'); return; }
              if (action.label === 'Post Update') { onPopup('post-announcement'); return; }
              if (action.label === 'Recruitment') { onPopup('recruitment'); return; }
              if (action.isComplaint) { onTabChange('complaints'); return; }
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: action.isComplaint ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)' }}
            >
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: action.isComplaint ? '#f87171' : 'var(--color-text-primary)' }}>{action.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{action.desc}</p>
            </div>
            {action.badge && (
              <span
                className="flex-shrink-0 min-w-[26px] h-6 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: action.isComplaint ? 'linear-gradient(135deg, #f87171, #dc2626)' : 'linear-gradient(135deg, #C8A96B, #0D2035)' }}
              >
                {action.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        <div className="col-span-5">
          <div onClick={() => onPopup('budget')} className="cursor-pointer group">
            <FinancialDonut data={budgetData} title="Department Budget (click for breakdown)" />
          </div>
        </div>
        <div className="col-span-3">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="dept-distribution">
            <h3 className="text-base font-semibold text-text-primary mb-1">Departments</h3>
            <p className="text-xs text-text-secondary mb-5">Click any row for details</p>
            <div className="space-y-4">
              {stats.departments.map((dept, i) => (
                <div key={i} className="cursor-pointer hover:bg-white/[0.03] rounded-lg transition-colors p-1 -mx-1" onClick={() => onPopup('dept-detail', dept)}>
                  <DepartmentBar name={dept.name} count={dept.count} total={totalDeptCount} color={dept.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="hr-complaints-summary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-primary">Employee Complaints</h3>
                <p className="text-xs text-text-secondary mt-1">{complaints.filter((c) => c.status !== 'Resolved').length} open · {complaints.filter((c) => c.status === 'Resolved').length} resolved</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(248, 113, 113, 0.1)' }}>📩</div>
            </div>
            <div className="space-y-3">
              {complaints.slice(0, 2).map((c) => {
                const st = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
                return (
                  <div key={c.id} className="p-3.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer" style={{ background: 'var(--color-surface-card)' }} onClick={() => onPopup('complaint', c)}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted font-mono">{c.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: SEVERITY_COLORS[c.severity] }} />
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{c.status}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-text-primary mb-1">{c.subject}</h4>
                    <span className="text-[10px] text-text-secondary">{c.employee} · {c.department}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-span-12"><AttendanceHeatmap data={attendanceData} title="Organization Attendance" /></div>
      </div>
    </div>
  );
}

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance'];
const ROLES_BY_DEPT = {
  Engineering: ['Frontend Engineer', 'Backend Engineer', 'Full-Stack Engineer', 'DevOps Engineer', 'QA Engineer'],
  Design: ['Product Designer', 'UX Researcher', 'UI Designer', 'Brand Designer'],
  Product: ['Product Manager', 'Associate PM', 'Senior PM'],
  Marketing: ['Marketing Lead', 'Content Strategist', 'Growth Manager', 'SEO Specialist'],
  Sales: ['Sales Executive', 'Account Manager', 'Business Development'],
  Operations: ['Operations Analyst', 'Operations Manager', 'Supply Chain Analyst'],
  HR: ['HR Manager', 'Recruiter', 'HR Business Partner'],
  Finance: ['Finance Analyst', 'Accountant', 'CFO'],
};

function AddEmployeePopup({ onClose, onAdd }) {
  const [step, setStep] = useState(1); // 1 = personal, 2 = job, 3 = done
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dept: 'Engineering', role: '', employmentType: 'Full-time',
    startDate: '', salary: '',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const roleOptions = ROLES_BY_DEPT[form.dept] || [];

  function handleSubmit() {
    const name = `${form.firstName} ${form.lastName}`.trim();
    if (!name || !form.role) return;
    const id = `EMP-${Math.floor(1000 + Math.random() * 8999)}`;
    onAdd({ name, role: form.role, dept: form.dept, id, status: 'Active', isNew: true });
    setStep(3);
    setTimeout(() => onClose(), 2000);
  }

  const inputStyle = { background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)', color: 'var(--color-text-main)' };
  const labelCls = 'text-[10px] uppercase tracking-widest text-text-muted block mb-1.5';
  const inputCls = 'w-full rounded-xl px-3 py-2.5 text-xs outline-none focus:border-purple-500/50 transition-colors';

  return (
    <DetailPopup title="Add New Employee" icon="👤" onClose={onClose}>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        {[{ n: 1, label: 'Personal' }, { n: 2, label: 'Job Info' }, { n: 3, label: 'Done' }].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-1.5 flex-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: step >= n ? 'linear-gradient(135deg, #0D2035, #C8A96B)' : 'rgba(38,38,47,0.9)', color: step >= n ? '#000' : 'rgba(255,255,255,0.3)' }}>{n}</div>
            <span className="text-[10px] font-medium" style={{ color: step >= n ? '#DFC993' : 'rgba(255,255,255,0.3)' }}>{label}</span>
            {n < 3 && <div className="flex-1 h-px" style={{ background: step > n ? 'rgba(13,32,53,0.5)' : 'rgba(38,38,47,0.9)' }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First Name *</label>
              <input className={inputCls} style={inputStyle} placeholder="Alex" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Last Name *</label>
              <input className={inputCls} style={inputStyle} placeholder="Morgan" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Work Email *</label>
            <input type="email" className={inputCls} style={inputStyle} placeholder="alex.morgan@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="tel" className={inputCls} style={inputStyle} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.firstName || !form.lastName || !form.email}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: form.firstName && form.lastName && form.email ? 'linear-gradient(135deg, #0D2035, #C8A96B)' : 'rgba(38,38,47,0.9)', color: form.firstName && form.lastName && form.email ? '#000' : 'rgba(255,255,255,0.3)', cursor: form.firstName && form.lastName && form.email ? 'pointer' : 'not-allowed' }}
          >Next: Job Info →</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Department *</label>
            <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={form.dept} onChange={(e) => { set('dept', e.target.value); set('role', ''); }}>
              {DEPARTMENTS.map((d) => <option key={d} value={d} style={{ background: '#131319' }}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Role *</label>
            <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={(e) => set('role', e.target.value)}>
              <option value="" style={{ background: '#131319' }}>Select a role...</option>
              {roleOptions.map((r) => <option key={r} value={r} style={{ background: '#131319' }}>{r}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Employment Type</label>
              <div className="flex flex-col gap-1.5">
                {['Full-time', 'Part-time', 'Contract'].map((t) => (
                  <button key={t} onClick={() => set('employmentType', t)} className="py-2 rounded-xl text-xs font-semibold transition-all" style={{ background: form.employmentType === t ? 'rgba(13,32,53,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.employmentType === t ? 'rgba(13,32,53,0.4)' : 'rgba(38,38,47,0.9)'}`, color: form.employmentType === t ? '#DFC993' : 'var(--color-text-secondary)' }}>{t}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Start Date</label>
                <input type="date" className={inputCls} style={inputStyle} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Annual Salary (₹)</label>
                <input type="number" className={inputCls} style={inputStyle} placeholder="1200000" value={form.salary} onChange={(e) => set('salary', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: 'var(--color-surface-raised)', border: '1px solid rgba(55,55,68,0.8)', color: 'rgba(255,255,255,0.6)' }}>← Back</button>
            <button
              onClick={handleSubmit}
              disabled={!form.role}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: form.role ? 'linear-gradient(135deg, #0D2035, #C8A96B)' : 'rgba(38,38,47,0.9)', color: form.role ? '#000' : 'rgba(255,255,255,0.3)', cursor: form.role ? 'pointer' : 'not-allowed' }}
            >✓ Add Employee</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <span className="text-5xl">🎉</span>
          <p className="text-base font-bold text-text-primary">{form.firstName} {form.lastName} added!</p>
          <p className="text-xs text-text-muted text-center">They've been added to the {form.dept} team as {form.role}.</p>
        </div>
      )}
    </DetailPopup>
  );
}

const INITIAL_EMPLOYEES = [
  { name: 'Alex Morgan', role: 'Sr. Frontend Engineer', dept: 'Engineering', id: 'EMP-2247', status: 'Active' },
  { name: 'Priya Sharma', role: 'Product Designer', dept: 'Design', id: 'EMP-1890', status: 'Active' },
  { name: 'Raj Patel', role: 'Product Manager', dept: 'Product', id: 'EMP-3012', status: 'Active' },
  { name: 'Sarah Chen', role: 'Marketing Lead', dept: 'Marketing', id: 'EMP-1445', status: 'On Leave' },
  { name: 'Mike Johnson', role: 'Sales Executive', dept: 'Sales', id: 'EMP-3041', status: 'Active' },
  { name: 'Aisha Khan', role: 'Operations Analyst', dept: 'Operations', id: 'EMP-2888', status: 'Active' },
];

function EmployeesPage({ stats, onPopup, employees, onAddEmployee }) {
  const totalDeptCount = stats.departments.reduce((s, d) => s + d.count, 0);
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-5">
        {stats.departments.map((dept, i) => (
          <div key={i} className="glass-card p-5 cursor-pointer group hover:scale-[1.02] transition-all duration-200" onClick={() => onPopup('dept-detail', dept)}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-secondary">{dept.name}</span>
              <span className="text-xs font-bold" style={{ color: dept.color }}>{dept.count}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(dept.count / totalDeptCount) * 100}%`, background: dept.color }} />
            </div>
            <p className="text-[10px] text-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-6" id="employees-list">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-text-primary">All Employees</h3>
            <p className="text-xs text-text-secondary mt-1">{employees.length} total · {employees.filter((e) => e.isNew).length > 0 ? `${employees.filter((e) => e.isNew).length} new` : `${stats.newHires} new this month`}</p>
          </div>
          <button
            id="add-employee-btn"
            onClick={() => onPopup('add-employee')}
            className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, rgba(13,32,53,0.15), rgba(200,169,107,0.1))', border: '1px solid rgba(13,32,53,0.3)', color: '#DFC993' }}
          >+ Add Employee</button>
        </div>
        <div className="space-y-2">
          {employees.map((emp, i) => (
            <div key={emp.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors" style={{ background: 'var(--color-surface-card)', border: emp.isNew ? '1px solid rgba(13,32,53,0.2)' : '1px solid transparent' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(13,32,53,0.15), rgba(200,169,107,0.15))', border: '1px solid rgba(13,32,53,0.2)', color: '#DFC993' }}>
                {emp.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">{emp.name}</p>
                  {emp.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(13,32,53,0.2)', border: '1px solid rgba(13,32,53,0.4)', color: '#DFC993' }}>NEW</span>}
                </div>
                <p className="text-[10px] text-text-muted">{emp.role} · {emp.dept}</p>
              </div>
              <span className="text-[10px] text-text-muted font-mono">{emp.id}</span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: emp.status === 'Active' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)', border: `1px solid ${emp.status === 'Active' ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`, color: emp.status === 'Active' ? '#4ade80' : '#fbbf24' }}>{emp.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const STATUS_STYLES_EXTENDED = {
  Pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  'In Review': { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', text: '#fb923c' },
  Resolved: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
};

function ComplaintsPage({ onPopup, complaints: localComplaints }) {
  const list = localComplaints || [];
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="hr-complaints-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Employee Complaints</h3>
            <p className="text-xs text-text-secondary mt-1">{list.filter((c) => c.status !== 'Resolved').length} open · {list.filter((c) => c.status === 'Resolved').length} resolved — click any to review</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
              {list.filter((c) => c.severity === 'High').length} High Priority
            </span>
          </div>
        </div>
        {list.length === 0 && (
          <div className="text-center py-10">
            <p className="text-3xl mb-3">🎉</p>
            <p className="text-sm font-semibold text-text-primary">All complaints resolved!</p>
            <p className="text-xs text-text-muted mt-1">No open complaints at the moment.</p>
          </div>
        )}
        <div className="space-y-4">
          {list.map((c) => {
            const st = STATUS_STYLES_EXTENDED[c.status] || STATUS_STYLES_EXTENDED['Pending'];
            return (
              <div key={c.id} className="p-5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }} onClick={() => onPopup('complaint', c)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-text-muted font-mono">{c.id}</span>
                    <span className="w-2 h-2 rounded-full" style={{ background: SEVERITY_COLORS[c.severity] }} />
                    <span className="text-[10px] font-semibold" style={{ color: SEVERITY_COLORS[c.severity] }}>{c.severity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">{c.date}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{c.status}</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">{c.subject}</h4>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">{c.description}</p>
                <span className="text-[10px] text-text-secondary font-semibold">{c.employee}</span>
                <span className="text-[10px] text-text-muted"> · {c.department}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ApprovalsPage({ stats, onPopup }) {
  const approvals = APPROVAL_DATA;
  const COLORS = ['#C8A96B', '#0D2035', '#DFC993', '#123452', '#8b5cf6'];
  const [decisions, setDecisions] = useState({});
  const decide = (i, val) => setDecisions((d) => ({ ...d, [i]: val }));
  const attColor = (p) => p >= 90 ? '#4ade80' : p >= 80 ? '#fbbf24' : '#f87171';
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="approvals-page">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-text-primary">⏳ Pending Approvals</h3>
            <p className="text-xs text-text-secondary mt-1">{approvals.length} requests awaiting your action</p>
          </div>
        </div>
        <div className="space-y-4">
          {approvals.map((item, i) => (
            <div key={i} className="p-5 rounded-xl" style={{ background: 'var(--color-surface-card)', border: `1px solid ${decisions[i] === 'approved' ? 'rgba(74,222,128,0.15)' : decisions[i] === 'rejected' ? 'rgba(248,113,113,0.15)' : 'rgba(38,38,47,0.9)'}` }}>
              {/* Header row: avatar + name + timing badge only */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${COLORS[i]}20`, border: `1px solid ${COLORS[i]}40`, color: COLORS[i] }}>
                    {item.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                    <p className="text-[10px] text-text-muted">{item.type} · {item.days} · {item.dept}</p>
                  </div>
                </div>
                {/* Only timing badge here — no decision badge */}
                {item.daysLeft > 0
                  ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>⏰ {item.daysLeft}d away</span>
                  : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>Starts today</span>
                }
              </div>
              {/* Attendance & task stats */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-raised)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-text-muted">Attendance</span>
                    <span className="text-[10px] font-bold" style={{ color: attColor(item.attendance) }}>{item.attendance}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(38,38,47,0.9)' }}>
                    <div className="h-full rounded-full" style={{ width: `${item.attendance}%`, background: attColor(item.attendance) }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-raised)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-text-muted">Tasks Done</span>
                    <span className="text-[10px] font-bold" style={{ color: '#DFC993' }}>{item.tasks}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(38,38,47,0.9)' }}>
                    <div className="h-full rounded-full" style={{ width: `${item.tasks}%`, background: '#DFC993' }} />
                  </div>
                </div>
              </div>
              {/* Action row: buttons OR full-width decision banner */}
              {decisions[i] ? (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg" style={{ background: decisions[i] === 'approved' ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)', border: `1px solid ${decisions[i] === 'approved' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                  <span className="text-xs font-bold" style={{ color: decisions[i] === 'approved' ? '#4ade80' : '#f87171' }}>{decisions[i] === 'approved' ? '✓ Approved' : '✕ Rejected'}</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button id={`approve-${i}`} onClick={() => decide(i, 'approved')} className="flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>✓ Approve</button>
                  <button id={`reject-${i}`} onClick={() => decide(i, 'rejected')} className="flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>✕ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function AnnouncementsPage({ onPopup, announcements: localAnnouncements }) {
  const list = localAnnouncements || [];
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="announcements-page">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-text-primary">📢 Announcements</h3>
            <p className="text-xs text-text-secondary mt-1">{list.length} post{list.length !== 1 ? 's' : ''} · company-wide communications</p>
          </div>
          <button id="new-announcement-btn" onClick={() => onPopup('post-announcement')} className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(200,169,107,0.1), rgba(13,32,53,0.1))', border: '1px solid rgba(200,169,107,0.2)', color: '#C8A96B' }}>+ New Post</button>
        </div>
        <div className="space-y-4">
          {list.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }} onClick={() => onPopup('announcement', item)}>
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: item.tagColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${item.tagColor}15`, color: item.tagColor }}>{item.tag}</span>
                  {item.isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>NEW</span>}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-1">{item.body}</p>
              </div>
              <span className="text-[10px] text-text-muted flex-shrink-0">{item.date}</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0 mt-1"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ stats }) {
  const totalDeptCount = stats.departments.reduce((s, d) => s + d.count, 0);
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="hr-reports">
        <h3 className="text-lg font-bold text-text-primary mb-1">Reports & Analytics</h3>
        <p className="text-xs text-text-secondary mb-6">Organization-wide HR metrics</p>
        <div className="grid grid-cols-2 gap-5 mb-6">
          <FinancialDonut data={budgetData} title="Department Budget Allocation" />
          <div className="glass-card p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-4">Headcount by Department</h4>
            <div className="space-y-4">
              {stats.departments.map((dept, i) => <DepartmentBar key={i} name={dept.name} count={dept.count} total={stats.totalEmployees} color={dept.color} />)}
            </div>
          </div>
        </div>
        <AttendanceHeatmap data={attendanceData} title="Organization Attendance" />
      </div>
    </div>
  );
}

/* ────── Recruitment Popup ──────────────────────────────────────────────────────────────────────────────────────────────────── */
function RecruitmentPopup({ stats, onClose }) {
  const positions = [
    { title: 'Sr. Backend Engineer', dept: 'Engineering', urgency: 'Urgent', since: 'Jun 12', applicants: 14 },
    { title: 'Product Designer', dept: 'Design', urgency: 'High', since: 'Jul 5', applicants: 8 },
    { title: 'Sales Manager', dept: 'Sales', urgency: 'Medium', since: 'Jul 20', applicants: 21 },
    { title: 'Data Analyst', dept: 'Product', urgency: 'High', since: 'Aug 1', applicants: 5 },
    { title: 'DevOps Engineer', dept: 'Engineering', urgency: 'Urgent', since: 'Aug 5', applicants: 3 },
    { title: 'Marketing Lead', dept: 'Marketing', urgency: 'Medium', since: 'Aug 8', applicants: 11 },
    { title: 'iOS Developer', dept: 'Engineering', urgency: 'High', since: 'Aug 9', applicants: 6 },
    { title: 'Accounts Manager', dept: 'Finance', urgency: 'Medium', since: 'Aug 10', applicants: 9 },
  ];
  const urgencyColor = { Urgent: '#f87171', High: '#fbbf24', Medium: '#60a5fa' };
  return (
    <DetailPopup title={`Recruitment — ${stats.openPositions} Open Roles`} icon="👥" onClose={onClose} wide>
      <div className="flex gap-3 mb-5">
        {[{ label: 'Open Roles', value: stats.openPositions, color: '#f87171' }, { label: 'Urgent', value: positions.filter(p => p.urgency === 'Urgent').length, color: '#fbbf24' }, { label: 'Total Applicants', value: positions.reduce((s, p) => s + p.applicants, 0), color: '#4ade80' }].map((s, i) => (
          <div key={i} className="flex-1 p-4 rounded-xl text-center" style={{ background: `${s.color}0d`, border: `1px solid ${s.color}30` }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {positions.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
            <div>
              <p className="text-sm font-semibold text-text-primary">{p.title}</p>
              <p className="text-[10px] text-text-muted">{p.dept} · Open since {p.since} · {p.applicants} applicants</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${urgencyColor[p.urgency]}15`, border: `1px solid ${urgencyColor[p.urgency]}40`, color: urgencyColor[p.urgency] }}>{p.urgency}</span>
          </div>
        ))}
      </div>
    </DetailPopup>
  );
}

/* ────── Main Component ────────────────────────────────────────────────────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview', label: '🏠 Overview' },
  { id: 'employees', label: '👥 Employees' },
  { id: 'complaints', label: '📩 Complaints' },
  { id: 'approvals', label: '⏳ Approvals' },
  { id: 'announcements', label: '📢 Announcements' },
  { id: 'reports', label: '📊 Reports' },
];

export default function HRDashboard() {
  const stats = hrStats;
  const [activeTab, setActiveTab] = useState('overview');

  // Mutable complaints, announcements & employees state
  const [complaintsList, setComplaintsList] = useState(initialComplaints);
  const [announcementsList, setAnnouncementsList] = useState(initialAnnouncements);
  const [employeesList, setEmployeesList] = useState(INITIAL_EMPLOYEES);

  // Popup state
  const [popup, setPopup] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const openPopup = (key, data = null) => { setPopup(key); setPopupData(data); };
  const closePopup = () => { setPopup(null); setPopupData(null); };

  function handleResolveComplaint(id) {
    setComplaintsList((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: 'Resolved' } : c)
    );
  }

  function handleUpdateComplaintStatus(id, newStatus) {
    setComplaintsList((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: newStatus } : c)
    );
  }

  function handlePostAnnouncement({ title, body, tag, tagColor }) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newPost = { id: Date.now(), title, body, date: dateStr, tag, tagColor, isNew: true };
    setAnnouncementsList((prev) => [newPost, ...prev]);
  }

  function handleAddEmployee(emp) {
    setEmployeesList((prev) => [emp, ...prev]);
  }

  return (
    <div id="hr-dashboard">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl overflow-x-auto" style={{ background: 'var(--color-surface-raised)', border: '1px solid rgba(0, 0, 0, 0.15)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`hr-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-250 cursor-pointer whitespace-nowrap"
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(13,32,53,0.15), rgba(200,169,107,0.1))' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(0, 0, 0, 0.25)' : '1px solid rgba(0, 0, 0, 0.08)',
              color: activeTab === tab.id ? '#DFC993' : 'var(--color-text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewPage stats={stats} onPopup={openPopup} complaints={complaintsList} onTabChange={setActiveTab} />}
      {activeTab === 'employees' && <EmployeesPage stats={stats} onPopup={openPopup} employees={employeesList} />}
      {activeTab === 'complaints' && <ComplaintsPage onPopup={openPopup} complaints={complaintsList} />}
      {activeTab === 'approvals' && <ApprovalsPage stats={stats} onPopup={openPopup} />}
      {activeTab === 'announcements' && <AnnouncementsPage onPopup={openPopup} announcements={announcementsList} />}
      {activeTab === 'reports' && <ReportsPage stats={stats} />}

      {/* ──── Popups ──── */}
      {popup === 'total-employees' && <TotalEmployeesPopup stats={stats} onClose={closePopup} />}
      {popup === 'new-hires' && <NewHiresPopup stats={stats} onClose={closePopup} />}
      {popup === 'attrition' && <AttritionPopup stats={stats} onClose={closePopup} />}
      {popup === 'open-positions' && <OpenPositionsPopup stats={stats} onClose={closePopup} />}
      {popup === 'approvals' && <ApprovalsPopup stats={stats} onClose={closePopup} />}
      {popup === 'recruitment' && <RecruitmentPopup stats={stats} onClose={closePopup} />}
      {popup === 'post-announcement' && <PostAnnouncementPopup onClose={closePopup} onPost={handlePostAnnouncement} />}
      {popup === 'budget' && <BudgetBreakdownPopup onClose={closePopup} />}
      {popup === 'dept-detail' && <DepartmentDetailPopup dept={popupData} stats={stats} onClose={closePopup} />}
      {popup === 'complaint' && <ComplaintDetailPopup complaint={popupData} onClose={closePopup} onResolve={handleResolveComplaint} onUpdateStatus={handleUpdateComplaintStatus} />}
      {popup === 'announcement' && <AnnouncementPopup item={popupData} onClose={closePopup} />}
      {popup === 'add-employee' && <AddEmployeePopup onClose={closePopup} onAdd={handleAddEmployee} />}

    </div>
  );
}

