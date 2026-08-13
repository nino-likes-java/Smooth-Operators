import { useState } from 'react';
import AttendanceHeatmap from '../widgets/AttendanceHeatmap';
import FinancialDonut from '../widgets/FinancialDonut';
import {
  attendanceData,
  budgetData,
  hrStats,
  hrActions,
  complaints,
  announcements,
} from '../../data/dummyData';

/* ── Helpers ── */
function HRStatCard({ icon, label, value, trend, trendUp, color, delay }) {
  return (
    <div className={`glass-card p-5 animate-fade-in-up ${delay}`} style={{ opacity: 0 }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}15` }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
      {trend && (
        <p className="text-[10px] font-semibold mt-2" style={{ color: trendUp ? '#00f5ff' : '#f87171' }}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
  );
}

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

const STATUS_STYLES = {
  Pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  'In Review': { bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.2)', text: '#a78bfa' },
  Resolved: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
};

const SEVERITY_COLORS = { Low: '#60a5fa', Medium: '#fbbf24', High: '#f87171' };

/* ── TAB PAGES ── */

function OverviewPage({ stats }) {
  const totalDeptCount = stats.departments.reduce((s, d) => s + d.count, 0);
  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="glass-card p-7 relative overflow-hidden animate-fade-in-up" style={{ opacity: 0 }}>
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(0, 245, 255, 0.06))' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">HR Control Center</p>
            <h2 className="text-2xl font-bold text-text-primary">Organization Overview 🏢</h2>
            <p className="text-sm text-text-secondary mt-1">Managing {stats.totalEmployees} employees across {stats.departments.length} departments</p>
          </div>
          <div
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', color: '#f87171' }}
          >
            📨 {complaints.filter((c) => c.status !== 'Resolved').length} Open Complaints
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        <HRStatCard icon="👥" label="Total Employees" value={stats.totalEmployees} trend="+12 this month" trendUp color="#00f5ff" delay="delay-100" />
        <HRStatCard icon="🆕" label="New Hires" value={stats.newHires} trend="+4 vs last month" trendUp color="#7c3aed" delay="delay-200" />
        <HRStatCard icon="📉" label="Attrition Rate" value={`${stats.attritionRate}%`} trend="-0.5% improvement" trendUp color="#a78bfa" delay="delay-300" />
        <HRStatCard icon="📋" label="Open Positions" value={stats.openPositions} trend="3 urgent" trendUp={false} color="#06b6d4" delay="delay-400" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
        {hrActions.map((action, i) => (
          <button key={i} className="glass-card p-4 text-left cursor-pointer group relative" id={`hr-action-${action.label.toLowerCase().replace(/\s/g, '-')}`} style={action.isComplaint ? { border: '1px solid rgba(248, 113, 113, 0.2)', background: 'rgba(248, 113, 113, 0.04)' } : undefined}>
            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">{action.icon}</div>
            <p className="text-sm font-semibold" style={{ color: action.isComplaint ? '#f87171' : 'var(--color-text-primary)' }}>{action.label}</p>
            <p className="text-xs text-text-muted mt-0.5">{action.desc}</p>
            {action.badge && (
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: action.isComplaint ? 'linear-gradient(135deg, #f87171, #dc2626)' : 'linear-gradient(135deg, #00f5ff, #7c3aed)' }}>
                {action.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        <div className="col-span-5">
          <FinancialDonut data={budgetData} title="Department Budget" />
        </div>
        <div className="col-span-3">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="dept-distribution">
            <h3 className="text-base font-semibold text-text-primary mb-1">Departments</h3>
            <p className="text-xs text-text-secondary mb-5">Headcount distribution</p>
            <div className="space-y-4">
              {stats.departments.map((dept, i) => (
                <DepartmentBar key={i} name={dept.name} count={dept.count} total={totalDeptCount} color={dept.color} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="hr-complaints-summary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-primary">Employee Complaints</h3>
                <p className="text-xs text-text-secondary mt-1">
                  {complaints.filter((c) => c.status !== 'Resolved').length} open · {complaints.filter((c) => c.status === 'Resolved').length} resolved
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(248, 113, 113, 0.1)' }}>📨</div>
            </div>
            <div className="space-y-3">
              {complaints.slice(0, 2).map((c) => {
                const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
                return (
                  <div key={c.id} className="p-3.5 rounded-xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted font-mono">{c.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: SEVERITY_COLORS[c.severity] }} />
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.text }}>
                        {c.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-text-primary mb-1">{c.subject}</h4>
                    <span className="text-[10px] text-text-secondary">{c.employee} · {c.department}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <AttendanceHeatmap data={attendanceData} title="Organization Attendance" />
        </div>
      </div>
    </div>
  );
}

function EmployeesPage({ stats }) {
  const totalDeptCount = stats.departments.reduce((s, d) => s + d.count, 0);
  const employees = [
    { name: 'Alex Morgan', role: 'Sr. Frontend Engineer', dept: 'Engineering', id: 'EMP-2247', status: 'Active' },
    { name: 'Priya Sharma', role: 'Product Designer', dept: 'Design', id: 'EMP-1890', status: 'Active' },
    { name: 'Raj Patel', role: 'Product Manager', dept: 'Product', id: 'EMP-3012', status: 'Active' },
    { name: 'Sarah Chen', role: 'Marketing Lead', dept: 'Marketing', id: 'EMP-1445', status: 'On Leave' },
    { name: 'Mike Johnson', role: 'Sales Executive', dept: 'Sales', id: 'EMP-3041', status: 'Active' },
    { name: 'Aisha Khan', role: 'Operations Analyst', dept: 'Operations', id: 'EMP-2888', status: 'Active' },
  ];

  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      {/* Department distribution */}
      <div className="grid grid-cols-3 gap-5">
        {stats.departments.map((dept, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-secondary">{dept.name}</span>
              <span className="text-xs font-bold" style={{ color: dept.color }}>{dept.count}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(dept.count / totalDeptCount) * 100}%`, background: dept.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Employee list */}
      <div className="glass-card p-6" id="employees-list">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-text-primary">All Employees</h3>
            <p className="text-xs text-text-secondary mt-1">{stats.totalEmployees} total · {stats.newHires} new this month</p>
          </div>
          <button id="add-employee-btn" className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}>
            + Add Employee
          </button>
        </div>
        <div className="space-y-2">
          {employees.map((emp, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,245,255,0.15)', color: '#00f5ff' }}>
                {emp.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{emp.name}</p>
                <p className="text-[10px] text-text-muted">{emp.role} · {emp.dept}</p>
              </div>
              <span className="text-[10px] text-text-muted font-mono">{emp.id}</span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: emp.status === 'Active' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)', border: `1px solid ${emp.status === 'Active' ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`, color: emp.status === 'Active' ? '#4ade80' : '#fbbf24' }}>
                {emp.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplaintsPage() {
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="hr-complaints-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Employee Complaints</h3>
            <p className="text-xs text-text-secondary mt-1">
              {complaints.filter((c) => c.status !== 'Resolved').length} open · {complaints.filter((c) => c.status === 'Resolved').length} resolved
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
              {complaints.filter((c) => c.severity === 'High').length} High Priority
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {complaints.map((c) => {
            const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
            return (
              <div key={c.id} className="p-5 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-text-muted font-mono">{c.id}</span>
                    <span className="w-2 h-2 rounded-full" style={{ background: SEVERITY_COLORS[c.severity] }} />
                    <span className="text-[10px] font-semibold" style={{ color: SEVERITY_COLORS[c.severity] }}>{c.severity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">{c.date}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.text }}>
                      {c.status}
                    </span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">{c.subject}</h4>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">{c.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-secondary font-semibold">{c.employee}</span>
                    <span className="text-[10px] text-text-muted">·</span>
                    <span className="text-[10px] text-text-muted">{c.department}</span>
                  </div>
                  {c.status !== 'Resolved' && (
                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ApprovalsPage({ stats }) {
  const approvals = [
    { name: 'Priya Sharma', type: 'Casual Leave', days: '2 days', date: 'Aug 18-19', dept: 'Engineering' },
    { name: 'Raj Patel', type: 'Work From Home', days: '1 day', date: 'Aug 16', dept: 'Product' },
    { name: 'Sarah Chen', type: 'Sick Leave', days: '3 days', date: 'Aug 14-16', dept: 'Design' },
    { name: 'Mike Johnson', type: 'Earned Leave', days: '5 days', date: 'Aug 25-29', dept: 'Marketing' },
    { name: 'Aisha Khan', type: 'Casual Leave', days: '1 day', date: 'Aug 20', dept: 'Operations' },
  ];

  const COLORS = ['#00f5ff', '#7c3aed', '#a78bfa', '#06b6d4', '#8b5cf6'];

  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="approvals-page">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-text-primary">⏳ Pending Approvals</h3>
            <p className="text-xs text-text-secondary mt-1">{stats.pendingApprovals} requests awaiting your action</p>
          </div>
        </div>
        <div className="space-y-3">
          {approvals.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.03] transition-colors" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${COLORS[i]}20`, border: `1px solid ${COLORS[i]}40`, color: COLORS[i] }}>
                  {item.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                  <p className="text-[10px] text-text-muted">{item.type} · {item.days} · {item.date} · {item.dept}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button id={`approve-${i}`} className="px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
                  ✓ Approve
                </button>
                <button id={`reject-${i}`} className="px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnnouncementsPage() {
  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="glass-card p-6" id="announcements-page">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-text-primary">📢 Announcements</h3>
            <p className="text-xs text-text-secondary mt-1">Company-wide communications</p>
          </div>
          <button id="new-announcement-btn" className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}>
            + New Post
          </button>
        </div>
        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: item.tagColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${item.tagColor}15`, color: item.tagColor }}>
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{item.body}</p>
              </div>
              <span className="text-[10px] text-text-muted flex-shrink-0">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ stats }) {
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
              {stats.departments.map((dept, i) => (
                <DepartmentBar key={i} name={dept.name} count={dept.count} total={stats.totalEmployees} color={dept.color} />
              ))}
            </div>
          </div>
        </div>
        <AttendanceHeatmap data={attendanceData} title="Organization Attendance" />
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
const TABS = [
  { id: 'overview', label: '🏠 Overview' },
  { id: 'employees', label: '👥 Employees' },
  { id: 'complaints', label: '📨 Complaints' },
  { id: 'approvals', label: '⏳ Approvals' },
  { id: 'announcements', label: '📢 Announcements' },
  { id: 'reports', label: '📊 Reports' },
];

export default function HRDashboard() {
  const stats = hrStats;
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div id="hr-dashboard">
      {/* Tab Navigation */}
      <div
        className="flex items-center gap-1 mb-6 p-1 rounded-2xl overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`hr-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-250 cursor-pointer whitespace-nowrap"
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(0,245,255,0.1))' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
              color: activeTab === tab.id ? '#a78bfa' : 'rgba(255,255,255,0.5)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewPage stats={stats} />}
      {activeTab === 'employees' && <EmployeesPage stats={stats} />}
      {activeTab === 'complaints' && <ComplaintsPage />}
      {activeTab === 'approvals' && <ApprovalsPage stats={stats} />}
      {activeTab === 'announcements' && <AnnouncementsPage />}
      {activeTab === 'reports' && <ReportsPage stats={stats} />}
    </div>
  );
}
