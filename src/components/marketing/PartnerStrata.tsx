import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import StrataLockup from "./StrataLockup";
import StrataPrinterCard from "./StrataPrinterCard";
import { STRATA_URL, strataPrinters } from "@/lib/strata";

export default function PartnerStrata() {
  const featured = strataPrinters.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="section-divider absolute inset-x-0 top-0" />

      {/* Dual glow: cyan (3DMates) + orange (Strata) */}
      <div
        className="pointer-events-none absolute left-[12%] top-1/3 h-[420px] w-[520px] -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #0FB6C8 0%, transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute right-[10%] top-1/2 h-[420px] w-[520px] -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #FF6A00 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <StrataLockup size="md" />

            <span className="mt-7 inline-block rounded-full border border-[#FF6A00]/25 bg-[#FF6A00]/[0.07] px-4 py-1.5 text-xs font-medium tracking-wide text-[#FFB266]">
              Hardware Partner
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Need a printer? Get one through{" "}
              <span className="bg-gradient-to-r from-white via-[#C5C8CC] to-[#8A8F98] bg-clip-text text-transparent">
                Strata Labs
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
              3DMates has partnered with Strata Labs, a metal additive
              manufacturing company, so our network can buy industrial 3D
              printers at competitive rates. Whether you&apos;re scaling up your
              shop or printing metal for the first time, you get the hardware —
              we make the introduction.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ScrollReveal key={p.name} delay={i * 100}>
              <StrataPrinterCard printer={p} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={120}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/printers"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-9 py-3.5 text-sm font-bold text-black"
            >
              See the full lineup
            </Link>
            <a
              href={STRATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 px-9 py-3.5 text-sm font-bold text-brand-text transition hover:border-white/25 hover:bg-white/[0.04]"
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
  );
}
