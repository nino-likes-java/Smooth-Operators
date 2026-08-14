import { useState, useMemo } from 'react';

const CELL_SIZE = 14;
const CELL_GAP = 3;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Hour-based slab colors
const SLAB_COLORS = [
  'rgba(255, 255, 255, 0.04)',  // 0 — Absent
  'rgba(251, 191, 36, 0.50)',   // 1 — Half Day (1–4h) – amber
  'rgba(96, 165, 250, 0.55)',   // 2 — Short Day (4–6h) – blue
  'rgba(200, 169, 107, 0.65)',    // 3 — Standard (6–8h) – cyan
  'rgba(13, 32, 53, 0.85)',   // 4 — Overtime (8h+) – violet
];

const SLAB_LABELS = [
  { label: 'Absent', range: '0h', color: SLAB_COLORS[0], borderColor: 'rgba(65,65,80,0.9)' },
  { label: 'Half Day', range: '1–4h', color: SLAB_COLORS[1], borderColor: 'rgba(251,191,36,0.4)' },
  { label: 'Short', range: '4–6h', color: SLAB_COLORS[2], borderColor: 'rgba(96,165,250,0.4)' },
  { label: 'Standard', range: '6–8h', color: SLAB_COLORS[3], borderColor: 'rgba(200,169,107,0.4)' },
  { label: 'Overtime', range: '8h+', color: SLAB_COLORS[4], borderColor: 'rgba(13,32,53,0.4)' },
];

export default function AttendanceHeatmap({ data, title = 'Attendance Heatmap' }) {
  const [tooltip, setTooltip] = useState(null);

  // Organize data into weeks
  const weeks = useMemo(() => {
    const result = [];
    let currentWeek = [];

    // Pad the first week if it doesn't start on Sunday
    if (data.length > 0) {
      const firstDay = new Date(data[0].date).getDay();
      for (let i = 0; i < firstDay; i++) {
        currentWeek.push(null);
      }
    }

    data.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [data]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIdx) => {
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const month = new Date(firstValidDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], x: weekIdx * (CELL_SIZE + CELL_GAP) });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  const totalDays = data.filter((d) => d.level > 0).length;
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="glass-card p-6 animate-fade-in-up" id="attendance-heatmap">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="text-xs text-text-secondary mt-1">
            {totalDays} working days · {totalHours.toLocaleString()} hours logged
          </p>
        </div>
        {/* Slab Legend */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {SLAB_LABELS.map((slab, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  background: slab.color,
                  border: `1px solid ${slab.borderColor}`,
                }}
              />
              <span className="text-[10px] text-text-muted">
                {slab.label}
                <span className="text-text-muted ml-0.5 opacity-60">({slab.range})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-0" style={{ minWidth: 'fit-content' }}>
          {/* Day labels */}
          <div className="flex flex-col mr-2 mt-5">
            {DAYS.map((day, i) => (
              <div
                key={i}
                className="text-[10px] text-text-muted"
                style={{ height: CELL_SIZE + CELL_GAP, lineHeight: `${CELL_SIZE + CELL_GAP}px` }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div>
            {/* Month labels */}
            <div className="flex relative" style={{ height: 16 }}>
              {monthLabels.map((label, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] text-text-muted"
                  style={{ left: label.x }}
                >
                  {label.month}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="rounded-sm transition-all duration-200 cursor-pointer hover:ring-1 hover:ring-white/30 hover:scale-125"
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        background: day ? SLAB_COLORS[day.level] : 'transparent',
                      }}
                      onMouseEnter={(e) =>
                        day &&
                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          date: day.date,
                          hours: day.hours,
                          level: day.level,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold">{tooltip.date}</div>
          <div className="text-text-secondary">
            {tooltip.hours > 0
              ? `${tooltip.hours}h worked · ${SLAB_LABELS[tooltip.level].label}`
              : 'Absent'}
          </div>
        </div>
      )}
    </div>
  );
}

