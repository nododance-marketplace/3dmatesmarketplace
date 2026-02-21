"use client";

import { useState } from "react";
import Link from "next/link";
import { PROCESS_COLORS, JOB_CATEGORY_LABELS } from "@/lib/constants";
import { parseJsonArray } from "@/lib/helpers";

interface Provider {
  slug: string;
  displayName: string;
  headline: string | null;
  city: string;
  processes: string[];
  thumbnail: string | null;
  avgRating: number;
  reviewCount: number;
}

interface Job {
  id: string;
  title: string;
  category: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  city: string;
  responseCount: number;
  createdAt: string;
}

function fmtBudget(min?: number | null, max?: number | null) {
  if (min && max) return `$${min} - $${max}`;
  if (min) return `$${min}+`;
  if (max) return `Up to $${max}`;
  return "Flexible";
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
      <div className="mb-3 h-32 animate-pulse rounded-lg bg-brand-bg" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-brand-bg" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-brand-bg" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-12 animate-pulse rounded bg-brand-bg" />
        <div className="h-5 w-12 animate-pulse rounded bg-brand-bg" />
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: "providers" | "jobs" }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface">
        {type === "providers" ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="8" width="18" height="4" rx="1" stroke="#374151" strokeWidth="1.5" />
            <rect x="5" y="3" width="2" height="6" stroke="#374151" strokeWidth="1" />
            <rect x="5" y="3" width="7" height="2" rx="0.5" stroke="#374151" strokeWidth="1" />
            <rect x="6" y="12" width="12" height="8" rx="1" stroke="#374151" strokeWidth="1" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="3" width="14" height="18" rx="2" stroke="#374151" strokeWidth="1.5" />
            <line x1="8" y1="8" x2="16" y2="8" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="12" x2="14" y2="12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        )}
      </div>
      <p className="mt-3 text-sm text-brand-muted">
        {type === "providers"
          ? "No approved providers yet. Be the first to join."
          : "No open jobs yet. Post the first one."}
      </p>
      <Link
        href={type === "providers" ? "/onboarding" : "/auth/signin?callbackUrl=/jobs"}
        className="mt-4 rounded-xl border border-brand-border px-4 py-2 text-xs font-medium text-brand-muted transition hover:border-brand-border-light hover:text-brand-text"
      >
        {type === "providers" ? "Become a Provider" : "Post a Job"}
      </Link>
    </div>
  );
}

export default function FeaturedPreviews({
  providers,
  jobs,
}: {
  providers: Provider[];
  jobs: Job[];
}) {
  const [tab, setTab] = useState<"providers" | "jobs">("providers");

  return (
    <section className="border-t border-brand-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured</h2>
            <p className="mt-1 text-sm text-brand-muted">Live from the network.</p>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-xl border border-brand-border bg-brand-surface p-1">
            <button
              onClick={() => setTab("providers")}
              className={`rounded-lg px-4 py-1.5 text-xs font-medium transition ${
                tab === "providers"
                  ? "bg-cyan/10 text-cyan"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              Featured Providers
            </button>
            <button
              onClick={() => setTab("jobs")}
              className={`rounded-lg px-4 py-1.5 text-xs font-medium transition ${
                tab === "jobs"
                  ? "bg-cyan/10 text-cyan"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              Latest Jobs
            </button>
          </div>
        </div>

        {/* Provider cards */}
        {tab === "providers" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {providers.length === 0 ? (
              <EmptyState type="providers" />
            ) : (
              providers.map((p) => (
                <Link
                  key={p.slug}
                  href={`/providers/${p.slug}`}
                  className="group rounded-2xl border border-brand-border bg-brand-surface p-4 transition hover:border-brand-border-light hover:bg-brand-surface-hover"
                >
                  {p.thumbnail ? (
                    <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-brand-bg">
                      <img
                        src={p.thumbnail}
                        alt={p.displayName}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 flex aspect-video items-center justify-center rounded-xl bg-brand-bg">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.3">
                        <rect x="6" y="14" width="20" height="5" rx="1.5" stroke="#6B7280" strokeWidth="1.5" />
                        <rect x="9" y="6" width="3" height="9" stroke="#6B7280" strokeWidth="1" />
                        <rect x="9" y="6" width="10" height="3" rx="1" stroke="#6B7280" strokeWidth="1" />
                        <rect x="10" y="19" width="12" height="8" rx="1.5" stroke="#6B7280" strokeWidth="1" />
                      </svg>
                    </div>
                  )}
                  <h3 className="font-semibold text-brand-text">{p.displayName}</h3>
                  {p.headline && (
                    <p className="mt-1 text-sm text-brand-muted line-clamp-1">{p.headline}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs text-brand-muted">
                    <span>{p.city}</span>
                    {p.avgRating > 0 && (
                      <>
                        <span>&#183;</span>
                        <span className="text-cyan">
                          {p.avgRating} ({p.reviewCount})
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.processes.slice(0, 3).map((proc) => (
                      <span
                        key={proc}
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                          PROCESS_COLORS[proc] || "bg-gray-800/40 text-gray-300 border-gray-700/30"
                        }`}
                      >
                        {proc}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Job cards */}
        {tab === "jobs" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.length === 0 ? (
              <EmptyState type="jobs" />
            ) : (
              jobs.map((j) => (
                <Link
                  key={j.id}
                  href={`/jobs/${j.id}`}
                  className="group rounded-2xl border border-brand-border bg-brand-surface p-4 transition hover:border-brand-border-light hover:bg-brand-surface-hover"
                >
                  <h3 className="font-semibold text-brand-text">{j.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-brand-muted">
                    <span>{j.city}</span>
                    <span>&#183;</span>
                    <span>{fmtBudget(j.budgetMin, j.budgetMax)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-brand-muted">
                      {j.responseCount} response{j.responseCount !== 1 ? "s" : ""}
                    </span>
                    {j.category && (
                      <span className="rounded bg-brand-bg px-2 py-0.5 text-brand-muted">
                        {JOB_CATEGORY_LABELS[j.category] || j.category}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* View all link */}
        <div className="mt-8 text-center">
          <Link
            href={tab === "providers" ? "/providers" : "/jobs"}
            className="text-sm font-medium text-cyan transition hover:text-cyan-hover"
          >
            View all {tab === "providers" ? "providers" : "jobs"} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
