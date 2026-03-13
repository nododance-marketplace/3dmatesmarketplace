"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { JOB_CATEGORY_LABELS } from "@/lib/constants";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobsWithResponses, setJobsWithResponses] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const toggleJob = (id: string) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
      fetch("/api/jobs/my-jobs-with-responses").then((r) => r.json()),
      fetch("/api/saved/providers/me").then((r) => r.json()),
    ]).then(([jobsData, savedData]) => {
      setJobsWithResponses(Array.isArray(jobsData) ? jobsData : []);
      setSaved(Array.isArray(savedData) ? savedData : []);
      setLoading(false);
    });
  }, [session, status]);

  if (status === "loading" || loading)
    return (
      <div className="py-20 text-center text-brand-muted">Loading...</div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">My Account</h1>

      <div className="mb-4 rounded-lg border border-brand-border bg-brand-surface p-4">
        <div className="flex items-center gap-3">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt=""
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{session?.user?.name || "User"}</p>
            <p className="text-sm text-brand-muted">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* My Jobs & Responses */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Jobs</h2>
          <Link href="/jobs" className="text-sm text-cyan hover:text-cyan-hover">
            Post New Job
          </Link>
        </div>
        {jobsWithResponses.length === 0 ? (
          <p className="text-sm text-brand-muted">No jobs posted yet.</p>
        ) : (
          <div className="space-y-3">
            {jobsWithResponses.map((j: any) => (
              <div
                key={j.id}
                className="rounded-lg border border-brand-border bg-brand-surface overflow-hidden"
              >
                {/* Job header row */}
                <div className="flex items-center justify-between p-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/jobs/${j.id}`}
                      className="font-medium text-brand-text hover:text-cyan transition"
                    >
                      {j.title}
                    </Link>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-brand-muted">
                      <span>{j.city}</span>
                      <span>·</span>
                      <span>
                        Posted {new Date(j.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        j.status === "OPEN"
                          ? "bg-emerald-900/40 text-emerald-300"
                          : j.status === "IN_PROGRESS"
                            ? "bg-blue-900/40 text-blue-300"
                            : j.status === "COMPLETED"
                              ? "bg-cyan-900/40 text-cyan"
                              : "bg-gray-800/40 text-gray-300"
                      }`}
                    >
                      {j.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Responses toggle */}
                <button
                  onClick={() => toggleJob(j.id)}
                  className="w-full border-t border-brand-border px-3 py-2 flex items-center justify-between text-xs hover:bg-brand-surface-hover transition"
                >
                  <span className="text-brand-muted">
                    <span className="font-medium text-brand-text">
                      {j.responses.length}
                    </span>{" "}
                    provider response{j.responses.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-brand-muted">
                    {expandedJobs.has(j.id) ? "▲" : "▼"}
                  </span>
                </button>

                {/* Expanded responses */}
                {expandedJobs.has(j.id) && j.responses.length > 0 && (
                  <div className="border-t border-brand-border divide-y divide-brand-border">
                    {j.responses.map((r: any) => (
                      <div key={r.id} className="p-3 bg-brand-bg/30">
                        <div className="flex items-start gap-3">
                          {/* Provider avatar */}
                          {r.provider?.photoUrl ? (
                            <img
                              src={r.provider.photoUrl}
                              alt=""
                              className="h-9 w-9 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-brand-surface flex items-center justify-center shrink-0">
                              <span className="text-xs text-brand-muted">
                                {r.provider?.displayName?.[0] || "?"}
                              </span>
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className="text-sm font-medium text-brand-text">
                                  {r.provider?.displayName || "Provider"}
                                </span>
                                {r.provider?.headline && (
                                  <p className="text-xs text-brand-muted truncate">
                                    {r.provider.headline}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-medium shrink-0 ${
                                  r.status === "ACCEPTED"
                                    ? "bg-emerald-900/40 text-emerald-300"
                                    : r.status === "DECLINED"
                                      ? "bg-red-900/40 text-red-300"
                                      : "bg-brand-surface text-brand-muted"
                                }`}
                              >
                                {r.status}
                              </span>
                            </div>

                            {/* Quote details */}
                            {(r.estimatedPrice || r.turnaroundDays) && (
                              <div className="mt-1 flex items-center gap-3 text-xs">
                                {r.estimatedPrice && (
                                  <span className="text-cyan font-medium">
                                    ${r.estimatedPrice}
                                  </span>
                                )}
                                {r.turnaroundDays && (
                                  <span className="text-brand-muted">
                                    {r.turnaroundDays} day
                                    {r.turnaroundDays !== 1 ? "s" : ""}{" "}
                                    turnaround
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Message preview */}
                            {r.message && (
                              <p className="mt-1.5 text-xs text-brand-muted line-clamp-2">
                                {r.message}
                              </p>
                            )}

                            {/* Action buttons */}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {r.provider?.slug && (
                                <Link
                                  href={`/providers/${r.provider.slug}`}
                                  className="rounded border border-cyan/30 px-2.5 py-1 text-[11px] font-medium text-cyan transition hover:bg-cyan/10"
                                >
                                  View Profile
                                </Link>
                              )}
                              {r.provider?.contactEmail && (
                                <a
                                  href={`mailto:${r.provider.contactEmail}`}
                                  className="rounded border border-brand-border px-2.5 py-1 text-[11px] font-medium text-brand-muted transition hover:text-brand-text hover:border-brand-text/30"
                                >
                                  Email Provider
                                </a>
                              )}
                              {r.provider?.phone && (
                                <a
                                  href={`tel:${r.provider.phone}`}
                                  className="rounded border border-brand-border px-2.5 py-1 text-[11px] font-medium text-brand-muted transition hover:text-brand-text hover:border-brand-text/30"
                                >
                                  Call Provider
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedJobs.has(j.id) && j.responses.length === 0 && (
                  <div className="border-t border-brand-border p-4 text-center text-xs text-brand-muted">
                    No provider responses yet.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Providers */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Saved Providers</h2>
        {saved.length === 0 ? (
          <p className="text-sm text-brand-muted">No saved providers.</p>
        ) : (
          <div className="space-y-2">
            {saved.map((s: any) => (
              <Link
                key={s.id}
                href={`/providers/${s.provider.slug}`}
                className="block rounded-lg border border-brand-border bg-brand-surface p-3 transition hover:bg-brand-surface-hover"
              >
                <span className="font-medium text-brand-text">
                  {s.provider.displayName}
                </span>
                {s.provider.headline && (
                  <p className="text-xs text-brand-muted">
                    {s.provider.headline}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
