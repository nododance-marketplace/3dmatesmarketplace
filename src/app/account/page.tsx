"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { JOB_CATEGORY_LABELS } from "@/lib/constants";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
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
      fetch("/api/jobs?status=ALL").then((r) => r.json()),
      fetch("/api/saved/providers/me").then((r) => r.json()),
    ]).then(([jobsData, savedData]) => {
      // Filter jobs to only show user's jobs
      const myJobs = Array.isArray(jobsData)
        ? jobsData.filter((j: any) => j.customerName === session.user.name)
        : [];
      setJobs(myJobs);
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

      {/* My Jobs */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Jobs</h2>
          <Link href="/jobs" className="text-sm text-cyan hover:text-cyan-hover">
            Post New Job
          </Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-sm text-brand-muted">No jobs posted yet.</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((j: any) => (
              <Link
                key={j.id}
                href={`/jobs/${j.id}`}
                className="block rounded-lg border border-brand-border bg-brand-surface p-3 transition hover:bg-brand-surface-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-text">{j.title}</span>
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
                    {j.status}
                  </span>
                </div>
                <span className="text-xs text-brand-muted">
                  {j.responseCount} responses
                </span>
              </Link>
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
