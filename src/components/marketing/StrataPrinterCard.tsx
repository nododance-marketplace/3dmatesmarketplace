import Image from "next/image";
import type { StrataPrinter } from "@/lib/strata";

// Product card for a Strata Labs printer. Clicking goes straight to the Strata
// Labs storefront. Product photos sit on a light panel so the hardware reads
// cleanly against the dark UI.
export default function StrataPrinterCard({
  printer,
}: {
  printer: StrataPrinter;
}) {
  const { name, category, specLine, price, image, href, comingSoon } = printer;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface transition hover:border-[#FF6A00]/40 hover:bg-brand-surface-hover"
    >
      {/* Image panel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-white to-[#E8E9EB]">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-4 transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-bg">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="5" width="16" height="11" rx="1.5" />
              <path d="M7 16v3h10v-3" />
              <path d="M9 9h6" />
            </svg>
          </div>
        )}
        {/* Category chip */}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
          {category}
        </span>
        {comingSoon && (
          <span className="absolute right-3 top-3 rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#FFB266] backdrop-blur-sm">
            Coming Soon
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-brand-text">{name}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-brand-muted">
          {specLine}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`text-sm font-bold ${
              comingSoon ? "text-brand-muted" : "text-[#FFB266]"
            }`}
          >
            {price}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-muted transition group-hover:text-brand-text">
            {comingSoon ? "Notify me" : "View"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-0.5">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
