// ── Attendance Heatmap Data (52 weeks × 7 days) ──
// Hours-based slabs:
//   0h       → level 0 (Absent)
//   1–4h     → level 1 (Half Day)
//   4.1–6h   → level 2 (Short Day)
//   6.1–8h   → level 3 (Standard)
//   8.1h+    → level 4 (Overtime)
function generateHeatmapData() {
  const data = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();

    let hours;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekends — mostly absent, occasional half day
      hours = Math.random() > 0.85 ? Math.floor(Math.random() * 4) + 1 : 0;
    } else {
      const rand = Math.random();
      if (rand < 0.06) hours = 0;                              // absent
      else if (rand < 0.14) hours = Math.floor(Math.random() * 3) + 1;  // 1-3h half day
      else if (rand < 0.25) hours = Math.floor(Math.random() * 2) + 4;  // 4-5h short day
      else if (rand < 0.70) hours = Math.floor(Math.random() * 2) + 6;  // 6-7h standard
      else hours = Math.floor(Math.random() * 4) + 8;                   // 8-11h overtime
    }

    // Assign level from hours
    let level;
    if (hours === 0) level = 0;
    else if (hours <= 4) level = 1;
    else if (hours <= 6) level = 2;
    else if (hours <= 8) level = 3;
    else level = 4;

    data.push({
      date: date.toISOString().split('T')[0],
      level,
      hours,
    });
  }
  return data;
}

export const attendanceData = generateHeatmapData();

// ── Financial Donut ──
export const budgetData = [
  { name: 'Salaries', value: 485000, color: '#00f5ff' },
  { name: 'Benefits', value: 125000, color: '#7c3aed' },
  { name: 'Training', value: 68000, color: '#DFC993' },
  { name: 'Equipment', value: 45000, color: '#123452' },
  { name: 'Events', value: 32000, color: '#8b5cf6' },
  { name: 'Misc', value: 15000, color: '#22d3ee' },
];

// ── Employee Stats ──
export const employeeStats = {
  name: 'Alex Morgan',
  role: 'Senior Frontend Engineer',
  department: 'Engineering',
  avatar: '🧑‍💻',
  employeeId: 'EMP-2247',
  joinDate: '2022-03-15',
  manager: 'David Chen',
  shiftTiming: '9:00 AM – 6:00 PM',
  leaveBalance: { casual: 8, sick: 5, earned: 12 },
  thisMonth: {
    daysPresent: 18,
    totalDays: 22,
    avgHours: 8.2,
    overtimeHours: 6,
  },
  recentProjects: [
    { name: 'Dashboard Redesign', status: 'In Progress', progress: 72, deadline: '2026-08-30' },
    { name: 'API Integration v2', status: 'Completed', progress: 100, deadline: '2026-08-05' },
    { name: 'Mobile App Launch', status: 'In Progress', progress: 45, deadline: '2026-09-15' },
    { name: 'Performance Audit', status: 'Pending', progress: 0, deadline: '2026-09-01' },
  ],
  weeklyHours: [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 9.0 },
    { day: 'Wed', hours: 7.5 },
    { day: 'Thu', hours: 8.0 },
    { day: 'Fri', hours: 7.0 },
  ],
};

// ── HR Stats ──
export const hrStats = {
  totalEmployees: 247,
  newHires: 12,
  attritionRate: 3.2,
  openPositions: 8,
  pendingApprovals: 5,
  departments: [
    { name: 'Engineering', count: 89, color: '#00f5ff' },
    { name: 'Design', count: 34, color: '#7c3aed' },
    { name: 'Product', count: 28, color: '#DFC993' },
    { name: 'Marketing', count: 42, color: '#123452' },
    { name: 'Sales', count: 31, color: '#8b5cf6' },
    { name: 'Operations', count: 23, color: '#22d3ee' },
  ],
};

// ── Announcements ──
export const announcements = [
  {
    id: 1,
    title: 'Q3 All-Hands Meeting',
    body: 'Join us this Friday at 3 PM for the quarterly all-hands. CEO will share the roadmap update.',
    date: '2026-08-15',
    tag: 'Event',
    tagColor: '#00f5ff',
  },
  {
    id: 2,
    title: 'New Health Benefits',
    body: 'We\'re upgrading our health insurance plan starting September. Details in your inbox.',
    date: '2026-08-12',
    tag: 'Benefits',
    tagColor: '#7c3aed',
  },
  {
    id: 3,
    title: 'Office Maintenance — Aug 22',
    body: 'The office will be closed on Aug 22 for scheduled maintenance. Please plan accordingly.',
    date: '2026-08-10',
    tag: 'Notice',
    tagColor: '#DFC993',
  },
];

// ── Quick Actions ──
export const employeeActions = [
  { icon: '📋', label: 'Apply Leave', desc: 'Submit a new leave request' },
  { icon: '💰', label: 'View Payslip', desc: 'Download latest payslip' },
  { icon: '📊', label: 'My Goals', desc: 'Track quarterly objectives' },
  { icon: '⚠️', label: 'Complain to HR', desc: 'Raise a concern or complaint', isComplaint: true },
];

export const hrActions = [
  { icon: '✅', label: 'Approvals', desc: '5 pending requests', badge: 5 },
  { icon: '📢', label: 'Post Update', desc: 'Share an announcement' },
  { icon: '👥', label: 'Recruitment', desc: '8 open positions', badge: 8 },
  { icon: '📨', label: 'View Complaints', desc: 'Employee complaints', badge: 3, isComplaint: true },
];

// ── Complaints ──
export const complaints = [
  {
    id: 'CMP-001',
    employee: 'Priya Sharma',
    department: 'Engineering',
    subject: 'Unfair workload distribution',
    category: 'Workplace',
    severity: 'Medium',
    description: 'Tasks are being unevenly assigned in my team. I have been handling twice the workload compared to peers for the past two sprints.',
    date: '2026-08-11',
    status: 'Pending',
  },
  {
    id: 'CMP-002',
    employee: 'Mike Johnson',
    department: 'Marketing',
    subject: 'Delayed salary credit',
    category: 'Pay',
    severity: 'High',
    description: 'My August salary was credited 5 days late. This is the second time this has happened and it is causing financial difficulties.',
    date: '2026-08-09',
    status: 'In Review',
  },
  {
    id: 'CMP-003',
    employee: 'Sarah Chen',
    department: 'Design',
    subject: 'Office AC not working properly',
    category: 'Workplace',
    severity: 'Low',
    description: 'The air conditioning on the 3rd floor has been malfunctioning for the past week. It gets very uncomfortable during afternoon hours.',
    date: '2026-08-07',
    status: 'Resolved',
  },
];

export const employeeComplaints = [
  {
    id: 'CMP-004',
    subject: 'Insufficient parking space',
    category: 'Workplace',
    severity: 'Low',
    description: 'The parking lot is consistently full by 9:15 AM. Need more parking allocation or an alternative arrangement.',
    date: '2026-08-06',
    status: 'In Review',
  },
];

// ── AI CoPilot Suggestions ──
export const aiSuggestions = [
  '📊 Summarize my week',
  '📝 Draft leave request',
  '🎯 Show my goals',
  '📅 My schedule today',
];

export const aiChatHistory = [
  { role: 'assistant', text: 'Hey there! 👋 I\'m your AI CoPilot. How can I help you today?' },
];
