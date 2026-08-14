import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { announcements, employeeComplaints, complaints } from '../../data/dummyData';

const STATUS_STYLES = {
  Pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  'In Review': { bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.2)', text: '#a78bfa' },
  Resolved: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
  'In Progress': { bg: 'rgba(45, 212, 255, 0.1)', border: 'rgba(45, 212, 255, 0.2)', text: '#2DD4FF' },
  Completed: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
};

const SEVERITY_COLORS = {
  Low: '#60a5fa',
  Medium: '#fbbf24',
  High: '#f87171',
};

function AnnouncementsTab() {
  const { markAnnouncementsRead } = useApp();

  useEffect(() => {
    markAnnouncementsRead();
  }, [markAnnouncementsRead]);

  return (
    <div className="space-y-3">
      {announcements.map((item) => (
        <div
          key={item.id}
          className="p-4 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(38,38,47,0.9)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: item.tagColor }}
            />
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${item.tagColor}18`,
                color: item.tagColor,
              }}
            >
              {item.tag}
            </span>
            <span className="text-[10px] text-text-muted ml-auto">{item.date}</span>
          </div>
          <h4 className="text-sm font-semibold text-text-primary mb-1">{item.title}</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function EmployeeComplaintsTab() {
  return (
    <div className="space-y-3">
      {employeeComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <span className="text-4xl mb-3">ðŸ“­</span>
          <p className="text-xs">No complaints filed yet</p>
        </div>
      ) : (
        employeeComplaints.map((c) => {
          const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
          return (
            <div
              key={c.id}
              className="p-4 rounded-xl hover:bg-white/[0.03] transition-colors"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(38,38,47,0.9)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-text-muted font-mono">{c.id}</span>
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
              <h4 className="text-sm font-semibold text-text-primary mb-1">{c.subject}</h4>
              <p className="text-xs text-text-secondary line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] font-medium"
                  style={{ color: SEVERITY_COLORS[c.severity] }}
                >
                  {c.severity}
                </span>
                <span className="text-[10px] text-text-muted">Â·</span>
                <span className="text-[10px] text-text-muted">{c.category}</span>
                <span className="text-[10px] text-text-muted">Â·</span>
                <span className="text-[10px] text-text-muted">{c.date}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function HRComplaintsTab() {
  return (
    <div className="space-y-3">
      {complaints.map((c) => {
        const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
        return (
          <div
            key={c.id}
            className="p-4 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(38,38,47,0.9)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-muted font-mono">{c.id}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: SEVERITY_COLORS[c.severity] }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: SEVERITY_COLORS[c.severity] }}
                >
                  {c.severity}
                </span>
              </div>
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
            <h4 className="text-xs font-semibold text-text-primary mb-1">{c.subject}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary font-medium">{c.employee}</span>
              <span className="text-[10px] text-text-muted">Â·</span>
              <span className="text-[10px] text-text-muted">{c.department}</span>
              <span className="text-[10px] text-text-muted">Â·</span>
              <span className="text-[10px] text-text-muted">{c.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SidePanelDrawer() {
  const { isSidePanelOpen, setIsSidePanelOpen, role, hasNewAnnouncements } = useApp();
  const isHR = role === 'hr';
  const [activeTab, setActiveTab] = useState('announcements');

  const tabs = [
    { id: 'announcements', label: 'ðŸ“¢ Announcements', hasDot: hasNewAnnouncements },
    {
      id: 'items',
      label: isHR ? 'ðŸ“¨ Complaints' : 'âš ï¸ My Complaints',
      hasDot: false,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isSidePanelOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 90, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        id="side-panel-drawer"
        className="fixed top-0 right-0 h-full flex flex-col"
        style={{
          zIndex: 91,
          width: 380,
          background: 'rgba(8, 8, 14, 0.97)',
          backdropFilter: 'blur(40px)',
          borderLeft: '1px solid rgba(38,38,47,0.9)',
          transform: isSidePanelOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isSidePanelOpen ? '-8px 0 48px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(38,38,47,0.9)', paddingTop: 72 }}
        >
          <div>
            <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
            <p className="text-[10px] text-text-muted mt-0.5">
              {isHR ? 'Company announcements & employee complaints' : 'Announcements & your complaints'}
            </p>
          </div>
          <button
            onClick={() => setIsSidePanelOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
            aria-label="Close panel"
            id="side-panel-close"
          >
            âœ•
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b flex-shrink-0"
          style={{ borderColor: 'rgba(38,38,47,0.9)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`panel-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold transition-all duration-200 cursor-pointer"
              style={{
                color: activeTab === tab.id ? '#2DD4FF' : 'rgba(255,255,255,0.45)',
                borderBottom: activeTab === tab.id
                  ? '2px solid #2DD4FF'
                  : '2px solid transparent',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #2DD4FF' : '2px solid transparent',
              }}
            >
              <span>{tab.label}</span>
              {tab.hasDot && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: '#f87171' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activeTab === 'announcements' && <AnnouncementsTab />}
          {activeTab === 'items' && (isHR ? <HRComplaintsTab /> : <EmployeeComplaintsTab />)}
        </div>
      </div>
    </>
  );
}

