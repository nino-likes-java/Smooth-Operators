import AttendanceHeatmap from '../widgets/AttendanceHeatmap';
import VibeRadarChart from '../widgets/VibeRadarChart';
import FinancialDonut from '../widgets/FinancialDonut';
import {
  attendanceData,
  vibeDataTeam,
  budgetData,
  hrStats,
  hrActions,
  announcements,
} from '../../data/dummyData';

function HRStatCard({ icon, label, value, trend, trendUp, color, delay }) {
  return (
    <div
      className={`glass-card p-5 animate-fade-in-up ${delay}`}
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}15` }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
      {trend && (
        <p
          className="text-[10px] font-semibold mt-2"
          style={{ color: trendUp ? '#00f5ff' : '#f87171' }}
        >
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
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(count / total) * 100}%`,
            background: color,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
      <span className="text-xs text-text-muted w-8 text-right">{count}</span>
    </div>
  );
}

export default function HRDashboard() {
  const stats = hrStats;
  const totalDeptCount = stats.departments.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }} id="hr-dashboard">
      {/* HR Welcome Banner */}
      <div
        className="glass-card p-7 relative overflow-hidden animate-fade-in-up"
        style={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(0, 245, 255, 0.06))',
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">HR Control Center</p>
            <h2 className="text-2xl font-bold text-text-primary">
              Organization Overview 🏢
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Managing {stats.totalEmployees} employees across {stats.departments.length} departments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: 'rgba(0, 245, 255, 0.1)',
                border: '1px solid rgba(0, 245, 255, 0.2)',
                color: '#00f5ff',
              }}
            >
              ⭐ {stats.avgSatisfaction}/5 Satisfaction
            </div>
          </div>
        </div>
      </div>

      {/* HR Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        <HRStatCard
          icon="👥"
          label="Total Employees"
          value={stats.totalEmployees}
          trend="+12 this month"
          trendUp
          color="#00f5ff"
          delay="delay-100"
        />
        <HRStatCard
          icon="🆕"
          label="New Hires"
          value={stats.newHires}
          trend="+4 vs last month"
          trendUp
          color="#7c3aed"
          delay="delay-200"
        />
        <HRStatCard
          icon="📉"
          label="Attrition Rate"
          value={`${stats.attritionRate}%`}
          trend="-0.5% improvement"
          trendUp
          color="#a78bfa"
          delay="delay-300"
        />
        <HRStatCard
          icon="📋"
          label="Open Positions"
          value={stats.openPositions}
          trend="3 urgent"
          trendUp={false}
          color="#06b6d4"
          delay="delay-400"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
        {hrActions.map((action, i) => (
          <button
            key={i}
            className="glass-card p-4 text-left cursor-pointer group relative"
            id={`hr-action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">
              {action.icon}
            </div>
            <p className="text-sm font-semibold text-text-primary">{action.label}</p>
            <p className="text-xs text-text-muted mt-0.5">{action.desc}</p>
            {action.badge && (
              <span
                className="absolute top-3 right-3 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #00f5ff, #7c3aed)' }}
              >
                {action.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Financial Donut */}
        <div className="col-span-5">
          <FinancialDonut data={budgetData} title="Department Budget" />
        </div>

        {/* Team Vibe Radar */}
        <div className="col-span-4">
          <VibeRadarChart data={vibeDataTeam} title="Team Vibe Check" />
        </div>

        {/* Department Distribution */}
        <div className="col-span-3">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="dept-distribution">
            <h3 className="text-base font-semibold text-text-primary mb-1">Departments</h3>
            <p className="text-xs text-text-secondary mb-5">Headcount distribution</p>
            <div className="space-y-4">
              {stats.departments.map((dept, i) => (
                <DepartmentBar
                  key={i}
                  name={dept.name}
                  count={dept.count}
                  total={totalDeptCount}
                  color={dept.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Heatmap - full width */}
        <div className="col-span-12">
          <AttendanceHeatmap data={attendanceData} title="Organization Attendance" />
        </div>
      </div>

      {/* Pending Approvals + Announcements */}
      <div className="grid grid-cols-2 gap-5">
        {/* Pending Approvals */}
        <div className="glass-card p-6 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">⏳ Pending Approvals</h3>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(0, 245, 255, 0.1)',
                color: '#00f5ff',
              }}
            >
              {stats.pendingApprovals} pending
            </span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Priya Sharma', type: 'Casual Leave', days: '2 days', date: 'Aug 18-19' },
              { name: 'Raj Patel', type: 'Work From Home', days: '1 day', date: 'Aug 16' },
              { name: 'Sarah Chen', type: 'Sick Leave', days: '3 days', date: 'Aug 14-16' },
              { name: 'Mike Johnson', type: 'Earned Leave', days: '5 days', date: 'Aug 25-29' },
              { name: 'Aisha Khan', type: 'Casual Leave', days: '1 day', date: 'Aug 20' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${
                        ['#00f5ff', '#7c3aed', '#a78bfa', '#06b6d4', '#8b5cf6'][i]
                      }30, transparent)`,
                      border: `1px solid ${
                        ['#00f5ff', '#7c3aed', '#a78bfa', '#06b6d4', '#8b5cf6'][i]
                      }40`,
                      color: ['#00f5ff', '#7c3aed', '#a78bfa', '#06b6d4', '#8b5cf6'][i],
                    }}
                  >
                    {item.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{item.name}</p>
                    <p className="text-[10px] text-text-muted">
                      {item.type} · {item.days} · {item.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110 cursor-pointer"
                    style={{
                      background: 'rgba(0, 245, 255, 0.1)',
                      border: '1px solid rgba(0, 245, 255, 0.2)',
                    }}
                  >
                    ✓
                  </button>
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110 cursor-pointer"
                    style={{
                      background: 'rgba(248, 113, 113, 0.1)',
                      border: '1px solid rgba(248, 113, 113, 0.2)',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="glass-card p-6 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">📢 Announcements</h3>
            <button
              className="text-[10px] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(124,58,237,0.1))',
                border: '1px solid rgba(0, 245, 255, 0.2)',
                color: '#00f5ff',
              }}
            >
              + New Post
            </button>
          </div>
          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] cursor-pointer"
              >
                <div
                  className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                  style={{ background: item.tagColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: `${item.tagColor}15`,
                        color: item.tagColor,
                      }}
                    >
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
    </div>
  );
}
