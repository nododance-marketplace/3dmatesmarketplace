import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function PartnerVizus() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="section-divider absolute inset-x-0 top-0" />

      {/* Vizus-purple glow accent */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse, #6A00FF 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="glass-card overflow-hidden rounded-3xl">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-12">
              {/* Logo block */}
              <div className="flex flex-col items-center gap-4 lg:items-start">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-2xl ring-1 ring-white/10"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(106,0,255,0.18), rgba(11,15,20,0.4))",
                  }}
                >
                  <Image
                    src="/partners/vizus-icon.png"
                    alt="Vizus"
                    width={72}
                    height={72}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <span className="text-2xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-[#8B5CF6] via-[#6A00FF] to-[#3A66FF] bg-clip-text text-transparent">
                    VIZUS
                  </span>
                </span>
              </div>

              {/* Copy block */}
              <div>
                <span
                  className="inline-block rounded-full border px-3 py-1 text-xs font-medium tracking-wide"
                  style={{
                    borderColor: "rgba(106,0,255,0.3)",
                    backgroundColor: "rgba(106,0,255,0.08)",
                    color: "#B794FF",
                  }}
                >
                  In Partnership With
                </span>

                <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                  Powered by our partnership with{" "}
                  <span className="bg-gradient-to-r from-[#8B5CF6] to-[#3A66FF] bg-clip-text text-transparent">
                    Vizus
                  </span>
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                  3DMates is built and run alongside Vizus, an AI systems
                  company that designs and deploys custom AI infrastructure,
                  intelligent automation, and scalable platforms. The same team
                  that engineered the 3DMates platform helps engineering firms
                  put AI to work — and you can see the full body of that work on
                  the Vizus site.
                </p>

                <a
                  href="https://vizus.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/12 px-6 py-3 text-sm font-bold text-brand-text transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  Explore Vizus
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
