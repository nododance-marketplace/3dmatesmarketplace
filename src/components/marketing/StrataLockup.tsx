import Image from "next/image";

// Symmetric 3DMates × Strata Labs emblem lockup — two equal tiles joined by a
// multiply mark, signalling a balanced partnership.
export default function StrataLockup({
  size = "md",
}: {
  size?: "md" | "lg";
}) {
  const tile =
    size === "lg" ? "h-24 w-24 sm:h-28 sm:w-28" : "h-16 w-16 sm:h-20 sm:w-20";
  const emblem = size === "lg" ? 72 : 52;
  const cross = size === "lg" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl";

  return (
    <div className="flex items-center justify-center gap-5 sm:gap-7">
      {/* 3DMates */}
      <div
        className={`flex ${tile} items-center justify-center rounded-2xl bg-cyan/[0.07] ring-1 ring-cyan/20`}
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <Image
          src="/brand/Emblem.svg"
          alt="3DMates"
          width={emblem}
          height={emblem}
          unoptimized
          className="h-3/5 w-3/5 object-contain"
        />
      </div>

      {/* Connector */}
      <span className={`${cross} font-light text-brand-muted/60`}>&times;</span>

      {/* Strata Labs */}
      <div
        className={`flex ${tile} items-center justify-center rounded-2xl ring-1 ring-white/12`}
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.10), rgba(11,15,20,0.5))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <Image
          src="/partners/strata/emblem.png"
          alt="Strata Labs"
          width={emblem}
          height={emblem}
          className="h-3/5 w-3/5 object-contain"
        />
      </div>
    </div>
  );
}
