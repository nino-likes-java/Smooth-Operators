import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from 'recharts';

function renderActiveShape(props) {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value,
  } = props;

  const total = props.total || 0;
  const percent = ((value / total) * 100).toFixed(1);

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: `drop-shadow(0 0 12px ${fill}80)`,
          transition: 'all 0.3s ease',
        }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={innerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fill="rgba(255,255,255,0.9)"
        fontSize={13}
        fontWeight={600}
        fontFamily="Inter, sans-serif"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fill="#C8A96B"
        fontSize={18}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
      >
        ${(value / 1000).toFixed(0)}K
      </text>
      <text
        x={cx}
        y={cy + 24}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize={11}
        fontFamily="Inter, sans-serif"
      >
        {percent}%
      </text>
    </g>
  );
}

export default function FinancialDonut({ data, title = 'Budget Allocation' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const enrichedData = data.map((d) => ({ ...d, total }));

  return (
    <div className="glass-card p-6 animate-fade-in-up delay-400" id="financial-donut">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="text-xs text-text-secondary mt-1">
            Total: <span className="gradient-text font-bold">${(total / 1000).toFixed(0)}K</span>
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'rgba(13, 32, 53, 0.1)' }}
        >
          💰
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={enrichedData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={(props) => renderActiveShape({ ...props, total })}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                stroke="transparent"
                style={{
                  filter: index === activeIndex ? `drop-shadow(0 0 8px ${entry.color}60)` : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200"
            style={{
              background: i === activeIndex ? 'rgba(38,38,47,0.25)' : 'transparent',
            }}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: item.color,
                boxShadow: i === activeIndex ? `0 0 8px ${item.color}60` : 'none',
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-text-secondary truncate">{item.name}</p>
            </div>
            <span className="text-xs font-semibold text-text-primary">
              ${(item.value / 1000).toFixed(0)}K
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

