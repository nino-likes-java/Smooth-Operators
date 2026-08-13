import { useState, useMemo } from 'react';

const STATUS_STYLES = {
  unlocked: {
    fill: 'rgba(0, 245, 255, 0.15)',
    stroke: '#00f5ff',
    glow: '0 0 20px rgba(0, 245, 255, 0.3)',
    textColor: '#00f5ff',
  },
  'in-progress': {
    fill: 'rgba(124, 58, 237, 0.15)',
    stroke: '#7c3aed',
    glow: '0 0 20px rgba(124, 58, 237, 0.3)',
    textColor: '#a78bfa',
  },
  locked: {
    fill: 'rgba(255, 255, 255, 0.03)',
    stroke: 'rgba(255, 255, 255, 0.15)',
    glow: 'none',
    textColor: 'rgba(255, 255, 255, 0.3)',
  },
};

export default function CareerSkillTree({ nodes, edges }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const svgWidth = 860;
  const svgHeight = 500;

  // Build a lookup for node positions
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach((n) => (map[n.id] = n));
    return map;
  }, [nodes]);

  const totalXp = nodes.reduce((s, n) => s + n.xp, 0);
  const maxXp = nodes.reduce((s, n) => s + n.maxXp, 0);
  const unlockedCount = nodes.filter((n) => n.status === 'unlocked').length;

  return (
    <div className="glass-card p-6 animate-fade-in-up delay-200" id="career-skill-tree">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Career Skill Tree</h3>
          <p className="text-xs text-text-secondary mt-1">
            {unlockedCount}/{nodes.length} skills unlocked · {totalXp.toLocaleString()} XP
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00f5ff' }} />
            <span className="text-text-secondary">Unlocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#7c3aed' }} />
            <span className="text-text-secondary">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="text-text-secondary">Locked</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          style={{ minWidth: 600 }}
        >
          <defs>
            <filter id="glow-cyan">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-violet">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to) return null;

            const isActive = from.status === 'unlocked' && to.status !== 'locked';
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? 'rgba(0, 245, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={to.status === 'locked' ? '6 4' : 'none'}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const style = STATUS_STYLES[node.status];
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode === node.id;
            const radius = isHovered || isSelected ? 32 : 28;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                style={{ transition: 'transform 0.3s ease' }}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer glow ring */}
                {node.status !== 'locked' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 6}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth="1"
                    opacity={isHovered ? 0.5 : 0.2}
                    filter={node.status === 'unlocked' ? 'url(#glow-cyan)' : 'url(#glow-violet)'}
                  />
                )}

                {/* Background circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={isHovered || isSelected ? 2 : 1.5}
                  style={{ filter: style.glow !== 'none' ? style.glow : undefined }}
                />

                {/* XP progress arc */}
                {node.status !== 'locked' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius - 4}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth="2"
                    strokeDasharray={`${((node.xp / node.maxXp) * 2 * Math.PI * (radius - 4))} ${2 * Math.PI * (radius - 4)}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${node.x} ${node.y})`}
                    opacity={0.6}
                  />
                )}

                {/* Icon */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="18"
                  style={{ opacity: node.status === 'locked' ? 0.3 : 1 }}
                >
                  {node.icon}
                </text>

                {/* Label below */}
                <text
                  x={node.x}
                  y={node.y + radius + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="500"
                  fill={style.textColor}
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>

                {/* XP text on hover */}
                {(isHovered || isSelected) && node.status !== 'locked' && (
                  <text
                    x={node.x}
                    y={node.y + radius + 28}
                    textAnchor="middle"
                    fontSize="9"
                    fill="rgba(255,255,255,0.4)"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.xp}/{node.maxXp} XP
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Total progress bar */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(totalXp / maxXp) * 100}%`,
              background: 'linear-gradient(90deg, #00f5ff, #7c3aed)',
            }}
          />
        </div>
        <span className="text-xs text-text-secondary font-medium">
          {Math.round((totalXp / maxXp) * 100)}%
        </span>
      </div>
    </div>
  );
}
