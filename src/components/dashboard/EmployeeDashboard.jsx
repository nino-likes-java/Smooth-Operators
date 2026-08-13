import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import AttendanceHeatmap from '../widgets/AttendanceHeatmap';
import ComplaintModal from '../widgets/ComplaintModal';
import {
  attendanceData,
  employeeStats,
  employeeActions,
  employeeComplaints,
  announcements,
} from '../../data/dummyData';

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function getBarColor(hours) {
  if (hours >= 9) return '#7c3aed';
  if (hours >= 7) return '#00f5ff';
  if (hours >= 5) return '#60a5fa';
  return '#fbbf24';
}

const STATUS_STYLES = {
  'In Progress': { bg: 'rgba(0, 245, 255, 0.1)', border: 'rgba(0, 245, 255, 0.2)', text: '#00f5ff' },
  Completed: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
  Pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  'In Review': { bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.2)', text: '#a78bfa' },
};

/* ─── Shared Popup Shell ───────────────────────────────────────────────── */
function DetailPopup({ title, icon, onClose, children }) {
  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 1000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <div
          className="relative rounded-2xl overflow-hidden w-full max-w-lg mx-4"
          style={{
            background: 'rgba(8, 8, 18, 0.97)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.05), rgba(124,58,237,0.08))',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <h2 className="text-base font-bold text-text-primary">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted transition-all hover:bg-white/10 hover:text-white"
            >✕</button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
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

/* ─── Popup Components ─────────────────────────────────────────────────── */
function AttendanceSummaryPopup({ onClose }) {
  const s = employeeStats;
  return (
    <DetailPopup title="Attendance Summary" icon="📅" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Days Present', value: s.thisMonth.daysPresent, color: '#00f5ff' },
          { label: 'Days Absent', value: s.thisMonth.totalDays - s.thisMonth.daysPresent, color: '#f87171' },
          { label: 'Working Days', value: s.thisMonth.totalDays, color: '#a78bfa' },
          { label: 'Overtime Hours', value: `${s.thisMonth.overtimeHours}h`, color: '#4ade80' },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-xl text-center" style={{ background: `${item.color}0d`, border: `1px solid ${item.color}30` }}>
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-[10px] text-text-muted mt-1">{item.label}</p>
          </div>
        ))}
      </div>
      <InfoRow label="Avg Hours / Day" value={`${s.thisMonth.avgHours.toFixed(1)}h`} color="#00f5ff" />
      <InfoRow label="Shift" value={s.shiftTiming} />
      <InfoRow label="Attendance Rate" value={`${((s.thisMonth.daysPresent / s.thisMonth.totalDays) * 100).toFixed(0)}%`} color="#4ade80" />
    </DetailPopup>
  );
}

function LeaveBalancePopup({ onClose }) {
  const lb = employeeStats.leaveBalance;
  return (
    <DetailPopup title="Leave Balance" icon="🌴" onClose={onClose}>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Casual', value: lb.casual, color: '#00f5ff' },
          { label: 'Sick', value: lb.sick, color: '#f87171' },
          { label: 'Earned', value: lb.earned, color: '#4ade80' },
        ].map((l, i) => (
          <div key={i} className="p-4 rounded-xl text-center" style={{ background: `${l.color}0d`, border: `1px solid ${l.color}30` }}>
            <p className="text-3xl font-bold" style={{ color: l.color }}>{l.value}</p>
            <p className="text-[10px] text-text-muted mt-1">{l.label}</p>
          </div>
        ))}
      </div>
      <InfoRow label="Total Available" value={lb.casual + lb.sick + lb.earned} color="#00f5ff" />
      <InfoRow label="Policy Year" value="2026" />
      <InfoRow label="Carry Forward" value="5 days (Earned)" color="#a78bfa" />
    </DetailPopup>
  );
}

function OvertimePopup({ onClose }) {
  const s = employeeStats;
  const ot = s.thisMonth.overtimeHours;
  return (
    <DetailPopup title="Overtime Details" icon="⏰" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-5 rounded-xl text-center" style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.15)' }}>
          <p className="text-4xl font-black" style={{ color: '#00f5ff' }}>{ot}h</p>
          <p className="text-[10px] text-text-muted mt-1">This Month</p>
        </div>
        <div className="flex-1 p-5 rounded-xl text-center" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <p className="text-2xl font-black" style={{ color: '#7c3aed' }}>₹{(ot * 250).toLocaleString()}</p>
          <p className="text-[10px] text-text-muted mt-1">OT Pay</p>
        </div>
      </div>
      <InfoRow label="Rate per hour" value="₹250" color="#4ade80" />
      <InfoRow label="Standard Hours" value="8h / day" />
      <InfoRow label="Avg Daily Hours" value={`${s.thisMonth.avgHours.toFixed(1)}h`} />
    </DetailPopup>
  );
}

function SalaryBreakdownPopup({ payslip, onClose }) {
  const { month, gross, net } = payslip;
  // Parse gross string like "₹1,20,000" → number
  const grossNum = parseInt(gross.replace(/[^0-9]/g, ''), 10) || 120000;
  const basic = Math.round(grossNum * 0.625);
  const hra = Math.round(grossNum * 0.183);
  const conveyance = 8000;
  const special = grossNum - basic - hra - conveyance;
  const pf = 9000;
  const tax = Math.round(grossNum * 0.12);
  const pt = 200;
  return (
    <DetailPopup title={`Salary Breakdown — ${month}`} icon="💰" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-4 rounded-xl" style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.15)' }}>
          <p className="text-[10px] text-text-muted">Gross</p>
          <p className="text-xl font-bold" style={{ color: '#00f5ff' }}>{gross}</p>
        </div>
        <div className="flex-1 p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
          <p className="text-[10px] text-text-muted">Net Pay</p>
          <p className="text-xl font-bold" style={{ color: '#4ade80' }}>{net}</p>
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Earnings</p>
      <div className="rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4">
          <InfoRow label="Basic Salary" value={`₹${basic.toLocaleString()}`} color="#00f5ff" />
          <InfoRow label="HRA" value={`₹${hra.toLocaleString()}`} color="#7c3aed" />
          <InfoRow label="Conveyance" value={`₹${conveyance.toLocaleString()}`} color="#a78bfa" />
          <InfoRow label="Special Allowance" value={`₹${special.toLocaleString()}`} color="#06b6d4" />
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs font-semibold text-text-secondary">Gross Total</span>
            <span className="text-sm font-bold text-text-primary">{gross}</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Deductions</p>
      <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4">
          <InfoRow label="Provident Fund (PF)" value={`-₹${pf.toLocaleString()}`} color="#f87171" />
          <InfoRow label="Income Tax (TDS)" value={`-₹${tax.toLocaleString()}`} color="#f87171" />
          <InfoRow label="Professional Tax" value={`-₹${pt}`} color="#f87171" />
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs font-semibold text-text-secondary">Net Pay</span>
            <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{net}</span>
          </div>
        </div>
      </div>
    </DetailPopup>
  );
}

function ProjectDetailPopup({ project, onClose }) {
  if (!project) return null;
  const st = STATUS_STYLES[project.status] || STATUS_STYLES['Pending'];
  return (
    <DetailPopup title={project.name} icon="🚀" onClose={onClose}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{project.status}</span>
        <span className="text-xs text-text-muted">Due: {project.deadline}</span>
      </div>
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-text-muted">Progress</span>
          <span className="font-bold" style={{ color: st.text }}>{project.progress}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #00f5ff, #7c3aed)', boxShadow: '0 0 10px rgba(0,245,255,0.25)' }} />
        </div>
      </div>
      <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4">
          <InfoRow label="Assigned To" value="Alex Morgan" />
          <InfoRow label="Department" value="Engineering" />
          <InfoRow label="Priority" value="High" color="#f87171" />
          <InfoRow label="Deadline" value={project.deadline} />
        </div>
      </div>
    </DetailPopup>
  );
}

function GoalDetailPopup({ goal, onClose }) {
  if (!goal) return null;
  const st = STATUS_STYLES[goal.status] || STATUS_STYLES['Pending'];
  return (
    <DetailPopup title={goal.title} icon="🎯" onClose={onClose}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{goal.status}</span>
        <span className="text-xs text-text-muted">Due {goal.due}</span>
      </div>
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-text-muted">Progress</span>
          <span className="font-bold" style={{ color: st.text }}>{goal.progress}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${goal.progress}%`, background: goal.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #00f5ff, #7c3aed)' }} />
        </div>
      </div>
      <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4">
          <InfoRow label="Quarter" value="Q3 2026" />
          <InfoRow label="Owner" value="Alex Morgan" />
          <InfoRow label="Department" value="Engineering" />
        </div>
      </div>
    </DetailPopup>
  );
}

function GoalsQuickPopup({ onClose }) {
  const goals = [
    { title: 'Complete React migration', progress: 100, status: 'Completed', due: 'Aug 5' },
    { title: 'Improve test coverage to 80%', progress: 62, status: 'In Progress', due: 'Sep 30' },
    { title: 'Lead 2 knowledge-sharing sessions', progress: 50, status: 'In Progress', due: 'Sep 15' },
    { title: 'Reduce API response time by 20%', progress: 0, status: 'Pending', due: 'Oct 1' },
  ];
  const completed = goals.filter((g) => g.status === 'Completed').length;
  return (
    <DetailPopup title="My Q3 Goals" icon="🎯" onClose={onClose}>
      <div className="flex gap-3 mb-5">
        {[
          { label: 'Total', value: goals.length, color: '#00f5ff' },
          { label: 'Done', value: completed, color: '#4ade80' },
          { label: 'In Progress', value: goals.filter(g => g.status === 'In Progress').length, color: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} className="flex-1 p-3 rounded-xl text-center" style={{ background: `${s.color}0d`, border: `1px solid ${s.color}30` }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {goals.map((goal, i) => {
          const st = STATUS_STYLES[goal.status] || STATUS_STYLES['Pending'];
          return (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-text-primary flex-1 mr-2">{goal.title}</p>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{goal.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${goal.progress}%`, background: goal.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #00f5ff, #7c3aed)' }} />
                </div>
                <span className="text-[10px] font-semibold text-text-muted w-8 text-right">{goal.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
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
      <div className="mt-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4">
          <InfoRow label="Category" value={item.tag} color={item.tagColor} />
          <InfoRow label="Posted" value={item.date} />
          <InfoRow label="Audience" value="All Employees" />
        </div>
      </div>
    </DetailPopup>
  );
}

function ComplaintDetailPopup({ complaint, onClose }) {
  if (!complaint) return null;
  const st = STATUS_STYLES[complaint.status] || STATUS_STYLES['Pending'];
  return (
    <DetailPopup title="Complaint Detail" icon="⚠️" onClose={onClose}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{complaint.status}</span>
        <span className="text-[10px] text-text-muted">{complaint.category} · {complaint.date}</span>
      </div>
      <h3 className="text-sm font-bold text-text-primary mb-3">{complaint.subject}</h3>
      <p className="text-xs text-text-secondary leading-relaxed mb-5">{complaint.description}</p>
      <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4">
          <InfoRow label="ID" value={complaint.id} color="#00f5ff" />
          <InfoRow label="Category" value={complaint.category} />
          <InfoRow label="Severity" value={complaint.severity} color={complaint.severity === 'High' ? '#f87171' : complaint.severity === 'Medium' ? '#fbbf24' : '#60a5fa'} />
          <InfoRow label="Status" value={complaint.status} color={st.text} />
        </div>
      </div>
    </DetailPopup>
  );
}

function ApplyLeavePopup({ onClose, onApply }) {
  const [type, setType] = useState('Casual');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!fromDate) return;
    onApply && onApply({ type, from: fromDate, to: toDate || fromDate, reason });
    setSubmitted(true);
    setTimeout(() => onClose(), 1500);
  }

  return (
    <DetailPopup title="Apply for Leave" icon="📋" onClose={onClose}>
      {submitted ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <span className="text-4xl">✅</span>
          <p className="text-sm font-bold text-text-primary">Leave request submitted!</p>
          <p className="text-xs text-text-muted">Your request is pending HR approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-muted block mb-2">Leave Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Casual', 'Sick', 'Earned'].map((t) => (
                <button key={t} onClick={() => setType(t)} className="py-2 rounded-xl text-xs font-semibold transition-all" style={{ background: type === t ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${type === t ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.08)'}`, color: type === t ? '#00f5ff' : 'var(--color-text-secondary)' }}>{t}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted block mb-2">From</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full rounded-xl px-3 py-2 text-xs text-text-primary" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted block mb-2">To</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full rounded-xl px-3 py-2 text-xs text-text-primary" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-text-muted block mb-2">Reason</label>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-xl px-3 py-2 text-xs text-text-primary resize-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="Briefly describe your reason..." />
          </div>
          <button onClick={handleSubmit} disabled={!fromDate} className="w-full py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: fromDate ? 'linear-gradient(135deg, #00f5ff, #7c3aed)' : 'rgba(255,255,255,0.06)', color: fromDate ? '#000' : 'rgba(255,255,255,0.3)', cursor: fromDate ? 'pointer' : 'not-allowed' }}>Submit Request</button>
        </div>
      )}
    </DetailPopup>
  );
}

/* ─── Clickable Stat Card ──────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color, delay, onClick }) {
  return (
    <div
      className={`glass-card p-5 animate-fade-in-up ${delay} cursor-pointer group transition-all duration-200 hover:scale-[1.02]`}
      style={{ opacity: 0 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}15` }}>{icon}</div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: `${color}15`, color }}>{sub}</span>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
      <p className="text-[10px] text-text-muted mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
    </div>
  );
}

function WeeklyHoursTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '8px 14px' }}>
      <p style={{ color: '#00f5ff', fontWeight: 600, fontSize: 13, margin: 0 }}>{d.day}</p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '4px 0 0' }}>{d.hours}h worked</p>
    </div>
  );
}

/* ─── Tab Pages ────────────────────────────────────────────────────────── */

function OverviewPage({ stats, onOpenComplaint, onPopup }) {
  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="glass-card p-7 relative overflow-hidden animate-fade-in-up" style={{ opacity: 0 }}>
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.08), rgba(124, 58, 237, 0.08))' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">Welcome back,</p>
            <h2 className="text-2xl font-bold text-text-primary">{stats.name} {stats.avatar}</h2>
            <p className="text-sm text-text-secondary mt-1">{stats.role} · {stats.department}</p>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}>{stats.employeeId}</span>
              <span className="text-xs text-text-muted">Manager: <span className="text-text-secondary font-medium">{stats.manager}</span></span>
              <span className="text-xs text-text-muted">Shift: <span className="text-text-secondary font-medium">{stats.shiftTiming}</span></span>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-text-muted mb-1">Joined</p>
            <p className="text-sm font-semibold text-text-secondary">{stats.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards — clickable */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard icon="📅" label="Days Present" value={`${stats.thisMonth.daysPresent}/${stats.thisMonth.totalDays}`} sub="This Month" color="#00f5ff" delay="delay-100" onClick={() => onPopup('attendance')} />
        <StatCard icon="⏱️" label="Avg Hours/Day" value={stats.thisMonth.avgHours.toFixed(1)} sub="On Track" color="#7c3aed" delay="delay-200" onClick={() => onPopup('attendance')} />
        <StatCard icon="🌴" label="Leave Balance" value={stats.leaveBalance.casual + stats.leaveBalance.sick + stats.leaveBalance.earned} sub={`${stats.leaveBalance.casual}C · ${stats.leaveBalance.sick}S · ${stats.leaveBalance.earned}E`} color="#a78bfa" delay="delay-300" onClick={() => onPopup('leave')} />
        <StatCard icon="⏰" label="Overtime Hours" value={stats.thisMonth.overtimeHours} sub="This Month" color="#06b6d4" delay="delay-400" onClick={() => onPopup('overtime')} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
        {employeeActions.map((action, i) => (
          <button
            key={i}
            className={`glass-card p-4 text-left cursor-pointer group ${action.isComplaint ? 'relative' : ''}`}
            id={`action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
            onClick={() => {
              if (action.isComplaint) { onOpenComplaint(); return; }
              if (action.label === 'View Payslip') { onPopup('salary-quick'); return; }
              if (action.label === 'Apply Leave') { onPopup('apply-leave'); return; }
              if (action.label === 'My Goals') { onPopup('goals-quick'); return; }
            }}
            style={action.isComplaint ? { border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)' } : undefined}
          >
            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">{action.icon}</div>
            <p className="text-sm font-semibold" style={{ color: action.isComplaint ? '#f87171' : 'var(--color-text-primary)' }}>{action.label}</p>
            <p className="text-xs text-text-muted mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <div className="bento-grid">
        <div className="col-span-8"><AttendanceHeatmap data={attendanceData} title="My Attendance" /></div>
        <div className="col-span-4">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="weekly-hours-chart">
            <h3 className="text-base font-semibold text-text-primary mb-1">This Week</h3>
            <p className="text-xs text-text-secondary mb-4">Daily working hours breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.weeklyHours} barSize={28}>
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 12]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<WeeklyHoursTooltip />} cursor={false} />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {stats.weeklyHours.map((entry, index) => <Cell key={index} fill={getBarColor(entry.hours)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-text-muted">
              <div className="w-3 h-[2px] rounded-full" style={{ background: '#00f5ff' }} /><span>Standard (7–8h)</span>
              <div className="w-3 h-[2px] rounded-full ml-2" style={{ background: '#7c3aed' }} /><span>Overtime (9h+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements — clickable */}
      <div className="glass-card p-6 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
        <h3 className="text-base font-semibold text-text-primary mb-4">📢 Announcements <span className="text-xs text-text-muted font-normal ml-2">— click to read more</span></h3>
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] cursor-pointer group" onClick={() => onPopup('announcement', item)}>
              <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: item.tagColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${item.tagColor}15`, color: item.tagColor }}>{item.tag}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-1">{item.body}</p>
              </div>
              <span className="text-[10px] text-text-muted flex-shrink-0">{item.date}</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0 mt-0.5"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AttendancePage({ onPopup }) {
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-1">Attendance Overview</h3>
        <p className="text-xs text-text-secondary mb-6">Your full attendance history — past 12 months</p>
        <AttendanceHeatmap data={attendanceData} title="Full Year Attendance" />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Days Present', value: '18/22', color: '#00f5ff', icon: '✅', popup: 'attendance' },
          { label: 'Absent Days', value: '4', color: '#f87171', icon: '❌', popup: 'attendance' },
          { label: 'Half Days', value: '2', color: '#fbbf24', icon: '🌗', popup: 'attendance' },
          { label: 'Late Check-ins', value: '3', color: '#a78bfa', icon: '⏰', popup: 'attendance' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-5 cursor-pointer group hover:scale-[1.02] transition-all duration-200" onClick={() => onPopup(item.popup)}>
            <div className="text-2xl mb-3">{item.icon}</div>
            <p className="text-2xl font-bold text-text-primary">{item.value}</p>
            <p className="text-xs text-text-secondary mt-1">{item.label}</p>
            <p className="text-[10px] text-text-muted mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsPage({ stats, onPopup }) {
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="projects-page">
        <h3 className="text-lg font-bold text-text-primary mb-1">My Projects</h3>
        <p className="text-xs text-text-secondary mb-6">Click any project for full details</p>
        <div className="space-y-4">
          {stats.recentProjects.map((project, i) => {
            const st = STATUS_STYLES[project.status] || STATUS_STYLES['Pending'];
            return (
              <div key={i} className="p-5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} onClick={() => onPopup('project', project)}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">{project.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{project.status}</span>
                    <span className="text-[10px] text-text-muted">Due {project.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${project.progress}%`, background: project.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #00f5ff, #7c3aed)' }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-10 text-right">{project.progress}%</span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LeavePage({ stats, onPopup, leaveHistory: propLeaveHistory }) {
  const leaveTypes = [
    { type: 'Casual Leave', balance: stats.leaveBalance.casual, total: 12, color: '#00f5ff', icon: '🏖️' },
    { type: 'Sick Leave', balance: stats.leaveBalance.sick, total: 10, color: '#7c3aed', icon: '🏥' },
    { type: 'Earned Leave', balance: stats.leaveBalance.earned, total: 15, color: '#a78bfa', icon: '💼' },
  ];
  const leaveHistory = propLeaveHistory || [
    { type: 'Casual', date: 'Aug 2, 2026', days: 1, status: 'Approved' },
    { type: 'Sick', date: 'Jul 18, 2026', days: 2, status: 'Approved' },
    { type: 'Earned', date: 'Jun 5-7, 2026', days: 3, status: 'Approved' },
    { type: 'Casual', date: 'May 22, 2026', days: 1, status: 'Rejected' },
  ];
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-5">
        {leaveTypes.map((lt, i) => (
          <div key={i} className="glass-card p-6 cursor-pointer group hover:scale-[1.02] transition-all duration-200" onClick={() => onPopup('leave')}>
            <div className="text-3xl mb-4">{lt.icon}</div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-3xl font-bold text-text-primary">{lt.balance}</span>
              <span className="text-sm text-text-muted mb-1">/ {lt.total} days</span>
            </div>
            <p className="text-xs text-text-secondary font-medium mb-3">{lt.type}</p>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(lt.balance / lt.total) * 100}%`, background: lt.color }} />
            </div>
            <p className="text-[10px] text-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-6" id="leave-history">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Leave History</h3>
            <p className="text-xs text-text-secondary mt-1">Recent approved & rejected requests</p>
          </div>
          <button id="apply-leave-btn" onClick={() => onPopup('apply-leave')} className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}>
            + Apply Leave
          </button>
        </div>
        <div className="space-y-3">
          {leaveHistory.map((item, i) => {
            const approved = item.status === 'Approved';
            const isPending = item.status === 'Pending';
            return (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>🌴</div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{item.type} Leave</p>
                    <p className="text-[10px] text-text-muted">{item.date} · {item.days} day{item.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: approved ? 'rgba(74,222,128,0.1)' : isPending ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${approved ? 'rgba(74,222,128,0.2)' : isPending ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)'}`, color: approved ? '#4ade80' : isPending ? '#fbbf24' : '#f87171' }}>
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PayslipPage({ onSalaryPopup }) {
  const payslips = [
    { month: 'July 2026', gross: '₹1,20,000', net: '₹98,400', status: 'Credited' },
    { month: 'June 2026', gross: '₹1,20,000', net: '₹98,400', status: 'Credited' },
    { month: 'May 2026', gross: '₹1,18,000', net: '₹96,780', status: 'Credited' },
    { month: 'April 2026', gross: '₹1,18,000', net: '₹96,780', status: 'Credited' },
  ];
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="payslip-page">
        <h3 className="text-lg font-bold text-text-primary mb-1">Payslips</h3>
        <p className="text-xs text-text-secondary mb-6">Click any month to view full salary breakdown</p>
        <div className="space-y-3">
          {payslips.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => onSalaryPopup(p)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.15)' }}>💰</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{p.month}</p>
                  <p className="text-xs text-text-muted">Gross: {p.gross} · Net: <span className="text-text-secondary font-semibold">{p.net}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>{p.status}</span>
                <button
                  id={`download-payslip-${i}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  ↓ Download
                </button>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted opacity-0 group-hover:opacity-60 transition-opacity"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalsPage({ onPopup }) {
  const goals = [
    { title: 'Complete React migration', progress: 100, status: 'Completed', due: 'Aug 5' },
    { title: 'Improve test coverage to 80%', progress: 62, status: 'In Progress', due: 'Sep 30' },
    { title: 'Lead 2 knowledge-sharing sessions', progress: 50, status: 'In Progress', due: 'Sep 15' },
    { title: 'Reduce API response time by 20%', progress: 0, status: 'Pending', due: 'Oct 1' },
  ];
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="goals-page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Q3 Goals</h3>
            <p className="text-xs text-text-secondary mt-1">Click any goal for details</p>
          </div>
          <span className="text-sm font-bold text-text-primary">
            <span className="gradient-text">1/4</span> <span className="text-text-muted text-xs font-normal">completed</span>
          </span>
        </div>
        <div className="space-y-4">
          {goals.map((goal, i) => {
            const st = STATUS_STYLES[goal.status] || STATUS_STYLES['Pending'];
            return (
              <div key={i} className="p-5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} onClick={() => onPopup('goal', goal)}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">{goal.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{goal.status}</span>
                    <span className="text-[10px] text-text-muted">Due {goal.due}</span>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted opacity-0 group-hover:opacity-60 transition-opacity"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${goal.progress}%`, background: goal.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #00f5ff, #7c3aed)' }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-10 text-right">{goal.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview', label: '🏠 Overview' },
  { id: 'attendance', label: '📅 Attendance' },
  { id: 'projects', label: '📊 Projects' },
  { id: 'leave', label: '🌴 Leave' },
  { id: 'payslip', label: '💰 Payslip' },
  { id: 'goals', label: '🎯 Goals' },
];

const INITIAL_LEAVE_HISTORY = [
  { type: 'Casual', date: 'Aug 2, 2026', days: 1, status: 'Approved' },
  { type: 'Sick', date: 'Jul 18, 2026', days: 2, status: 'Approved' },
  { type: 'Earned', date: 'Jun 5-7, 2026', days: 3, status: 'Approved' },
  { type: 'Casual', date: 'May 22, 2026', days: 1, status: 'Rejected' },
];

export default function EmployeeDashboard() {
  const stats = employeeStats;
  const [activeTab, setActiveTab] = useState('overview');
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState(INITIAL_LEAVE_HISTORY);

  // Popup state
  const [popup, setPopup] = useState(null); // string key
  const [popupData, setPopupData] = useState(null); // arbitrary payload
  const [salaryPayslip, setSalaryPayslip] = useState(null);

  const openPopup = (key, data = null) => { setPopup(key); setPopupData(data); };
  const closePopup = () => { setPopup(null); setPopupData(null); setSalaryPayslip(null); };

  function handleApplyLeave({ type, from, to }) {
    const days = from === to ? 1 : Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
    const dateStr = from === to ? new Date(from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : `${new Date(from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${new Date(to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    setLeaveHistory((prev) => [{ type, date: dateStr, days, status: 'Pending' }, ...prev]);
  }

  return (
    <div id="employee-dashboard">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`emp-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-250 cursor-pointer whitespace-nowrap"
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(0,245,255,0.25)' : '1px solid transparent',
              color: activeTab === tab.id ? '#00f5ff' : 'rgba(255,255,255,0.5)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewPage stats={stats} onOpenComplaint={() => setShowComplaintModal(true)} onPopup={openPopup} />}
      {activeTab === 'attendance' && <AttendancePage onPopup={openPopup} />}
      {activeTab === 'projects' && <ProjectsPage stats={stats} onPopup={openPopup} />}
      {activeTab === 'leave' && <LeavePage stats={stats} onPopup={openPopup} leaveHistory={leaveHistory} />}
      {activeTab === 'payslip' && <PayslipPage onSalaryPopup={(p) => setSalaryPayslip(p)} />}
      {activeTab === 'goals' && <GoalsPage onPopup={openPopup} />}

      {/* Complaint Modal */}
      <ComplaintModal isOpen={showComplaintModal} onClose={() => setShowComplaintModal(false)} />

      {/* ── Popups ── */}
      {popup === 'attendance' && <AttendanceSummaryPopup onClose={closePopup} />}
      {popup === 'leave' && <LeaveBalancePopup onClose={closePopup} />}
      {popup === 'overtime' && <OvertimePopup onClose={closePopup} />}
      {popup === 'apply-leave' && <ApplyLeavePopup onClose={closePopup} onApply={handleApplyLeave} />}
      {popup === 'project' && <ProjectDetailPopup project={popupData} onClose={closePopup} />}
      {popup === 'goal' && <GoalDetailPopup goal={popupData} onClose={closePopup} />}
      {popup === 'announcement' && <AnnouncementPopup item={popupData} onClose={closePopup} />}
      {popup === 'complaint' && <ComplaintDetailPopup complaint={popupData} onClose={closePopup} />}
      {/* Quick action salary popup — opens breakdown for latest month */}
      {popup === 'salary-quick' && (
        <SalaryBreakdownPopup payslip={{ month: 'August 2026', gross: '₹1,25,000', net: '₹1,01,300' }} onClose={closePopup} />
      )}
      {popup === 'goals-quick' && <GoalsQuickPopup onClose={closePopup} />}
      {/* Payslip tab salary popup */}
      {salaryPayslip && <SalaryBreakdownPopup payslip={salaryPayslip} onClose={closePopup} />}
    </div>
  );
}
