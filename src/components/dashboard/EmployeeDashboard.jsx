import AttendanceHeatmap from '../widgets/AttendanceHeatmap';
import CareerSkillTree from '../widgets/CareerSkillTree';
import VibeRadarChart from '../widgets/VibeRadarChart';
import {
  attendanceData,
  skillTreeNodes,
  skillTreeEdges,
  vibeDataEmployee,
  employeeStats,
  employeeActions,
  announcements,
} from '../../data/dummyData';

function StatCard({ icon, label, value, sub, color, delay }) {
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

export default function EmployeeDashboard() {
  const stats = employeeStats;

  return (
    <div className="space-y-5 animate-fade-in-up" style={{ opacity: 0 }} id="employee-dashboard">
      {/* Welcome Banner */}
      <div
        className="glass-card p-7 relative overflow-hidden animate-fade-in-up"
        style={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 245, 255, 0.08), rgba(124, 58, 237, 0.08))',
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">Welcome back,</p>
            <h2 className="text-2xl font-bold text-text-primary">{stats.name} {stats.avatar}</h2>
            <p className="text-sm text-text-secondary mt-1">
              {stats.role} · {stats.department}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))',
                    border: '1px solid rgba(0, 245, 255, 0.2)',
                    color: '#00f5ff',
                  }}
                >
                  Level {stats.level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                🔥 <span className="font-semibold text-text-primary">{stats.streak} day streak</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="text-right">
            <p className="text-xs text-text-muted mb-2">Progress to Level {stats.level + 1}</p>
            <div className="w-48 h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(stats.totalXp / stats.nextLevelXp) * 100}%`,
                  background: 'linear-gradient(90deg, #00f5ff, #7c3aed)',
                  boxShadow: '0 0 12px rgba(0, 245, 255, 0.3)',
                }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1.5">
              <span className="gradient-text font-bold">{stats.totalXp.toLocaleString()}</span>
              <span className="text-text-muted"> / {stats.nextLevelXp.toLocaleString()} XP</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          icon="📅"
          label="Days Present"
          value={`${stats.thisMonth.daysPresent}/${stats.thisMonth.totalDays}`}
          sub="This Month"
          color="#00f5ff"
          delay="delay-100"
        />
        <StatCard
          icon="⏱️"
          label="Avg Hours/Day"
          value={stats.thisMonth.avgHours.toFixed(1)}
          sub="On Track"
          color="#7c3aed"
          delay="delay-200"
        />
        <StatCard
          icon="🌴"
          label="Leave Balance"
          value={stats.leaveBalance.casual + stats.leaveBalance.sick + stats.leaveBalance.earned}
          sub={`${stats.leaveBalance.casual}C · ${stats.leaveBalance.sick}S · ${stats.leaveBalance.earned}E`}
          color="#a78bfa"
          delay="delay-300"
        />
        <StatCard
          icon="⚡"
          label="Overtime Hours"
          value={stats.thisMonth.overtimeHours}
          sub="This Month"
          color="#06b6d4"
          delay="delay-400"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
        {employeeActions.map((action, i) => (
          <button
            key={i}
            className="glass-card p-4 text-left cursor-pointer group"
            id={`action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">
              {action.icon}
            </div>
            <p className="text-sm font-semibold text-text-primary">{action.label}</p>
            <p className="text-xs text-text-muted mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Attendance Heatmap - wide */}
        <div className="col-span-8">
          <AttendanceHeatmap data={attendanceData} title="My Attendance" />
        </div>

        {/* Vibe Radar */}
        <div className="col-span-4">
          <VibeRadarChart data={vibeDataEmployee} title="My Vibe Check" />
        </div>

        {/* Skill Tree - full width */}
        <div className="col-span-12">
          <CareerSkillTree nodes={skillTreeNodes} edges={skillTreeEdges} />
        </div>
      </div>

      {/* Announcements */}
      <div className="glass-card p-6 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
        <h3 className="text-base font-semibold text-text-primary mb-4">📢 Announcements</h3>
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
  );
}
