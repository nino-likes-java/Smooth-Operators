import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { announcements, employeeComplaints, complaints } from '../../data/dummyData';

// SVG Icons
const SpeakerIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
const InboxIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;
const AlertIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const EmptyIcon = () => <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>;

const STATUS_STYLES = {
  Pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' },
  'In Review': { bg: 'rgba(200, 169, 107, 0.1)', border: 'rgba(200, 169, 107, 0.3)', text: 'var(--color-gold-muted)' },
  Resolved: { bg: 'rgba(223, 201, 147, 0.1)', border: 'rgba(223, 201, 147, 0.3)', text: 'var(--color-gold-light)' },
  'In Progress': { bg: 'rgba(200, 169, 107, 0.15)', border: 'rgba(200, 169, 107, 0.4)', text: 'var(--color-gold-muted)' },
  Completed: { bg: 'rgba(223, 201, 147, 0.1)', border: 'rgba(223, 201, 147, 0.3)', text: 'var(--color-gold-light)' },
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
    <div className="space-y-3 font-sans">
      {announcements.map((item) => (
        <div
          key={item.id}
          className="p-4 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] cursor-pointer"
          style={{ background: 'rgba(200,169,107,0.03)', border: '1px solid rgba(200,169,107,0.2)' }}
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
          <h4 className="text-sm font-bold font-playfair text-text-light mb-1">{item.title}</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function EmployeeComplaintsTab() {
  return (
    <div className="space-y-3 font-sans">
      {employeeComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <div className="mb-3 text-gold-muted"><EmptyIcon /></div>
          <p className="text-xs">No complaints filed yet</p>
        </div>
      ) : (
        employeeComplaints.map((c) => {
          const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
          return (
            <div
              key={c.id}
              className="p-4 rounded-xl hover:bg-white/[0.03] transition-colors"
              style={{ background: 'rgba(200,169,107,0.03)', border: '1px solid rgba(200,169,107,0.2)' }}
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
              <h4 className="text-sm font-bold font-playfair text-text-light mb-1">{c.subject}</h4>
              <p className="text-xs text-text-secondary line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] font-medium"
                  style={{ color: SEVERITY_COLORS[c.severity] }}
                >
                  {c.severity}
                </span>
                <span className="text-[10px] text-text-muted">·</span>
                <span className="text-[10px] text-text-muted">{c.category}</span>
                <span className="text-[10px] text-text-muted">·</span>
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
    <div className="space-y-3 font-sans">
      {complaints.map((c) => {
        const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES['Pending'];
        return (
          <div
            key={c.id}
            className="p-4 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
            style={{ background: 'rgba(200,169,107,0.03)', border: '1px solid rgba(200,169,107,0.2)' }}
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
            <h4 className="text-sm font-bold font-playfair text-text-light mb-1">{c.subject}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary font-medium">{c.employee}</span>
              <span className="text-[10px] text-text-muted">·</span>
              <span className="text-[10px] text-text-muted">{c.department}</span>
              <span className="text-[10px] text-text-muted">·</span>
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
    { id: 'announcements', label: 'Announcements', icon: <SpeakerIcon />, hasDot: hasNewAnnouncements },
    {
      id: 'items',
      label: isHR ? 'Complaints' : 'My Complaints',
      icon: isHR ? <InboxIcon /> : <AlertIcon />,
      hasDot: false,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isSidePanelOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 90, background: 'rgba(7, 21, 37, 0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        id="side-panel-drawer"
        className="fixed top-0 right-0 h-full flex flex-col font-sans"
        style={{
          zIndex: 91,
          width: 380,
          background: 'var(--color-navy-dark)',
          borderLeft: '1px solid var(--color-gold-muted)',
          transform: isSidePanelOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isSidePanelOpen ? '-8px 0 48px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(200,169,107,0.3)', paddingTop: 72 }}
        >
          <div>
            <h3 className="text-lg font-bold font-playfair text-text-light">Notifications</h3>
            <p className="text-[11px] text-gold-muted mt-0.5">
              {isHR ? 'Company announcements & employee complaints' : 'Announcements & your complaints'}
            </p>
          </div>
          <button
            onClick={() => setIsSidePanelOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gold-muted hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
            aria-label="Close panel"
            id="side-panel-close"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b flex-shrink-0"
          style={{ borderColor: 'rgba(200,169,107,0.3)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`panel-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold transition-all duration-200 cursor-pointer"
              style={{
                color: activeTab === tab.id ? 'var(--color-gold-light)' : 'var(--color-gold-muted)',
                opacity: activeTab === tab.id ? 1 : 0.6,
                borderBottom: activeTab === tab.id
                  ? '2px solid var(--color-gold-light)'
                  : '2px solid transparent',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
              }}
            >
              <span className="w-4 h-4">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.hasDot && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 absolute top-3 right-4"
                  style={{ background: '#f87171' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
          {activeTab === 'announcements' && <AnnouncementsTab />}
          {activeTab === 'items' && (isHR ? <HRComplaintsTab /> : <EmployeeComplaintsTab />)}
        </div>
      </div>
    </>
  );
}
