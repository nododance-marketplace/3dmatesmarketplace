import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function ImageTo3DCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(139, 92, 246, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <ScrollReveal>
            <div>
              <span className="inline-block rounded-full border border-violet-700/30 bg-violet-900/20 px-3 py-1 text-xs font-medium text-violet-300">
                New Feature
              </span>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                No 3D file?{" "}
                <span className="bg-gradient-to-r from-violet-400 to-cyan bg-clip-text text-transparent">
                  No problem.
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                Upload photos, sketches, or screenshots of what you want made.
                Local fabricators with design + print capabilities will help turn
                your idea into a real, physical part.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Upload reference images of your object or idea",
                  "Describe size, material, and intended use",
                  "Get matched with providers who offer modeling + printing",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-brand-muted"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0FB6C8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 flex-shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/jobs/from-image"
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3 text-sm font-bold text-black"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  Upload an Image
                </Link>
                <Link
                  href="/jobs"
                  className="btn-secondary inline-flex items-center justify-center rounded-2xl px-7 py-3 text-sm font-bold text-cyan"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: visual card */}
          <ScrollReveal delay={150}>
            <div className="glass-card rounded-3xl p-8">
              {/* Mock flow preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-900/30 ring-1 ring-violet-700/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text">
                      Upload Reference Images
                    </p>
                    <p className="text-xs text-brand-muted">
                      Photos, sketches, screenshots
                    </p>
                  </div>
                </div>

                <div className="ml-5 h-6 border-l border-dashed border-brand-border" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 ring-1 ring-cyan/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="12" height="16" rx="2" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="9" y1="12" x2="15" y2="12" />
                      <line x1="9" y1="16" x2="12" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text">
                      Describe Your Object
                    </p>
                    <p className="text-xs text-brand-muted">
                      Size, material, intended use
                    </p>
                  </div>
                </div>

                <div className="ml-5 h-6 border-l border-dashed border-brand-border" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900/30 ring-1 ring-emerald-700/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text">
                      Get It Made Locally
                    </p>
                    <p className="text-xs text-brand-muted">
                      Providers model + print your part
                    </p>
                  </div>
                </div>
              </div>

              {/* Example badge */}
              <div className="mt-6 rounded-xl border border-violet-700/20 bg-violet-900/10 p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-violet-900/40 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                    Needs Modeling
                  </span>
                  <span className="text-xs text-brand-muted">
                    Providers see this label on your job
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
