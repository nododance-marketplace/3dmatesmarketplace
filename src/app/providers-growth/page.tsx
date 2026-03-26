import Link from "next/link";
import Footer from "@/components/marketing/Footer";
import ScrollReveal from "@/components/marketing/ScrollReveal";

const problems = [
  {
    title: "Inconsistent Jobs",
    desc: "Some months are packed, others are dead. You never know when the next order is coming.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 4-6" />
      </svg>
    ),
  },
  {
    title: "Underused Printers",
    desc: "You invested in equipment that sits idle. Your capacity far exceeds your current demand.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="8" width="12" height="8" rx="1" />
        <path d="M6 12h12" />
        <path d="M10 4h4v4h-4z" />
        <path d="M8 16v4h8v-4" />
      </svg>
    ),
  },
  {
    title: "No Automation",
    desc: "Manual quoting, back-and-forth emails, no intake process. Every job takes too long to close.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Word of Mouth Only",
    desc: "Your business depends on referrals. No website, no portfolio, no way for new customers to find you.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 9h8M8 13h4" />
      </svg>
    ),
  },
];

const solutions = [
  {
    tag: "Demand",
    title: "Get More Jobs",
    desc: "List your business on the 3DMates marketplace. Customers in Charlotte post jobs, and you respond with quotes. No cold outreach — leads come to you.",
    points: [
      "Appear in local search results",
      "Showcase your portfolio and capabilities",
      "Receive job requests matched to your setup",
    ],
    accent: "cyan",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    tag: "Efficiency",
    title: "Automate Your Workflow",
    desc: "We help you set up tools that handle intake, quoting, and follow-up — so you spend less time on admin and more time printing.",
    points: [
      "Structured job intake forms",
      "AI-assisted quoting and file review",
      "Automated follow-up and status updates",
    ],
    accent: "violet",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8l3 3-3 3M12 14h5" />
      </svg>
    ),
  },
  {
    tag: "Brand",
    title: "Upgrade Your Business",
    desc: "From a professional website to a curated portfolio, we help your brand match the quality of your work.",
    points: [
      "Custom website and online presence",
      "Professional portfolio and case studies",
      "Brand identity that stands out locally",
    ],
    accent: "amber",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
      </svg>
    ),
  },
];

const accentClasses: Record<string, { tag: string; ring: string; bg: string }> = {
  cyan: {
    tag: "border-cyan/30 bg-cyan/10 text-cyan",
    ring: "ring-cyan/20",
    bg: "bg-cyan/5",
  },
  violet: {
    tag: "border-violet-700/30 bg-violet-900/20 text-violet-300",
    ring: "ring-violet-700/20",
    bg: "bg-violet-900/10",
  },
  amber: {
    tag: "border-amber-700/30 bg-amber-900/20 text-amber-300",
    ring: "ring-amber-700/20",
    bg: "bg-amber-900/10",
  },
};

export default function ProvidersGrowthPage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="noise-overlay relative overflow-hidden py-24 sm:py-36">
        {/* Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(15, 182, 200, 0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,182,200,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15,182,200,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <span className="mb-6 inline-block rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan">
              For 3D Printing Providers
            </span>
            <h1 className="text-glow-cyan text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Turn Your 3D Printing Business Into a{" "}
              <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
                Lead-Generating Machine
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
              We help local 3D printing providers get more jobs, automate
              workflows, and modernize their business.
            </p>
            <div className="mt-10">
              <a
                href="https://calendly.com/moisesjdelcastillo/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-10 py-4 text-sm font-bold text-black sm:text-base"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a Call
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Sound familiar?
              </h2>
              <p className="mt-3 text-sm text-brand-muted sm:text-base">
                Most 3D printing businesses hit the same walls.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 100}>
                <div className="glass-card flex h-full flex-col rounded-2xl p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bg ring-1 ring-brand-border">
                    {p.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-brand-text">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {p.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #0FB6C8 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                How we help you{" "}
                <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
                  grow
                </span>
              </h2>
              <p className="mt-3 text-sm text-brand-muted sm:text-base">
                Three pillars to transform your 3D printing operation.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {solutions.map((s, i) => {
              const cls = accentClasses[s.accent];
              return (
                <ScrollReveal key={s.title} delay={i * 120}>
                  <div className="glass-card flex h-full flex-col rounded-3xl p-8">
                    <span
                      className={`inline-block self-start rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${cls.tag}`}
                    >
                      {s.tag}
                    </span>
                    <div
                      className={`mt-5 flex h-12 w-12 items-center justify-center rounded-xl ${cls.bg} ring-1 ${cls.ring}`}
                    >
                      {s.icon}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-brand-text">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                      {s.desc}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {s.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2 text-sm text-brand-muted"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#0FB6C8"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mt-0.5 flex-shrink-0"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ OFFER ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="glass-card overflow-hidden rounded-3xl">
              {/* Glow accent */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-[0.07]"
                style={{
                  background:
                    "radial-gradient(circle, #0FB6C8 0%, transparent 70%)",
                }}
              />

              <div className="relative p-8 sm:p-12">
                <span className="inline-block rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1 text-xs font-medium tracking-wide text-cyan">
                  Done-For-You Package
                </span>

                <h2 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
                  We build it. You print.
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                  We handle the setup so you can focus on what you do best —
                  making parts. From marketplace listing to workflow automation
                  to a professional online presence, we get you launch-ready.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-brand-muted">
                      Investment
                    </p>
                    <p className="mt-1 text-3xl font-black text-brand-text">
                      $4,000
                      <span className="text-lg font-medium text-brand-muted">
                        +
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-brand-muted">
                      Custom scope based on your business needs
                    </p>
                  </div>
                  <a
                    href="https://calendly.com/moisesjdelcastillo/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-black"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Book a Call
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(15, 182, 200, 0.1) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <h2 className="text-glow-cyan text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Ready to grow your{" "}
              <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
                3D printing business
              </span>
              ?
            </h2>
            <p className="mt-5 text-sm text-brand-muted sm:text-base">
              Book a free strategy call with Moises del Castillo — Charlotte
              Network Lead — and find out how 3DMates can help you get more
              jobs, streamline your workflow, and level up your brand.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://calendly.com/moisesjdelcastillo/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-10 py-4 text-sm font-bold text-black sm:text-base"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a Call
              </a>
              <Link
                href="/providers"
                className="btn-secondary inline-flex items-center justify-center rounded-2xl px-9 py-3.5 text-sm font-bold text-cyan"
              >
                Browse the Marketplace
              </Link>
            </div>

            <p className="mt-6 text-xs text-brand-muted/60">
              No commitment. No pressure. Just a conversation about your
              business.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
