import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(ellipse, #0FB6C8 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
          Turn local capacity into a{" "}
          <span className="text-cyan">network</span>.
        </h2>
        <p className="mt-4 text-sm text-brand-muted sm:text-base">
          Charlotte&apos;s 3D printing community is bigger than you think.
          Join the network and start making.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-2xl bg-cyan px-8 py-3 text-sm font-semibold text-black transition hover:bg-cyan-hover"
          >
            Get Started
          </Link>
          <Link
            href="/providers"
            className="inline-flex items-center justify-center rounded-2xl border border-cyan/40 px-8 py-3 text-sm font-semibold text-cyan transition hover:border-cyan hover:bg-cyan/5"
          >
            Browse Providers
          </Link>
        </div>
      </div>
    </section>
  );
}
