import Link from "next/link";
import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, #0FB6C8 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Local{" "}
              <span className="text-cyan">3D Fabrication</span>
              <br />
              Network
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-brand-muted sm:text-xl">
              Get parts made in days, not weeks. Browse vetted local printers in
              Charlotte or post a job and get responses&mdash;fast.
            </p>

            {/* Trust bullets */}
            <ul className="mt-6 space-y-2.5">
              {[
                "Local providers. Real portfolios.",
                "Soft-gated contact details to reduce spam.",
                "Built for prototypes, replacement parts, and small-batch runs.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-brand-text">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/providers"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan px-7 py-3 text-sm font-semibold text-black transition hover:bg-cyan-hover"
              >
                Find a Provider
              </Link>
              <Link
                href="/auth/signin?callbackUrl=/jobs"
                className="inline-flex items-center justify-center rounded-2xl border border-cyan/40 px-7 py-3 text-sm font-semibold text-cyan transition hover:border-cyan hover:bg-cyan/5"
              >
                Post a Job
              </Link>
            </div>

            <p className="mt-4 text-xs text-brand-muted">
              Free to browse. Sign in to post, save, or contact.
            </p>
          </div>

          {/* Right: Hero illustration */}
          <div className="relative">
            {/* Glow behind the image */}
            <div
              className="pointer-events-none absolute inset-0 -m-8 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(ellipse at 60% 40%, #0FB6C8 0%, transparent 70%)" }}
            />

            {/* Soft edge mask so the image blends into the dark background */}
            <div className="relative overflow-hidden rounded-2xl" style={{
              maskImage: "radial-gradient(ellipse 85% 85% at 55% 45%, black 50%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 55% 45%, black 50%, transparent 100%)",
            }}>
              <Image
                src="/header image/Header image.png"
                alt="Isometric map of Charlotte's 3D printing network"
                width={2450}
                height={1363}
                className="w-full h-auto"
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
