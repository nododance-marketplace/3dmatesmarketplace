"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { parseJsonArray } from "@/lib/helpers";

export default function AdminPanelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.isAdmin) {
      router.push("/");
      return;
    }
    fetchPending();
  }, [session, status]);

  const fetchPending = async () => {
    const res = await fetch("/api/admin/providers");
    const data = await res.json();
    setProviders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleAction = async (providerId: string, newStatus: string) => {
    setActionLoading(providerId);
    const res = await fetch("/api/admin/providers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, status: newStatus }),
    });
    if (res.ok) {
      setProviders((prev) => prev.filter((p) => p.id !== providerId));
    }
    setActionLoading(null);
  };

  if (status === "loading" || loading)
    return (
      <div className="py-20 text-center text-brand-muted">Loading...</div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Panel</h1>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Pending Provider Approvals ({providers.length})
        </h2>

        {providers.length === 0 ? (
          <p className="text-sm text-brand-muted">
            No pending providers to review.
          </p>
        ) : (
          <div className="space-y-4">
            {providers.map((p) => {
              const processes = parseJsonArray(p.processes);
              const materials = parseJsonArray(p.materials);

              return (
                <div
                  key={p.id}
                  className="rounded-lg border border-brand-border bg-brand-surface p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-text">
                        {p.displayName}
                      </h3>
                      {p.headline && (
                        <p className="text-sm text-brand-muted">
                          {p.headline}
                        </p>
                      )}
                      <p className="text-xs text-brand-muted">
                        {p.user?.email} &middot; {p.city}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(p.id, "APPROVED")}
                        disabled={actionLoading === p.id}
                        className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(p.id, "REJECTED")}
                        disabled={actionLoading === p.id}
                        className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {p.bio && (
                    <p className="mt-2 text-sm text-brand-muted line-clamp-2">
                      {p.bio}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-1">
                    {processes.map((proc: string) => (
                      <span
                        key={proc}
                        className="rounded border border-brand-border bg-brand-bg px-2 py-0.5 text-[10px] text-brand-muted"
                      >
                        {proc}
                      </span>
                    ))}
                    {materials.map((mat: string) => (
                      <span
                        key={mat}
                        className="rounded border border-brand-border bg-brand-bg px-2 py-0.5 text-[10px] text-brand-muted"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>

                  {p.address && (
                    <p className="mt-1 text-xs text-brand-muted">
                      Address: {p.address}
                      {p.lat ? ` (${p.lat.toFixed(4)}, ${p.lng?.toFixed(4)})` : " (no coords)"}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-brand-muted">
                    Submitted:{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
