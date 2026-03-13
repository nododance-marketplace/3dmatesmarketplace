"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { parseJsonArray } from "@/lib/helpers";

export default function ProviderDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (!session.user.hasOnboarded) {
      router.push("/onboarding");
      return;
    }

    Promise.all([
      fetch("/api/provider-profile/me").then((r) => r.json()),
      fetch("/api/provider-profile/my-responses").then((r) => r.json()),
    ]).then(([profileData, responsesData]) => {
      setProfile(profileData);
      setResponses(Array.isArray(responsesData) ? responsesData : []);
      setLoading(false);
    });
  }, [session, status]);

  if (status === "loading" || loading)
    return (
      <div className="py-20 text-center text-brand-muted">Loading...</div>
    );

  if (!profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Set Up Your Provider Profile</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Create your profile to start receiving job requests.
        </p>
        <Link
          href="/provider/profile/edit"
          className="mt-4 inline-block rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  const materials = parseJsonArray(profile.materials);
  const processes = parseJsonArray(profile.processes);
  const completionItems = [
    { label: "Display name", done: !!profile.displayName },
    { label: "Headline", done: !!profile.headline },
    { label: "Bio", done: !!profile.bio },
    { label: "Address (for map)", done: !!profile.address },
    { label: "Contact email", done: !!profile.contactEmail },
    { label: "Processes", done: processes.length > 0 },
    { label: "Materials", done: materials.length > 0 },
    { label: "Portfolio images", done: profile.portfolio?.length > 0 },
  ];
  const completionPct = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) *
      100
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <Link
          href="/provider/profile/edit"
          className="rounded border border-cyan px-3 py-1.5 text-sm text-cyan transition hover:bg-cyan/10"
        >
          Edit Profile
        </Link>
      </div>

      {/* Status badge */}
      <div className="mb-6 rounded-lg border border-brand-border bg-brand-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{profile.displayName}</h2>
            <p className="text-sm text-brand-muted">
              {profile.headline || "No headline set"}
            </p>
          </div>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              profile.status === "APPROVED"
                ? "bg-emerald-900/40 text-emerald-300"
                : profile.status === "PENDING"
                  ? "bg-amber-900/40 text-amber-300"
                  : "bg-red-900/40 text-red-300"
            }`}
          >
            {profile.status}
          </span>
        </div>
        {profile.status === "PENDING" && (
          <p className="mt-2 text-xs text-amber-300">
            Your profile is pending admin approval. You&apos;ll appear publicly
            once approved.
          </p>
        )}
      </div>

      {/* Profile completion */}
      <div className="mb-6 rounded-lg border border-brand-border bg-brand-surface p-4">
        <h3 className="mb-2 text-sm font-medium">
          Profile Completion: {completionPct}%
        </h3>
        <div className="mb-3 h-2 rounded-full bg-brand-bg">
          <div
            className="h-2 rounded-full bg-cyan transition-all"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {completionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <span className={item.done ? "text-emerald-400" : "text-brand-muted"}>
                {item.done ? "\u2713" : "\u25CB"}
              </span>
              <span
                className={
                  item.done ? "text-brand-text" : "text-brand-muted"
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Portfolio</h2>
          <Link
            href="/provider/profile/edit#portfolio"
            className="text-sm text-cyan hover:text-cyan-hover"
          >
            Manage
          </Link>
        </div>
        {profile.portfolio?.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {profile.portfolio.map((img: any) => (
              <div
                key={img.id}
                className="aspect-square overflow-hidden rounded border border-brand-border"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || ""}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-muted">
            No portfolio images yet. Add some to showcase your work.
          </p>
        )}
      </div>

      {/* Jobs You Contacted */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Jobs You Contacted</h2>
        {responses.length === 0 ? (
          <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-center">
            <p className="text-sm text-brand-muted">
              You haven&apos;t responded to any jobs yet.
            </p>
            <Link
              href="/jobs"
              className="mt-2 inline-block text-sm text-cyan hover:text-cyan-hover"
            >
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {responses.map((r: any) => (
              <Link
                key={r.id}
                href={`/jobs/${r.job.id}`}
                className="block rounded-lg border border-brand-border bg-brand-surface p-4 transition hover:bg-brand-surface-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-text truncate">
                      {r.job.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-muted">
                      <span>{r.job.city}</span>
                      {(r.job.budgetMin || r.job.budgetMax) && (
                        <span>
                          ${r.job.budgetMin ?? "?"} – ${r.job.budgetMax ?? "?"}
                        </span>
                      )}
                      <span>
                        Posted{" "}
                        {new Date(r.job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {r.estimatedPrice && (
                      <p className="mt-1 text-xs text-brand-muted">
                        Your quote: ${r.estimatedPrice}
                        {r.turnaroundDays
                          ? ` · ${r.turnaroundDays} day${r.turnaroundDays !== 1 ? "s" : ""}`
                          : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        r.job.status === "OPEN"
                          ? "bg-emerald-900/40 text-emerald-300"
                          : r.job.status === "IN_PROGRESS"
                            ? "bg-blue-900/40 text-blue-300"
                            : r.job.status === "COMPLETED"
                              ? "bg-cyan-900/40 text-cyan"
                              : "bg-gray-800/40 text-gray-300"
                      }`}
                    >
                      {r.job.status.replace("_", " ")}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        r.status === "ACCEPTED"
                          ? "bg-emerald-900/40 text-emerald-300"
                          : r.status === "DECLINED"
                            ? "bg-red-900/40 text-red-300"
                            : "bg-brand-bg text-brand-muted"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
