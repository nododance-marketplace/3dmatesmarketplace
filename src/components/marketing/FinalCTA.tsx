import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function FinalCTA() {
  return (
    <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
      {/* Multi-layer background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(15, 182, 200, 0.1) 0%, transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[500px] -translate-x-1/2 rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(ellipse, #0DD9EF 0%, transparent 70%)" }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 182, 200, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 182, 200, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
        <ScrollReveal>
          <h2 className="text-glow-cyan text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Turn local capacity into a{" "}
            <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
              network
            </span>
            .
          </h2>
          <p className="mt-5 text-sm text-brand-muted sm:text-base">
            Charlotte&apos;s 3D printing community is bigger than you think.
            Join the network and start making.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signin"
              className="btn-primary inline-flex items-center justify-center rounded-2xl px-9 py-3.5 text-sm font-bold text-black"
            >
              Get Started
            </Link>
            <Link
              href="/providers"
              className="btn-secondary inline-flex items-center justify-center rounded-2xl px-9 py-3.5 text-sm font-bold text-cyan"
            >
              Browse Providers
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
