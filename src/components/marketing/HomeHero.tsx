"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import HeroMesh from "./HeroMesh";

// Lazy-load the 3D model to avoid SSR issues with Three.js
const HeroModel = dynamic(() => import("./HeroModel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-cyan/5 animate-pulse" />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(15, 182, 200, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  ),
});

export default function HomeHero() {
  return (
    <section className="noise-overlay relative overflow-hidden py-12 sm:py-20 lg:py-36">
      {/* ── Layered atmospheric background ────────────────────── */}

      {/* Primary radial gradient - deep teal glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 60% 40%, rgba(15, 182, 200, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Secondary warm gradient bloom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(13, 217, 239, 0.04) 0%, transparent 70%)",
        }}
      />

      {/* Teal glow bloom behind content */}
      <div
        className="pointer-events-none absolute -top-20 right-1/4 h-[700px] w-[1000px] animate-glow-pulse rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(15, 182, 200, 0.14) 0%, transparent 60%)",
        }}
      />

      {/* Deep ambient layer */}
      <div
        className="pointer-events-none absolute -bottom-40 left-0 h-[500px] w-[700px] rounded-full opacity-[0.05]"
        style={{
          background:
            "radial-gradient(ellipse, #0FB6C8 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 182, 200, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 182, 200, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated mesh network */}
      <HeroMesh />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-6 sm:gap-12 lg:grid-cols-2 lg:gap-16">
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

          {/* Right: 3D Hero Model */}
          <div
            className="relative animate-fade-in-up order-first lg:order-last"
            style={{ animationDelay: "200ms" }}
          >
            {/* Multi-layer glow behind model */}
            <div
              className="pointer-events-none absolute inset-0 -m-8 sm:-m-16 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at 55% 45%, #0FB6C8 0%, transparent 65%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 -m-4 sm:-m-8 rounded-full opacity-15 blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at 45% 55%, #0DD9EF 0%, transparent 55%)",
              }}
            />
            {/* Soft teal ring glow */}
            <div
              className="pointer-events-none absolute inset-0 -m-2 sm:-m-4 rounded-full opacity-[0.08]"
              style={{
                background:
                  "radial-gradient(circle, transparent 40%, rgba(15, 182, 200, 0.3) 60%, transparent 75%)",
              }}
            />

            {/* 3D Model container — 4:3 on mobile, square on desktop */}
            <div className="relative aspect-[4/3] sm:aspect-square w-full max-w-[400px] sm:max-w-[560px] mx-auto lg:max-w-none">
              <HeroModel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
