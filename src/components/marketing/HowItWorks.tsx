import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    step: "01",
    title: "Browse providers",
    description:
      "Filter by material, process, or location. View portfolios, reviews, and capabilities on a map.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="6" width="12" height="9" rx="2" stroke="#0FB6C8" strokeWidth="1.5" />
        <rect x="18" y="6" width="12" height="9" rx="2" stroke="#0FB6C8" strokeWidth="1.5" />
        <rect x="2" y="19" width="12" height="9" rx="2" stroke="#0FB6C8" strokeWidth="1.5" />
        <rect x="18" y="19" width="12" height="9" rx="2" stroke="#0FB6C8" strokeWidth="1.5" opacity="0.4" />
        <circle cx="8" cy="10" r="1.5" fill="#0FB6C8" />
        <rect x="5" y="12" width="6" height="1" rx="0.5" fill="#0FB6C8" opacity="0.5" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Post a job",
    description:
      "Describe your part, set materials, budget, and deadline. Providers in your area get notified.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="4" width="20" height="24" rx="3" stroke="#0FB6C8" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="22" y2="10" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="15" x2="22" y2="15" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="10" y1="20" x2="17" y2="20" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <circle cx="24" cy="24" r="6" fill="#0B0F14" stroke="#0FB6C8" strokeWidth="1.5" />
        <line x1="22" y1="24" x2="26" y2="24" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="22" x2="24" y2="26" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Get it made locally",
    description:
      "Receive responses with price estimates and turnaround times. Choose a provider and get your parts.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 16L12 24L28 8" stroke="#0FB6C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="14" stroke="#0FB6C8" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-sm text-brand-muted sm:text-base">
              Three steps from idea to finished part.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 120}>
              <div className="glass-card group relative h-full rounded-3xl p-7 transition-all duration-300">
                {/* Step number */}
                <span className="text-xs font-bold tracking-widest text-cyan/30">
                  {s.step}
                </span>

                {/* Icon */}
                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/5 ring-1 ring-cyan/10">
                  {s.icon}
                </div>

                <h3 className="mt-5 text-base font-bold text-brand-text">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">
                  {s.description}
                </p>

                {/* Connector line (between cards) */}
                {s.step !== "03" && (
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-brand-border to-transparent sm:block" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
