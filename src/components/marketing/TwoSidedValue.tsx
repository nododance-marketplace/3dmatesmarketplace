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
    <section className="border-y border-brand-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Two sides. One network.
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Whether you need parts or make them, 3DMates connects the dots.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Customer side */}
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="4" stroke="#0FB6C8" strokeWidth="1.5" />
                  <path d="M2 18c0-4 3.5-7 8-7s8 3 8 7" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">For Customers</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {customerPoints.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <div>
                    <span className="text-sm font-medium text-brand-text">{p.title}</span>
                    <p className="mt-0.5 text-sm text-brand-muted">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Provider side */}
          <div className="rounded-2xl border border-cyan/20 bg-brand-surface p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="8" width="14" height="3" rx="1" stroke="#0FB6C8" strokeWidth="1.5" />
                  <rect x="5" y="3" width="2" height="6" stroke="#0FB6C8" strokeWidth="1" />
                  <rect x="5" y="3" width="7" height="2" rx="0.5" stroke="#0FB6C8" strokeWidth="1" />
                  <rect x="6" y="11" width="8" height="6" rx="1" fill="#0FB6C8" opacity="0.15" stroke="#0FB6C8" strokeWidth="1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-cyan">For Providers</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {providerPoints.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                  <div>
                    <span className="text-sm font-medium text-brand-text">{p.title}</span>
                    <p className="mt-0.5 text-sm text-brand-muted">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
