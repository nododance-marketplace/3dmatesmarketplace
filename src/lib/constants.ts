// ── 3DMates Taxonomy Constants ───────────────────────────────
// Single source of truth for all categories, materials, processes.

export const MATERIALS = [
  "PLA",
  "PETG",
  "ABS",
  "ASA",
  "Nylon",
  "Nylon-CF",
  "PC",
  "TPU",
  "Resin",
  "Other",
] as const;

export const PROCESSES = [
  "FDM",
  "RESIN",
  "SLS",
  "MJF",
  "CNC",
  "LASER",
  "OTHER",
] as const;

export const CAPABILITIES = [
  "CAD_DESIGN",
  "CAD_CLEANUP",
  "LIDAR_SCAN",
  "AUTOMOTIVE_FITMENT",
  "RAPID_PROTOTYPING",
  "SMALL_BATCH",
  "PAINT_FINISH",
  "INSTALL_HELP",
] as const;

export const JOB_CATEGORIES = [
  "AUTO",
  "PROTOTYPE",
  "REPLACEMENT_PART",
  "COSPLAY",
  "HOME",
  "INDUSTRIAL",
  "OTHER",
] as const;

export type Material = (typeof MATERIALS)[number];
export type Process = (typeof PROCESSES)[number];
export type Capability = (typeof CAPABILITIES)[number];
export type JobCategory = (typeof JOB_CATEGORIES)[number];

// ── Human-readable labels ────────────────────────────────────

export const CAPABILITY_LABELS: Record<string, string> = {
  CAD_DESIGN: "CAD Design",
  CAD_CLEANUP: "CAD Cleanup",
  LIDAR_SCAN: "LiDAR Scan",
  AUTOMOTIVE_FITMENT: "Auto Fitment",
  RAPID_PROTOTYPING: "Rapid Prototyping",
  SMALL_BATCH: "Small Batch",
  PAINT_FINISH: "Paint / Finish",
  INSTALL_HELP: "Install Help",
};

export const JOB_CATEGORY_LABELS: Record<string, string> = {
  AUTO: "Automotive",
  PROTOTYPE: "Prototype",
  REPLACEMENT_PART: "Replacement Part",
  COSPLAY: "Cosplay / Props",
  HOME: "Home / Decor",
  INDUSTRIAL: "Industrial",
  OTHER: "Other",
};

// ── Badge colors (restrained palette) ────────────────────────

export const MATERIAL_COLORS: Record<string, string> = {
  PLA: "bg-emerald-900/40 text-emerald-300 border-emerald-700/30",
  PETG: "bg-blue-900/40 text-blue-300 border-blue-700/30",
  ABS: "bg-orange-900/40 text-orange-300 border-orange-700/30",
  ASA: "bg-amber-900/40 text-amber-300 border-amber-700/30",
  Nylon: "bg-violet-900/40 text-violet-300 border-violet-700/30",
  "Nylon-CF": "bg-purple-900/40 text-purple-300 border-purple-700/30",
  PC: "bg-red-900/40 text-red-300 border-red-700/30",
  TPU: "bg-pink-900/40 text-pink-300 border-pink-700/30",
  Resin: "bg-cyan-900/40 text-cyan-300 border-cyan-700/30",
  Other: "bg-gray-800/40 text-gray-300 border-gray-700/30",
};

export const PROCESS_COLORS: Record<string, string> = {
  FDM: "bg-cyan-900/40 text-cyan-300 border-cyan-700/30",
  RESIN: "bg-violet-900/40 text-violet-300 border-violet-700/30",
  SLS: "bg-amber-900/40 text-amber-300 border-amber-700/30",
  MJF: "bg-blue-900/40 text-blue-300 border-blue-700/30",
  CNC: "bg-red-900/40 text-red-300 border-red-700/30",
  LASER: "bg-emerald-900/40 text-emerald-300 border-emerald-700/30",
  OTHER: "bg-gray-800/40 text-gray-300 border-gray-700/30",
};

export const CAPABILITY_COLORS: Record<string, string> = {
  CAD_DESIGN: "bg-cyan-900/40 text-cyan-300 border-cyan-700/30",
  CAD_CLEANUP: "bg-teal-900/40 text-teal-300 border-teal-700/30",
  LIDAR_SCAN: "bg-indigo-900/40 text-indigo-300 border-indigo-700/30",
  AUTOMOTIVE_FITMENT: "bg-orange-900/40 text-orange-300 border-orange-700/30",
  RAPID_PROTOTYPING: "bg-emerald-900/40 text-emerald-300 border-emerald-700/30",
  SMALL_BATCH: "bg-blue-900/40 text-blue-300 border-blue-700/30",
  PAINT_FINISH: "bg-pink-900/40 text-pink-300 border-pink-700/30",
  INSTALL_HELP: "bg-amber-900/40 text-amber-300 border-amber-700/30",
};

// ── Map pin colors by first process ──────────────────────────

export const MAP_PIN_COLORS: Record<string, string> = {
  FDM: "#0FB6C8",
  RESIN: "#8B5CF6",
  SLS: "#F59E0B",
  MJF: "#3B82F6",
  CNC: "#EF4444",
  LASER: "#10B981",
  OTHER: "#6B7280",
  DEFAULT: "#0FB6C8",
};
