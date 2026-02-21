"use client";

interface BadgeProps {
  label: string;
  colorClass?: string;
}

export default function Badge({ label, colorClass }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium ${
        colorClass || "bg-gray-800/40 text-gray-300 border-gray-700/30"
      }`}
    >
      {label}
    </span>
  );
}
