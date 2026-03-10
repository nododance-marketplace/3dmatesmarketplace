import ScrollReveal from "./ScrollReveal";

const customerPoints = [
  { title: "Rapid prototypes", desc: "Test ideas fast with local turnaround." },
  { title: "Replacement parts", desc: "Get exact-fit parts for machines, vehicles, and home." },
  { title: "Small batch runs", desc: "Order 5 or 500 without factory minimums." },
];

const providerPoints = [
  { title: "Local leads", desc: "Customers in your city looking for your exact capabilities." },
  { title: "Portfolio visibility", desc: "Showcase your work, materials, and equipment." },
  { title: "Job requests in your niche", desc: "Get matched to projects that fit your setup." },
];

export default function TwoSidedValue() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Gradient dividers */}
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="section-divider absolute inset-x-0 bottom-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Two sides. One network.
            </h2>
            <p className="mt-3 text-sm text-brand-muted sm:text-base">
              Whether you need parts or make them, 3DMates connects the dots.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Customer side */}
          <ScrollReveal delay={0}>
            <div className="glass-card h-full rounded-3xl p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/5 ring-1 ring-cyan/10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="4" stroke="#0FB6C8" strokeWidth="1.5" />
                    <path d="M2 18c0-4 3.5-7 8-7s8 3 8 7" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">For Customers</h3>
              </div>
              <ul className="mt-7 space-y-5">
                {customerPoints.map((p) => (
                  <li key={p.title} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                    <div>
                      <span className="text-sm font-semibold text-brand-text">{p.title}</span>
                      <p className="mt-0.5 text-sm text-brand-muted">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Provider side */}
          <ScrollReveal delay={150}>
            <div className="glass-card relative h-full overflow-hidden rounded-3xl p-8 sm:p-10" style={{ borderColor: "rgba(15, 182, 200, 0.15)" }}>
              {/* Subtle cyan glow in corner */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, #0FB6C8 0%, transparent 70%)" }}
              />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/5 ring-1 ring-cyan/10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="8" width="14" height="3" rx="1" stroke="#0FB6C8" strokeWidth="1.5" />
                    <rect x="5" y="3" width="2" height="6" stroke="#0FB6C8" strokeWidth="1" />
                    <rect x="5" y="3" width="7" height="2" rx="0.5" stroke="#0FB6C8" strokeWidth="1" />
                    <rect x="6" y="11" width="8" height="6" rx="1" fill="#0FB6C8" opacity="0.15" stroke="#0FB6C8" strokeWidth="1" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-cyan">For Providers</h3>
              </div>
              <ul className="mt-7 space-y-5">
                {providerPoints.map((p) => (
                  <li key={p.title} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                    <div>
                      <span className="text-sm font-semibold text-brand-text">{p.title}</span>
                      <p className="mt-0.5 text-sm text-brand-muted">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
