import Link from "next/link";
import Image from "next/image";
import HeroMesh from "./HeroMesh";

export default function HomeHero() {
  return (
    <section className="noise-overlay relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* ── Layered background treatment ────────────────────── */}

      {/* Dark radial gradient base */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(15, 182, 200, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Teal glow bloom behind content */}
      <div
        className="pointer-events-none absolute -top-20 left-1/4 h-[600px] w-[900px] -translate-x-1/2 animate-glow-pulse rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(15, 182, 200, 0.12) 0%, transparent 65%)",
        }}
      />

      {/* Secondary warm glow offset */}
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[600px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse, #0FB6C8 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 182, 200, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 182, 200, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated mesh network */}
      <HeroMesh />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Copy */}
          <div className="max-w-xl animate-fade-in-up">
            {/* Eyebrow label */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-cyan">
                Charlotte, NC
              </span>
            </div>

            <h1 className="text-glow-cyan text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
              Local{" "}
              <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
                3D Fabrication
              </span>
              <br />
              Network
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-brand-muted sm:text-xl">
              Get parts made in days, not weeks. Browse vetted local printers in
              Charlotte or post a job and get responses&mdash;fast.
            </p>

            {/* Trust bullets */}
            <ul className="mt-8 space-y-3">
              {[
                "Local providers. Real portfolios.",
                "Soft-gated contact details to reduce spam.",
                "Built for prototypes, replacement parts, and small-batch runs.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-brand-text/90"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan/10">
                    <svg
                      className="h-3 w-3 text-cyan"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/providers"
                className="btn-primary inline-flex items-center justify-center rounded-2xl px-8 py-3.5 text-sm font-bold text-black"
              >
                Find a Provider
              </Link>
              <Link
                href="/auth/signin?callbackUrl=/jobs"
                className="btn-secondary inline-flex items-center justify-center rounded-2xl px-8 py-3.5 text-sm font-bold text-cyan"
              >
                Post a Job
              </Link>
            </div>

            <p className="mt-5 text-xs text-brand-muted/70">
              Free to browse. Sign in to post, save, or contact.
            </p>
          </div>

          {/* Right: Hero illustration */}
          <div
            className="relative animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            {/* Multi-layer glow behind image */}
            <div
              className="pointer-events-none absolute inset-0 -m-12 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at 60% 40%, #0FB6C8 0%, transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 -m-4 rounded-full opacity-10 blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 60%, #0DD9EF 0%, transparent 60%)",
              }}
            />

            {/* Soft edge mask */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                maskImage:
                  "radial-gradient(ellipse 85% 85% at 55% 45%, black 50%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 85% 85% at 55% 45%, black 50%, transparent 100%)",
              }}
            >
              <Image
                src="/header image/Header image.png"
                alt="Isometric map of Charlotte's 3D printing network"
                width={2450}
                height={1363}
                className="h-auto w-full"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
