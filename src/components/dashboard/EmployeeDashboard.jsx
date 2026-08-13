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

function WeeklyHoursTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 12,
        padding: '8px 14px',
      }}
    >
      <p style={{ color: '#00f5ff', fontWeight: 600, fontSize: 13, margin: 0 }}>{d.day}</p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '4px 0 0' }}>
        {d.hours}h worked
      </p>
    </div>
  );
}

function getBarColor(hours) {
  if (hours >= 9) return '#7c3aed';      // overtime — violet
  if (hours >= 7) return '#00f5ff';      // standard — cyan
  if (hours >= 5) return '#60a5fa';      // short — blue
  return '#fbbf24';                       // half day — amber
}

const STATUS_STYLES = {
  'In Progress': { bg: 'rgba(0, 245, 255, 0.1)', border: 'rgba(0, 245, 255, 0.2)', text: '#00f5ff' },
  Completed: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
  Pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  'In Review': { bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.2)', text: '#a78bfa' },
};

export default function EmployeeDashboard() {
  const stats = employeeStats;
  const [showComplaintModal, setShowComplaintModal] = useState(false);

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
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(0, 245, 255, 0.1)',
                    border: '1px solid rgba(0, 245, 255, 0.2)',
                    color: '#00f5ff',
                  }}
                >
                  {stats.employeeId}
                </span>
              </div>
              <span className="text-xs text-text-muted">
                Manager: <span className="text-text-secondary font-medium">{stats.manager}</span>
              </span>
              <span className="text-xs text-text-muted">
                Shift: <span className="text-text-secondary font-medium">{stats.shiftTiming}</span>
              </span>
            </div>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-xs text-text-muted mb-1">Joined</p>
            <p className="text-sm font-semibold text-text-secondary">{stats.joinDate}</p>
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
          icon="⏰"
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
            className={`glass-card p-4 text-left cursor-pointer group ${action.isComplaint ? 'relative' : ''}`}
            id={`action-${action.label.toLowerCase().replace(/\s/g, '-')}`}
            onClick={action.isComplaint ? () => setShowComplaintModal(true) : undefined}
            style={
              action.isComplaint
                ? {
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                    background: 'rgba(248, 113, 113, 0.04)',
                  }
                : undefined
            }
          >
            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">
              {action.icon}
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: action.isComplaint ? '#f87171' : 'var(--color-text-primary)' }}
            >
              {action.label}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Attendance Heatmap */}
        <div className="col-span-8">
          <AttendanceHeatmap data={attendanceData} title="My Attendance" />
        </div>

        {/* Weekly Hours Bar Chart */}
        <div className="col-span-4">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="weekly-hours-chart">
            <h3 className="text-base font-semibold text-text-primary mb-1">This Week</h3>
            <p className="text-xs text-text-secondary mb-4">
              Daily working hours breakdown
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.weeklyHours} barSize={28}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 12]}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip content={<WeeklyHoursTooltip />} cursor={false} />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {stats.weeklyHours.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.hours)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* 8h standard line indicator */}
            <div className="flex items-center gap-2 mt-3 text-[10px] text-text-muted">
              <div className="w-3 h-[2px] rounded-full" style={{ background: '#00f5ff' }} />
              <span>Standard (7–8h)</span>
              <div className="w-3 h-[2px] rounded-full ml-2" style={{ background: '#7c3aed' }} />
              <span>Overtime (9h+)</span>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="col-span-7">
          <div className="glass-card p-6 animate-fade-in-up delay-200" id="recent-projects">
            <h3 className="text-base font-semibold text-text-primary mb-1">Recent Projects</h3>
            <p className="text-xs text-text-secondary mb-5">Active and completed work</p>
            <div className="space-y-4">
              {stats.recentProjects.map((project, i) => {
                const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES['Pending'];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-sm font-semibold text-text-primary">{project.name}</h4>
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            background: statusStyle.bg,
                            border: `1px solid ${statusStyle.border}`,
                            color: statusStyle.text,
                          }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${project.progress}%`,
                              background:
                                project.progress === 100
                                  ? '#4ade80'
                                  : 'linear-gradient(90deg, #00f5ff, #7c3aed)',
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-text-muted font-medium w-8 text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted flex-shrink-0">
                      Due {project.deadline}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Complaints */}
        <div className="col-span-5">
          <div className="glass-card p-6 animate-fade-in-up delay-300 h-full" id="my-complaints">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-text-primary">My Complaints</h3>
                <p className="text-xs text-text-secondary mt-1">Submitted concerns</p>
              </div>
              <button
                onClick={() => setShowComplaintModal(true)}
                className="text-[10px] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.2)',
                  color: '#f87171',
                }}
                id="new-complaint-btn"
              >
                + New
              </button>
            </div>

            {employeeComplaints.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                <span className="text-3xl mb-3">📭</span>
                <p className="text-xs">No complaints filed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employeeComplaints.map((c) => {
                  const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl hover:bg-white/[0.03] transition-colors"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-text-primary">{c.subject}</h4>
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            background: statusStyle.bg,
                            border: `1px solid ${statusStyle.border}`,
                            color: statusStyle.text,
                          }}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">{c.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-text-muted">{c.category}</span>
                        <span className="text-[10px] text-text-muted">·</span>
                        <span className="text-[10px] text-text-muted">{c.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

      {/* Complaint Modal */}
      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
      />
    </div>
  );
}
