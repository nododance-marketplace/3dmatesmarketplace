const cards = [
  {
    title: "Moderation & approvals",
    description: "Provider profiles are reviewed before going live. Quality control from day one.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v5c0 5.25 3.83 10.17 9 11.38 5.17-1.21 9-6.13 9-11.38V7L12 2z" stroke="#0FB6C8" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Two-sided reviews",
    description: "Both customers and providers leave reviews. Reputation is earned, not assumed.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 7.2H22l-6 4.4 2.3 7.4L12 16.8 5.7 21l2.3-7.4-6-4.4h7.6L12 2z" stroke="#0FB6C8" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Soft-gated contact",
    description: "Contact details are visible to signed-in users only. Less spam, more real conversations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="#0FB6C8" strokeWidth="1.5" />
        <path d="M3 8l9 5 9-5" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Clear expectations",
    description: "Every job lists budget, timeline, and materials upfront. No guessing games.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="#0FB6C8" strokeWidth="1.5" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="12" x2="16" y2="12" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="8" y1="16" x2="12" y2="16" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </svg>
    ),
  },
];

export default function TrustSafety() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Trust &amp; safety</h2>
          <p className="mt-2 text-sm text-brand-muted">
            A marketplace only works when both sides feel safe.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-brand-border bg-brand-surface p-5 transition hover:border-brand-border-light"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10">
                {card.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-brand-text">
                {card.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-muted">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
