import type { Metadata } from "next";
import Footer from "@/components/marketing/Footer";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import StrataLockup from "@/components/marketing/StrataLockup";
import StrataPrinterCard from "@/components/marketing/StrataPrinterCard";
import { STRATA_URL, strataPrinters, strataComingSoon } from "@/lib/strata";

export const metadata: Metadata = {
  title: "3D Printers — 3DMates × Strata Labs",
  description:
    "Buy industrial metal 3D printers at competitive rates through the 3DMates × Strata Labs partnership. SLM desktop, dental, and large-format systems — plus SLS, resin, and large-format FDM coming soon.",
};

export default function PrintersPage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
        <div
          className="pointer-events-none absolute left-[15%] top-1/3 h-[480px] w-[560px] -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #0FB6C8 0%, transparent 65%)" }}
        />
        <div
          className="pointer-events-none absolute right-[12%] top-1/2 h-[480px] w-[560px] -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #FF6A00 0%, transparent 65%)" }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <StrataLockup size="lg" />
            <span className="mt-8 inline-block rounded-full border border-[#FF6A00]/25 bg-[#FF6A00]/[0.07] px-4 py-1.5 text-xs font-medium tracking-wide text-[#FFB266]">
              3DMates × Strata Labs · Hardware Partner
            </span>
            <h1 className="text-glow-cyan mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
              Industrial 3D printers,{" "}
              <span className="bg-gradient-to-r from-white via-[#C5C8CC] to-[#8A8F98] bg-clip-text text-transparent">
                at network rates
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
              3DMates partners with Strata Labs so our network can source metal
              additive manufacturing systems at competitive prices. Browse the
              lineup below — every printer takes you straight to the Strata Labs
              storefront to buy or request a quote.
            </p>
            <div className="mt-9">
              <a
                href={STRATA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-9 py-3.5 text-sm font-bold text-black"
              >
                Visit Strata Labs
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ AVAILABLE PRINTERS ═══ */}
      <section className="relative py-20 sm:py-28">
        <div className="section-divider absolute inset-x-0 top-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Available now
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-brand-muted sm:text-base">
                SLM metal printers spanning desktop, dental, and industrial
                production.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {strataPrinters.map((p, i) => (
              <ScrollReveal key={p.name} delay={(i % 3) * 100}>
                <StrataPrinterCard printer={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMING SOON ═══ */}
      <section className="relative py-20 sm:py-28">
        <div className="section-divider absolute inset-x-0 top-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Coming soon
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-brand-muted sm:text-base">
                The lineup is expanding beyond metal — more processes are on the
                way.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {strataComingSoon.map((p, i) => (
              <ScrollReveal key={p.name} delay={(i % 3) * 100}>
                <StrataPrinterCard printer={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, #FF6A00 0%, transparent 65%)" }}
        />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <StrataLockup size="md" />
            <h2 className="mt-8 text-3xl font-black tracking-tight sm:text-4xl">
              Two companies, one mission
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-brand-muted sm:text-base">
              3DMates and Strata Labs are pushing the 3D printing community
              forward together — connecting makers with the network, the work,
              and the machines to build at scale.
            </p>
            <div className="mt-9">
              <a
                href={STRATA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-10 py-4 text-sm font-bold text-black sm:text-base"
              >
                Shop printers at Strata Labs
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
