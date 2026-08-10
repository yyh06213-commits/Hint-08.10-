import React, { useState } from 'react';
import { AnchorCode, AnchorScore } from '../types';
import { ANCHOR_DEFINITIONS } from '../data/anchors';

interface RadarChartProps {
  scores: AnchorScore[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const [hoveredCode, setHoveredCode] = useState<AnchorCode | null>(null);

  // Define canonical order for radar chart (8 points around the circle starting top -90deg)
  const orderedCodes: AnchorCode[] = ['TF', 'GM', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS'];

  const width = 360;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 110;

  const scoreMap = new Map<AnchorCode, AnchorScore>();
  scores.forEach((s) => scoreMap.set(s.code, s));

  // Generate 8 angle points
  const points = orderedCodes.map((code, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
    const item = scoreMap.get(code);
    const percentage = item ? Math.min(Math.max(item.percentage, 10), 100) : 50;
    const currentRadius = (radius * percentage) / 100;

    const x = centerX + currentRadius * Math.cos(angle);
    const y = centerY + currentRadius * Math.sin(angle);

    const outerX = centerX + (radius + 28) * Math.cos(angle);
    const outerY = centerY + (radius + 28) * Math.sin(angle);

    const info = ANCHOR_DEFINITIONS[code];

    return {
      code,
      name: info?.shortName || code,
      percentage,
      score: item?.score || 0,
      x,
      y,
      outerX,
      outerY,
      angle,
    };
  });

  // Calculate grid rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  const gridPolygons = rings.map((ringFactor) => {
    const ringRadius = radius * ringFactor;
    const ringPoints = orderedCodes.map((_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
      const x = centerX + ringRadius * Math.cos(angle);
      const y = centerY + ringRadius * Math.sin(angle);
      return `${x},${y}`;
    });
    return ringPoints.join(' ');
  });

  const dataPolygon = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full max-w-[380px] mx-auto flex flex-col items-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible select-none"
      >
        {/* Background Grid Rings */}
        {gridPolygons.map((polyStr, index) => (
          <polygon
            key={index}
            points={polyStr}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1.2"
            strokeDasharray={index < 3 ? '3 3' : undefined}
          />
        ))}

        {/* Axis Lines */}
        {points.map((p, i) => {
          const axisX = centerX + radius * Math.cos(p.angle);
          const axisY = centerY + radius * Math.sin(p.angle);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={axisX}
              y2={axisY}
              stroke="#E2E8F0"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Data Area Polygon */}
        <polygon
          points={dataPolygon}
          fill="rgba(45, 212, 191, 0.25)"
          stroke="#2DD4BF"
          strokeWidth="2.5"
        />

        {/* Outer Text Labels */}
        {points.map((p) => {
          const isHovered = hoveredCode === p.code;
          return (
            <g key={p.code} className="cursor-pointer" onMouseEnter={() => setHoveredCode(p.code)} onMouseLeave={() => setHoveredCode(null)}>
              <text
                x={p.outerX}
                y={p.outerY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHovered ? '#2DD4BF' : '#45474c'}
                fontSize={isHovered ? '13' : '12'}
                fontWeight={isHovered ? '700' : '600'}
              >
                {p.name}
              </text>
            </g>
          );
        })}

        {/* Data Points / Nodes */}
        {points.map((p) => {
          const isHovered = hoveredCode === p.code;
          return (
            <g
              key={p.code}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredCode(p.code)}
              onMouseLeave={() => setHoveredCode(null)}
            >
              {/* Outer halo on hover */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 8 : 4}
                fill={isHovered ? '#2DD4BF' : '#091426'}
                fillOpacity={isHovered ? 0.3 : 1}
                stroke="#2DD4BF"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-300"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={3}
                fill="#ffffff"
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Info Tooltip Badge */}
      {hoveredCode && (
        <div className="mt-2 px-3 py-1 bg-primary text-white text-xs rounded-full shadow-md flex items-center gap-2 animate-fade-in">
          <span className="font-bold text-growth-mint">
            {ANCHOR_DEFINITIONS[hoveredCode]?.name}
          </span>
          <span>
            {scoreMap.get(hoveredCode)?.score || 0}점 ({scoreMap.get(hoveredCode)?.percentage}%)
          </span>
        </div>
      )}
    </div>
  );
};
