export default function SocialProof() {
  return (
    <section className="border-y border-brand-border bg-brand-surface/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-sm font-medium tracking-wide text-brand-muted">
          Built for makers, founders, and local shops.
        </p>

        {/* Placeholder logos — monochrome abstract shapes */}
        <div className="mt-6 flex items-center justify-center gap-8 sm:gap-12">
          {[
            /* Each "logo" is a simple geometric SVG */
            <svg key="l1" width="80" height="28" viewBox="0 0 80 28" fill="none">
              <rect x="0" y="6" width="16" height="16" rx="3" fill="#374151" />
              <rect x="22" y="10" width="58" height="4" rx="2" fill="#374151" />
              <rect x="22" y="17" width="36" height="3" rx="1.5" fill="#1F2937" />
            </svg>,
            <svg key="l2" width="80" height="28" viewBox="0 0 80 28" fill="none">
              <circle cx="14" cy="14" r="10" fill="#374151" />
              <rect x="30" y="10" width="50" height="4" rx="2" fill="#374151" />
              <rect x="30" y="17" width="30" height="3" rx="1.5" fill="#1F2937" />
            </svg>,
            <svg key="l3" width="80" height="28" viewBox="0 0 80 28" fill="none" className="hidden sm:block">
              <polygon points="14,2 26,14 14,26 2,14" fill="#374151" />
              <rect x="32" y="10" width="48" height="4" rx="2" fill="#374151" />
              <rect x="32" y="17" width="28" height="3" rx="1.5" fill="#1F2937" />
            </svg>,
            <svg key="l4" width="80" height="28" viewBox="0 0 80 28" fill="none" className="hidden md:block">
              <rect x="2" y="4" width="12" height="20" rx="6" fill="#374151" />
              <rect x="20" y="10" width="60" height="4" rx="2" fill="#374151" />
              <rect x="20" y="17" width="40" height="3" rx="1.5" fill="#1F2937" />
            </svg>,
            <svg key="l5" width="80" height="28" viewBox="0 0 80 28" fill="none" className="hidden lg:block">
              <path d="M2 24L14 4L26 24H2Z" fill="#374151" />
              <rect x="32" y="10" width="48" height="4" rx="2" fill="#374151" />
              <rect x="32" y="17" width="32" height="3" rx="1.5" fill="#1F2937" />
            </svg>,
          ]}
        </div>

        {/* Stat */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-bg px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="text-xs text-brand-muted">
              Avg response time: under 24h{" "}
              <span className="text-brand-border">(beta target)</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
