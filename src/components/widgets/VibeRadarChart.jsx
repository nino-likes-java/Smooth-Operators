import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

function CustomTick({ payload, x, y, textAnchor }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="rgba(255, 255, 255, 0.6)"
      fontSize={11}
      fontWeight={500}
      fontFamily="Inter, sans-serif"
    >
      {payload.value}
    </text>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div
      style={{
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 12,
        padding: '10px 16px',
      }}
    >
      <p style={{ color: '#00f5ff', fontWeight: 600, fontSize: 13, margin: 0 }}>
        {data.axis}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '4px 0 0' }}>
        Score: {data.value}/100
      </p>
    </div>
  );
}

export default function VibeRadarChart({ data, title = 'Vibe Check' }) {
  const avgScore = Math.round(data.reduce((s, d) => s + d.value, 0) / data.length);

  return (
    <div className="glass-card p-6 animate-fade-in-up delay-300" id="vibe-radar-chart">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="text-xs text-text-secondary mt-1">
            Overall vibe score:{' '}
            <span className="gradient-text font-bold">{avgScore}/100</span>
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'rgba(0, 245, 255, 0.08)' }}
        >
          {avgScore >= 80 ? '🔥' : avgScore >= 60 ? '😊' : '😐'}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid
            stroke="rgba(255, 255, 255, 0.06)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis dataKey="axis" tick={<CustomTick />} />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Vibe"
            dataKey="value"
            stroke="#00f5ff"
            strokeWidth={2}
            fill="url(#vibeGradient)"
            fillOpacity={0.35}
            dot={{
              r: 4,
              fill: '#00f5ff',
              stroke: '#000',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: '#7c3aed',
              stroke: '#00f5ff',
              strokeWidth: 2,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="vibeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>

      {/* Axis breakdown */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {data.map((item) => (
          <div
            key={item.axis}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
          >
            <div
              className="w-1.5 h-6 rounded-full"
              style={{
                background: `linear-gradient(to top, rgba(124, 58, 237, 0.5), rgba(0, 245, 255, ${item.value / 100}))`,
              }}
            />
            <div>
              <p className="text-[10px] text-text-muted leading-tight">{item.axis}</p>
              <p className="text-xs font-semibold text-text-primary">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
