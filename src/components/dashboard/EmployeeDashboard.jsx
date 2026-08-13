import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import AttendanceHeatmap from '../widgets/AttendanceHeatmap';
import ComplaintModal from '../widgets/ComplaintModal';
import {
  attendanceData,
  employeeStats,
  employeeActions,
  employeeComplaints,
} from '../../data/dummyData';

/* ── Helpers ── */
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

function StatCard({ icon, label, value, sub, color, delay }) {
  return (
    <div className={`glass-card p-5 animate-fade-in-up ${delay}`} style={{ opacity: 0 }}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}15` }}
        >
          {icon}
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-1 rounded-full"
          style={{ background: `${color}15`, color }}
        >
          {sub}
        </span>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </div>
  );
}

function WeeklyHoursTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(10, 10, 15, 0.92)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: 12,
      padding: '8px 14px',
    }}>
      <p style={{ color: '#00f5ff', fontWeight: 600, fontSize: 13, margin: 0 }}>{d.day}</p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '4px 0 0' }}>{d.hours}h worked</p>
    </div>
  );
}

/* ── TAB PAGES ── */

function OverviewPage({ stats, onOpenComplaint }) {
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
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}>
                {stats.employeeId}
              </span>
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

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard icon="📅" label="Days Present" value={`${stats.thisMonth.daysPresent}/${stats.thisMonth.totalDays}`} sub="This Month" color="#00f5ff" delay="delay-100" />
        <StatCard icon="⏱️" label="Avg Hours/Day" value={stats.thisMonth.avgHours.toFixed(1)} sub="On Track" color="#7c3aed" delay="delay-200" />
        <StatCard icon="🌴" label="Leave Balance" value={stats.leaveBalance.casual + stats.leaveBalance.sick + stats.leaveBalance.earned} sub={`${stats.leaveBalance.casual}C · ${stats.leaveBalance.sick}S · ${stats.leaveBalance.earned}E`} color="#a78bfa" delay="delay-300" />
        <StatCard icon="⏰" label="Overtime Hours" value={stats.thisMonth.overtimeHours} sub="This Month" color="#06b6d4" delay="delay-400" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
        {employeeActions.map((action, i) => (
          <button
            key={i}
            className={`glass-card p-4 text-left cursor-pointer group ${action.isComplaint ? 'relative' : ''}`}
            id={`action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
            onClick={action.isComplaint ? onOpenComplaint : undefined}
            style={action.isComplaint ? { border: '1px solid rgba(248, 113, 113, 0.2)', background: 'rgba(248, 113, 113, 0.04)' } : undefined}
          >
            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">{action.icon}</div>
            <p className="text-sm font-semibold" style={{ color: action.isComplaint ? '#f87171' : 'var(--color-text-primary)' }}>{action.label}</p>
            <p className="text-xs text-text-muted mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <div className="bento-grid">
        <div className="col-span-8">
          <AttendanceHeatmap data={attendanceData} title="My Attendance" />
        </div>
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
                  {stats.weeklyHours.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.hours)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-text-muted">
              <div className="w-3 h-[2px] rounded-full" style={{ background: '#00f5ff' }} />
              <span>Standard (7–8h)</span>
              <div className="w-3 h-[2px] rounded-full ml-2" style={{ background: '#7c3aed' }} />
              <span>Overtime (9h+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-1">Attendance Overview</h3>
        <p className="text-xs text-text-secondary mb-6">Your full attendance history — past 12 months</p>
        <AttendanceHeatmap data={attendanceData} title="Full Year Attendance" />
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Days Present', value: '18/22', color: '#00f5ff', icon: '✅' },
          { label: 'Absent Days', value: '4', color: '#f87171', icon: '❌' },
          { label: 'Half Days', value: '2', color: '#fbbf24', icon: '🌗' },
          { label: 'Late Check-ins', value: '3', color: '#a78bfa', icon: '⏰' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-5">
            <div className="text-2xl mb-3">{item.icon}</div>
            <p className="text-2xl font-bold text-text-primary">{item.value}</p>
            <p className="text-xs text-text-secondary mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsPage({ stats }) {
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="projects-page">
        <h3 className="text-lg font-bold text-text-primary mb-1">My Projects</h3>
        <p className="text-xs text-text-secondary mb-6">Active and completed assignments</p>
        <div className="space-y-4">
          {stats.recentProjects.map((project, i) => {
            const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES['Pending'];
            return (
              <div key={i} className="p-5 rounded-2xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">{project.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.text }}>
                      {project.status}
                    </span>
                    <span className="text-[10px] text-text-muted">Due {project.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${project.progress}%`, background: project.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #00f5ff, #7c3aed)' }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary w-10 text-right">{project.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LeavePage({ stats }) {
  const leaveTypes = [
    { type: 'Casual Leave', balance: stats.leaveBalance.casual, total: 12, color: '#00f5ff', icon: '🏖️' },
    { type: 'Sick Leave', balance: stats.leaveBalance.sick, total: 10, color: '#7c3aed', icon: '🏥' },
    { type: 'Earned Leave', balance: stats.leaveBalance.earned, total: 15, color: '#a78bfa', icon: '💼' },
  ];

  const leaveHistory = [
    { type: 'Casual', date: 'Aug 2, 2026', days: 1, status: 'Approved' },
    { type: 'Sick', date: 'Jul 18, 2026', days: 2, status: 'Approved' },
    { type: 'Earned', date: 'Jun 5-7, 2026', days: 3, status: 'Approved' },
    { type: 'Casual', date: 'May 22, 2026', days: 1, status: 'Rejected' },
  ];

  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-5">
        {leaveTypes.map((lt, i) => (
          <div key={i} className="glass-card p-6">
            <div className="text-3xl mb-4">{lt.icon}</div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-3xl font-bold text-text-primary">{lt.balance}</span>
              <span className="text-sm text-text-muted mb-1">/ {lt.total} days</span>
            </div>
            <p className="text-xs text-text-secondary font-medium mb-3">{lt.type}</p>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(lt.balance / lt.total) * 100}%`, background: lt.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6" id="leave-history">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Leave History</h3>
            <p className="text-xs text-text-secondary mt-1">Recent approved & rejected requests</p>
          </div>
          <button
            id="apply-leave-btn"
            className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}
          >
            + Apply Leave
          </button>
        </div>
        <div className="space-y-3">
          {leaveHistory.map((item, i) => {
            const approved = item.status === 'Approved';
            return (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    🌴
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{item.type} Leave</p>
                    <p className="text-[10px] text-text-muted">{item.date} · {item.days} day{item.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: approved ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${approved ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`, color: approved ? '#4ade80' : '#f87171' }}>
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

function PayslipPage() {
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
        <p className="text-xs text-text-secondary mb-6">Download your monthly salary statements</p>
        <div className="space-y-3">
          {payslips.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.15)' }}>
                  💰
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{p.month}</p>
                  <p className="text-xs text-text-muted">Gross: {p.gross} · Net: <span className="text-text-secondary font-semibold">{p.net}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
                  {p.status}
                </span>
                <button
                  id={`download-payslip-${i}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}
                >
                  ↓ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalsPage() {
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
            <p className="text-xs text-text-secondary mt-1">Track your quarterly objectives</p>
          </div>
          <span className="text-sm font-bold text-text-primary">
            <span className="gradient-text">1/4</span> <span className="text-text-muted text-xs font-normal">completed</span>
          </span>
        </div>
        <div className="space-y-4">
          {goals.map((goal, i) => {
            const statusStyle = STATUS_STYLES[goal.status] || STATUS_STYLES['Pending'];
            return (
              <div key={i} className="p-5 rounded-2xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">{goal.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.text }}>
                      {goal.status}
                    </span>
                    <span className="text-[10px] text-text-muted">Due {goal.due}</span>
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

/* ── MAIN COMPONENT ── */
const TABS = [
  { id: 'overview', label: '🏠 Overview' },
  { id: 'attendance', label: '📅 Attendance' },
  { id: 'projects', label: '📊 Projects' },
  { id: 'leave', label: '🌴 Leave' },
  { id: 'payslip', label: '💰 Payslip' },
  { id: 'goals', label: '🎯 Goals' },
];

export default function EmployeeDashboard() {
  const stats = employeeStats;
  const [activeTab, setActiveTab] = useState('overview');
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  return (
    <div id="employee-dashboard">
      {/* Tab Navigation */}
      <div
        className="flex items-center gap-1 mb-6 p-1 rounded-2xl overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
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
      {activeTab === 'overview' && <OverviewPage stats={stats} onOpenComplaint={() => setShowComplaintModal(true)} />}
      {activeTab === 'attendance' && <AttendancePage />}
      {activeTab === 'projects' && <ProjectsPage stats={stats} />}
      {activeTab === 'leave' && <LeavePage stats={stats} />}
      {activeTab === 'payslip' && <PayslipPage />}
      {activeTab === 'goals' && <GoalsPage />}

      {/* Complaint Modal */}
      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
      />
    </div>
  );
}
