"use client";

import { useState } from "react";

interface PrinterNode {
  id: number;
  x: number;
  y: number;
  label: string;
  tooltip: string;
}

const printers: PrinterNode[] = [
  { id: 1, x: 140, y: 95, label: "NoDa", tooltip: "FDM \u2022 PLA, PETG \u2022 2-day turnaround" },
  { id: 2, x: 310, y: 60, label: "Uptown", tooltip: "Resin \u2022 High detail \u2022 Same-day quotes" },
  { id: 3, x: 430, y: 130, label: "South End", tooltip: "FDM \u2022 Nylon-CF \u2022 Functional parts" },
  { id: 4, x: 220, y: 190, label: "Plaza", tooltip: "SLS \u2022 Rapid prototyping \u2022 48h delivery" },
  { id: 5, x: 370, y: 230, label: "Dilworth", tooltip: "FDM \u2022 ABS, ASA \u2022 Automotive fitment" },
  { id: 6, x: 500, y: 70, label: "University", tooltip: "Resin \u2022 Cosplay \u2022 Paint finish" },
  { id: 7, x: 160, y: 270, label: "West End", tooltip: "CNC \u2022 Metal + Plastic \u2022 Industrial" },
  { id: 8, x: 470, y: 280, label: "Matthews", tooltip: "FDM \u2022 TPU \u2022 Flexible parts" },
];

const connections: [number, number][] = [
  [1, 2], [2, 3], [3, 5], [4, 5], [1, 4], [2, 6], [5, 8], [4, 7],
];

export default function IsometricNetworkMap() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getNode = (id: number) => printers.find((p) => p.id === id)!;

  return (
    <div className="relative w-full" aria-label="Charlotte 3D printing network map illustration">
      <svg
        viewBox="0 0 600 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* Pulse animation for printer nodes */}
          <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0FB6C8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0FB6C8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gridFade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0FB6C8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0FB6C8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <ellipse cx="300" cy="180" rx="280" ry="170" fill="url(#gridFade)" />

        {/* Isometric grid lines */}
        <g opacity="0.12" stroke="#0FB6C8" strokeWidth="0.5">
          {/* Horizontal-ish lines (isometric angle) */}
          {Array.from({ length: 9 }, (_, i) => {
            const y = 20 + i * 40;
            return (
              <line
                key={`h-${i}`}
                x1={20}
                y1={y + 20}
                x2={580}
                y2={y - 10}
                strokeDasharray="4 8"
              />
            );
          })}
          {/* Vertical-ish lines (isometric angle) */}
          {Array.from({ length: 11 }, (_, i) => {
            const x = 30 + i * 55;
            return (
              <line
                key={`v-${i}`}
                x1={x - 15}
                y1={10}
                x2={x + 15}
                y2={350}
                strokeDasharray="4 8"
              />
            );
          })}
        </g>

        {/* Connection lines between printers */}
        {connections.map(([fromId, toId]) => {
          const from = getNode(fromId);
          const to = getNode(toId);
          const isActive = hoveredId === fromId || hoveredId === toId;
          return (
            <line
              key={`conn-${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#0FB6C8"
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeOpacity={isActive ? 0.6 : 0.15}
              strokeDasharray={isActive ? "none" : "6 4"}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Printer nodes */}
        {printers.map((printer) => {
          const isHovered = hoveredId === printer.id;
          return (
            <g
              key={printer.id}
              onMouseEnter={() => setHoveredId(printer.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer"
              role="img"
              aria-label={`${printer.label}: ${printer.tooltip}`}
            >
              {/* Pulse ring animation */}
              <circle cx={printer.x} cy={printer.y} r="20" fill="url(#pulseGrad)">
                <animate
                  attributeName="r"
                  values="14;24;14"
                  dur={`${2.5 + printer.id * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.1;0.6"
                  dur={`${2.5 + printer.id * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Outer ring */}
              <circle
                cx={printer.x}
                cy={printer.y}
                r={isHovered ? 12 : 10}
                fill="#0B0F14"
                stroke="#0FB6C8"
                strokeWidth={isHovered ? 2 : 1.2}
                strokeOpacity={isHovered ? 1 : 0.6}
                className="transition-all duration-200"
              />

              {/* Printer icon (simplified 3D printer shape) */}
              <g transform={`translate(${printer.x - 5}, ${printer.y - 5})`} opacity={isHovered ? 1 : 0.8}>
                {/* Base plate */}
                <rect x="1" y="6" width="8" height="2" rx="0.5" fill="#0FB6C8" />
                {/* Upright */}
                <rect x="2" y="1" width="1.5" height="6" fill="#0FB6C8" />
                {/* Arm */}
                <rect x="2" y="1.5" width="5" height="1.2" rx="0.5" fill="#0FB6C8" />
                {/* Nozzle */}
                <circle cx="6.5" cy="3.5" r="0.8" fill="#0FB6C8" />
                {/* Print object */}
                <rect x="4" y="5" width="3" height="3" rx="0.5" fill="#0FB6C8" opacity="0.4" />
              </g>

              {/* Label */}
              <text
                x={printer.x}
                y={printer.y + 22}
                textAnchor="middle"
                fill="#6B7280"
                fontSize="9"
                fontFamily="Satoshi, sans-serif"
                fontWeight="500"
              >
                {printer.label}
              </text>
            </g>
          );
        })}

        {/* Legend badge */}
        <g transform="translate(400, 320)">
          <rect x="0" y="0" width="170" height="24" rx="12" fill="#141A1F" stroke="#1F2937" strokeWidth="1" />
          <circle cx="14" cy="12" r="3" fill="#0FB6C8" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="24" y="16" fill="#6B7280" fontSize="10" fontFamily="Satoshi, sans-serif">
            Charlotte Network (beta)
          </text>
        </g>
      </svg>

      {/* Tooltip overlay (positioned with CSS, not inside SVG for better styling) */}
      {hoveredId !== null && (() => {
        const printer = getNode(hoveredId);
        // Convert SVG coordinates to approximate percentages
        const leftPct = (printer.x / 600) * 100;
        const topPct = ((printer.y - 35) / 360) * 100;
        return (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-cyan/30 bg-brand-surface px-3 py-2 text-xs shadow-lg shadow-cyan/5"
            style={{
              left: `${Math.min(Math.max(leftPct, 15), 75)}%`,
              top: `${Math.max(topPct, 2)}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="font-medium text-cyan">{printer.label}</span>
            <span className="mx-1.5 text-brand-border">|</span>
            <span className="text-brand-muted">{printer.tooltip}</span>
          </div>
        );
      })()}
    </div>
  );
}
