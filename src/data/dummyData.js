// ── Attendance Heatmap Data (52 weeks × 7 days) ──
function generateHeatmapData() {
  const data = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();

    // Weekends get lower activity
    let level;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      level = Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0;
    } else {
      const rand = Math.random();
      if (rand < 0.08) level = 0;
      else if (rand < 0.25) level = 1;
      else if (rand < 0.50) level = 2;
      else if (rand < 0.78) level = 3;
      else level = 4;
    }

    data.push({
      date: date.toISOString().split('T')[0],
      level,
      hours: level === 0 ? 0 : level * 2 + Math.floor(Math.random() * 2),
    });
  }
  return data;
}

export const attendanceData = generateHeatmapData();

// ── Career Skill Tree ──
export const skillTreeNodes = [
  // Row 1 - Foundation
  { id: 'js', label: 'JavaScript', x: 200, y: 60, status: 'unlocked', xp: 950, maxXp: 1000, icon: '⚡' },
  { id: 'html', label: 'HTML/CSS', x: 400, y: 60, status: 'unlocked', xp: 1000, maxXp: 1000, icon: '🎨' },
  { id: 'git', label: 'Git & VCS', x: 600, y: 60, status: 'unlocked', xp: 800, maxXp: 1000, icon: '🔀' },

  // Row 2 - Intermediate
  { id: 'react', label: 'React', x: 150, y: 180, status: 'unlocked', xp: 720, maxXp: 1000, icon: '⚛️' },
  { id: 'node', label: 'Node.js', x: 350, y: 180, status: 'unlocked', xp: 600, maxXp: 1000, icon: '🟢' },
  { id: 'db', label: 'Databases', x: 550, y: 180, status: 'in-progress', xp: 340, maxXp: 1000, icon: '🗄️' },
  { id: 'testing', label: 'Testing', x: 750, y: 180, status: 'in-progress', xp: 220, maxXp: 1000, icon: '🧪' },

  // Row 3 - Advanced
  { id: 'ts', label: 'TypeScript', x: 100, y: 300, status: 'in-progress', xp: 450, maxXp: 1000, icon: '🔷' },
  { id: 'api', label: 'API Design', x: 300, y: 300, status: 'locked', xp: 0, maxXp: 1000, icon: '🔌' },
  { id: 'devops', label: 'DevOps', x: 500, y: 300, status: 'locked', xp: 0, maxXp: 1000, icon: '🚀' },
  { id: 'security', label: 'Security', x: 700, y: 300, status: 'locked', xp: 0, maxXp: 1000, icon: '🛡️' },

  // Row 4 - Expert
  { id: 'arch', label: 'Architecture', x: 250, y: 420, status: 'locked', xp: 0, maxXp: 1000, icon: '🏗️' },
  { id: 'ml', label: 'ML/AI Basics', x: 450, y: 420, status: 'locked', xp: 0, maxXp: 1000, icon: '🤖' },
  { id: 'lead', label: 'Tech Lead', x: 650, y: 420, status: 'locked', xp: 0, maxXp: 1000, icon: '👑' },
];

export const skillTreeEdges = [
  { from: 'js', to: 'react' },
  { from: 'js', to: 'node' },
  { from: 'js', to: 'ts' },
  { from: 'html', to: 'react' },
  { from: 'html', to: 'node' },
  { from: 'git', to: 'testing' },
  { from: 'git', to: 'devops' },
  { from: 'react', to: 'ts' },
  { from: 'node', to: 'api' },
  { from: 'node', to: 'db' },
  { from: 'db', to: 'devops' },
  { from: 'db', to: 'security' },
  { from: 'testing', to: 'security' },
  { from: 'ts', to: 'arch' },
  { from: 'api', to: 'arch' },
  { from: 'devops', to: 'ml' },
  { from: 'security', to: 'lead' },
  { from: 'arch', to: 'lead' },
  { from: 'ml', to: 'lead' },
];

// ── Vibe Radar Chart ──
export const vibeDataEmployee = [
  { axis: 'Motivation', value: 82, fullMark: 100 },
  { axis: 'Collaboration', value: 90, fullMark: 100 },
  { axis: 'Growth', value: 75, fullMark: 100 },
  { axis: 'Balance', value: 68, fullMark: 100 },
  { axis: 'Recognition', value: 55, fullMark: 100 },
  { axis: 'Energy', value: 72, fullMark: 100 },
];

export const vibeDataTeam = [
  { axis: 'Motivation', value: 76, fullMark: 100 },
  { axis: 'Collaboration', value: 84, fullMark: 100 },
  { axis: 'Growth', value: 70, fullMark: 100 },
  { axis: 'Balance', value: 62, fullMark: 100 },
  { axis: 'Recognition', value: 71, fullMark: 100 },
  { axis: 'Energy', value: 65, fullMark: 100 },
];

// ── Financial Donut ──
export const budgetData = [
  { name: 'Salaries', value: 485000, color: '#00f5ff' },
  { name: 'Benefits', value: 125000, color: '#7c3aed' },
  { name: 'Training', value: 68000, color: '#a78bfa' },
  { name: 'Equipment', value: 45000, color: '#06b6d4' },
  { name: 'Events', value: 32000, color: '#8b5cf6' },
  { name: 'Misc', value: 15000, color: '#22d3ee' },
];

// ── Employee Stats ──
export const employeeStats = {
  name: 'Alex Morgan',
  role: 'Senior Frontend Engineer',
  department: 'Engineering',
  avatar: '🧑‍💻',
  joinDate: '2022-03-15',
  level: 12,
  totalXp: 4680,
  nextLevelXp: 5000,
  streak: 14,
  leaveBalance: { casual: 8, sick: 5, earned: 12 },
  thisMonth: {
    daysPresent: 18,
    totalDays: 22,
    avgHours: 8.2,
    overtimeHours: 6,
  },
};

// ── HR Stats ──
export const hrStats = {
  totalEmployees: 247,
  newHires: 12,
  attritionRate: 3.2,
  openPositions: 8,
  pendingApprovals: 5,
  avgSatisfaction: 4.2,
  departments: [
    { name: 'Engineering', count: 89, color: '#00f5ff' },
    { name: 'Design', count: 34, color: '#7c3aed' },
    { name: 'Product', count: 28, color: '#a78bfa' },
    { name: 'Marketing', count: 42, color: '#06b6d4' },
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
    title: 'Hackathon 2026',
    body: 'Registration is open! Form your teams and sign up by Aug 20. Theme: "AI for Good".',
    date: '2026-08-10',
    tag: 'Fun',
    tagColor: '#a78bfa',
  },
];

// ── Quick Actions ──
export const employeeActions = [
  { icon: '📋', label: 'Apply Leave', desc: 'Submit a new leave request' },
  { icon: '💰', label: 'View Payslip', desc: 'Download latest payslip' },
  { icon: '📊', label: 'My Goals', desc: 'Track quarterly objectives' },
  { icon: '🎓', label: 'Learning', desc: 'Access training portal' },
];

export const hrActions = [
  { icon: '✅', label: 'Approvals', desc: '5 pending requests', badge: 5 },
  { icon: '📢', label: 'Post Update', desc: 'Share an announcement' },
  { icon: '👥', label: 'Recruitment', desc: '8 open positions', badge: 8 },
  { icon: '📈', label: 'Reports', desc: 'Generate HR analytics' },
];

// ── AI CoPilot Suggestions ──
export const aiSuggestions = [
  '📊 Summarize my week',
  '📝 Draft leave request',
  '🎯 Show my goals',
  '💡 Suggest a training',
];

export const aiChatHistory = [
  { role: 'assistant', text: 'Hey there! 👋 I\'m your AI CoPilot. How can I help you today?' },
];
