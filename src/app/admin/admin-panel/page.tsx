"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { parseJsonArray } from "@/lib/helpers";

type Tab = "providers" | "jobs" | "reviews" | "seed";

export default function AdminPanelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("providers");
  const [providers, setProviders] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [seedProviders, setSeedProviders] = useState<any[]>([]);
  const [seedJobs, setSeedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.isAdmin) {
      router.push("/");
      return;
    }
    Promise.all([fetchProviders(), fetchJobs(), fetchReviews(), fetchSeed()]).then(() =>
      setLoading(false)
    );
  }, [session, status]);

  const fetchProviders = async () => {
    const res = await fetch("/api/admin/providers");
    const data = await res.json();
    setProviders(Array.isArray(data) ? data : []);
  };

  const fetchJobs = async () => {
    const res = await fetch("/api/admin/jobs");
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
  };

  const fetchReviews = async () => {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
  };

  const fetchSeed = async () => {
    const res = await fetch("/api/admin/seed");
    const data = await res.json();
    setSeedProviders(Array.isArray(data.providers) ? data.providers : []);
    setSeedJobs(Array.isArray(data.jobs) ? data.jobs : []);
  };

  const handleProviderAction = async (providerId: string, newStatus: string) => {
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

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Delete this job and all its responses?")) return;
    setActionLoading(jobId);
    const res = await fetch("/api/admin/jobs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
    setActionLoading(null);
  };

  const handleToggleReview = async (reviewId: string, hidden: boolean) => {
    setActionLoading(reviewId);
    const res = await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, hidden }),
    });
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, hidden } : r))
      );
    }
    setActionLoading(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Permanently delete this review?")) return;
    setActionLoading(reviewId);
    const res = await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId }),
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
    setActionLoading(null);
  };

  // ── Seed content handlers ────────────────────────────────────

  const handleSeedEdit = (type: "provider" | "job", item: any) => {
    setEditingId(item.id);
    if (type === "provider") {
      setEditForm({
        type: "provider",
        displayName: item.displayName,
        headline: item.headline || "",
        bio: item.bio || "",
        status: item.status,
      });
    } else {
      setEditForm({
        type: "job",
        title: item.title,
        description: item.description,
        category: item.category || "",
        budgetMin: item.budgetMin ?? "",
        budgetMax: item.budgetMax ?? "",
        status: item.status,
      });
    }
  };

  const handleSeedSave = async () => {
    if (!editingId) return;
    setActionLoading(editingId);

    const { type, ...fields } = editForm;
    const data: Record<string, any> = {};

    if (type === "provider") {
      if (fields.displayName) data.displayName = fields.displayName;
      if (fields.headline !== undefined) data.headline = fields.headline;
      if (fields.bio !== undefined) data.bio = fields.bio;
      if (fields.status) data.status = fields.status;
    } else {
      if (fields.title) data.title = fields.title;
      if (fields.description !== undefined) data.description = fields.description;
      if (fields.category !== undefined) data.category = fields.category || null;
      data.budgetMin = fields.budgetMin === "" ? null : Number(fields.budgetMin);
      data.budgetMax = fields.budgetMax === "" ? null : Number(fields.budgetMax);
      if (fields.status) data.status = fields.status;
    }

    const res = await fetch("/api/admin/seed", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id: editingId, data }),
    });

    if (res.ok) {
      await fetchSeed();
      setEditingId(null);
      setEditForm({});
    }
    setActionLoading(null);
  };

  const handleSeedDelete = async (type: "provider" | "job", id: string) => {
    const label = type === "provider" ? "seed provider (and its user account)" : "seed job";
    if (!confirm(`Delete this ${label}?`)) return;
    setActionLoading(id);

    const res = await fetch("/api/admin/seed", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });

    if (res.ok) {
      if (type === "provider") {
        setSeedProviders((prev) => prev.filter((p) => p.id !== id));
      } else {
        setSeedJobs((prev) => prev.filter((j) => j.id !== id));
      }
    }
    setActionLoading(null);
  };

  const handlePurgeAll = async () => {
    if (
      !confirm(
        "This will delete ALL seed providers, jobs, and demo users. This cannot be undone. Continue?"
      )
    )
      return;

    setActionLoading("purge");
    const res = await fetch("/api/admin/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "purge" }),
    });

    if (res.ok) {
      setSeedProviders([]);
      setSeedJobs([]);
    }
    setActionLoading(null);
  };

  const handleSeedToggleStatus = async (
    type: "provider" | "job",
    id: string,
    currentStatus: string
  ) => {
    setActionLoading(id);

    let newStatus: string;
    if (type === "provider") {
      newStatus = currentStatus === "APPROVED" ? "PENDING" : "APPROVED";
    } else {
      newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    }

    const res = await fetch("/api/admin/seed", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, data: { status: newStatus } }),
    });

    if (res.ok) {
      if (type === "provider") {
        setSeedProviders((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      } else {
        setSeedJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
        );
      }
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

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-brand-border bg-brand-bg p-1">
        {(["providers", "jobs", "reviews", "seed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
              activeTab === tab
                ? "bg-cyan text-black"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            {tab === "providers"
              ? `Providers (${providers.length})`
              : tab === "jobs"
                ? `Jobs (${jobs.length})`
                : tab === "reviews"
                  ? `Reviews (${reviews.length})`
                  : `Seed (${seedProviders.length + seedJobs.length})`}
          </button>
        ))}
      </div>

      {/* Providers Tab */}
      {activeTab === "providers" && (
        <section>
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
                          onClick={() => handleProviderAction(p.id, "APPROVED")}
                          disabled={actionLoading === p.id}
                          className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProviderAction(p.id, "REJECTED")}
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
                        {p.lat
                          ? ` (${p.lat.toFixed(4)}, ${p.lng?.toFixed(4)})`
                          : " (no coords)"}
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
      )}

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <section>
          {jobs.length === 0 ? (
            <p className="text-sm text-brand-muted">No jobs found.</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((j) => (
                <div
                  key={j.id}
                  className="rounded-lg border border-brand-border bg-brand-surface p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold text-brand-text">
                          {j.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${
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
                      <p className="mt-1 text-xs text-brand-muted">
                        {j.customer?.name || "Anonymous"} ({j.customer?.email})
                        &middot; {j._count?.responses || 0} responses &middot;{" "}
                        {j._count?.images || 0} images
                      </p>
                      <p className="mt-1 text-sm text-brand-muted line-clamp-1">
                        {j.description}
                      </p>
                      <p className="mt-1 text-xs text-brand-muted">
                        Created: {new Date(j.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(j.id)}
                      disabled={actionLoading === j.id}
                      className="ml-3 flex-shrink-0 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <section>
          {reviews.length === 0 ? (
            <p className="text-sm text-brand-muted">No reviews found.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className={`rounded-lg border bg-brand-surface p-4 ${
                    r.hidden
                      ? "border-amber-700/40"
                      : "border-brand-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-cyan">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </span>
                        {r.hidden && (
                          <span className="rounded bg-amber-900/40 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                            Hidden
                          </span>
                        )}
                      </div>
                      {r.text && (
                        <p className="mt-1 text-sm text-brand-text line-clamp-2">
                          {r.text}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-brand-muted">
                        By {r.reviewer?.name || "Anonymous"} ({r.reviewer?.email})
                        &middot; Job: {r.job?.title || "Unknown"}
                        {r.provider?.displayName && (
                          <> &middot; Provider: {r.provider.displayName}</>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-brand-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-3 flex flex-shrink-0 gap-2">
                      <button
                        onClick={() => handleToggleReview(r.id, !r.hidden)}
                        disabled={actionLoading === r.id}
                        className={`rounded px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                          r.hidden
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-amber-600 text-white hover:bg-amber-700"
                        }`}
                      >
                        {r.hidden ? "Unhide" : "Hide"}
                      </button>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        disabled={actionLoading === r.id}
                        className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Seed Content Tab */}
      {activeTab === "seed" && (
        <section>
          {/* Header with purge button */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-brand-muted">
              Manage demo/seed content flagged with{" "}
              <code className="rounded bg-brand-bg px-1.5 py-0.5 text-xs text-cyan">
                isSeed
              </code>
            </p>
            {(seedProviders.length > 0 || seedJobs.length > 0) && (
              <button
                onClick={handlePurgeAll}
                disabled={actionLoading === "purge"}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === "purge" ? "Purging..." : "Purge All Seed Data"}
              </button>
            )}
          </div>

          {seedProviders.length === 0 && seedJobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-brand-border p-8 text-center">
              <p className="text-sm text-brand-muted">
                No seed content found. Run{" "}
                <code className="rounded bg-brand-bg px-1.5 py-0.5 text-xs text-cyan">
                  npm run seed
                </code>{" "}
                to populate demo data.
              </p>
            </div>
          ) : (
            <>
              {/* Seed Providers */}
              {seedProviders.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-brand-text">
                    Seed Providers ({seedProviders.length})
                  </h3>
                  <div className="space-y-3">
                    {seedProviders.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-lg border border-cyan/10 bg-brand-surface p-4"
                      >
                        {editingId === p.id && editForm.type === "provider" ? (
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs text-brand-muted">
                                Display Name
                              </label>
                              <input
                                type="text"
                                value={editForm.displayName}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, displayName: e.target.value })
                                }
                                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-1.5 text-sm text-brand-text"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-brand-muted">
                                Headline
                              </label>
                              <input
                                type="text"
                                value={editForm.headline}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, headline: e.target.value })
                                }
                                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-1.5 text-sm text-brand-text"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-brand-muted">
                                Bio
                              </label>
                              <textarea
                                value={editForm.bio}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, bio: e.target.value })
                                }
                                rows={3}
                                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-1.5 text-sm text-brand-text"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleSeedSave}
                                disabled={actionLoading === p.id}
                                className="rounded bg-cyan px-3 py-1 text-xs font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditForm({});
                                }}
                                className="rounded border border-brand-border px-3 py-1 text-xs font-medium text-brand-muted transition hover:text-brand-text"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-brand-text">
                                  {p.displayName}
                                </h4>
                                <span
                                  className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                                    p.status === "APPROVED"
                                      ? "bg-emerald-900/40 text-emerald-300"
                                      : p.status === "PENDING"
                                        ? "bg-amber-900/40 text-amber-300"
                                        : "bg-red-900/40 text-red-300"
                                  }`}
                                >
                                  {p.status}
                                </span>
                                <span className="rounded bg-cyan/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan">
                                  SEED
                                </span>
                              </div>
                              {p.headline && (
                                <p className="mt-1 text-sm text-brand-muted line-clamp-1">
                                  {p.headline}
                                </p>
                              )}
                              <p className="mt-1 text-xs text-brand-muted">
                                {p.user?.email} &middot; {p.city}
                              </p>
                            </div>
                            <div className="ml-3 flex flex-shrink-0 gap-2">
                              <button
                                onClick={() =>
                                  handleSeedToggleStatus("provider", p.id, p.status)
                                }
                                disabled={actionLoading === p.id}
                                className={`rounded px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                                  p.status === "APPROVED"
                                    ? "bg-amber-600 text-white hover:bg-amber-700"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                                }`}
                              >
                                {p.status === "APPROVED" ? "Unpublish" : "Publish"}
                              </button>
                              <button
                                onClick={() => handleSeedEdit("provider", p)}
                                disabled={actionLoading === p.id}
                                className="rounded border border-brand-border px-3 py-1 text-xs font-medium text-brand-muted transition hover:text-brand-text disabled:opacity-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleSeedDelete("provider", p.id)}
                                disabled={actionLoading === p.id}
                                className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seed Jobs */}
              {seedJobs.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-brand-text">
                    Seed Jobs ({seedJobs.length})
                  </h3>
                  <div className="space-y-3">
                    {seedJobs.map((j) => (
                      <div
                        key={j.id}
                        className="rounded-lg border border-cyan/10 bg-brand-surface p-4"
                      >
                        {editingId === j.id && editForm.type === "job" ? (
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs text-brand-muted">
                                Title
                              </label>
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, title: e.target.value })
                                }
                                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-1.5 text-sm text-brand-text"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-brand-muted">
                                Description
                              </label>
                              <textarea
                                value={editForm.description}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, description: e.target.value })
                                }
                                rows={3}
                                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-1.5 text-sm text-brand-text"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="mb-1 block text-xs text-brand-muted">
                                  Budget Min ($)
                                </label>
                                <input
                                  type="number"
                                  value={editForm.budgetMin}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, budgetMin: e.target.value })
                                  }
                                  className="w-full rounded border border-brand-border bg-brand-bg px-3 py-1.5 text-sm text-brand-text"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs text-brand-muted">
                                  Budget Max ($)
                                </label>
                                <input
                                  type="number"
                                  value={editForm.budgetMax}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, budgetMax: e.target.value })
                                  }
                                  className="w-full rounded border border-brand-border bg-brand-bg px-3 py-1.5 text-sm text-brand-text"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleSeedSave}
                                disabled={actionLoading === j.id}
                                className="rounded bg-cyan px-3 py-1 text-xs font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditForm({});
                                }}
                                className="rounded border border-brand-border px-3 py-1 text-xs font-medium text-brand-muted transition hover:text-brand-text"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="truncate font-semibold text-brand-text">
                                  {j.title}
                                </h4>
                                <span
                                  className={`flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${
                                    j.status === "OPEN"
                                      ? "bg-emerald-900/40 text-emerald-300"
                                      : "bg-gray-800/40 text-gray-300"
                                  }`}
                                >
                                  {j.status}
                                </span>
                                <span className="rounded bg-cyan/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan">
                                  SEED
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-brand-muted line-clamp-1">
                                {j.description}
                              </p>
                              <p className="mt-1 text-xs text-brand-muted">
                                Budget: {j.budgetMin && j.budgetMax
                                  ? `$${j.budgetMin} - $${j.budgetMax}`
                                  : j.budgetMin
                                    ? `$${j.budgetMin}+`
                                    : j.budgetMax
                                      ? `Up to $${j.budgetMax}`
                                      : "Flexible"}
                                {" "}&middot;{" "}
                                {new Date(j.createdAt).toLocaleDateString()}
                                {" "}&middot;{" "}
                                {j._count?.responses || 0} responses
                              </p>
                            </div>
                            <div className="ml-3 flex flex-shrink-0 gap-2">
                              <button
                                onClick={() =>
                                  handleSeedToggleStatus("job", j.id, j.status)
                                }
                                disabled={actionLoading === j.id}
                                className={`rounded px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                                  j.status === "OPEN"
                                    ? "bg-amber-600 text-white hover:bg-amber-700"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                                }`}
                              >
                                {j.status === "OPEN" ? "Close" : "Reopen"}
                              </button>
                              <button
                                onClick={() => handleSeedEdit("job", j)}
                                disabled={actionLoading === j.id}
                                className="rounded border border-brand-border px-3 py-1 text-xs font-medium text-brand-muted transition hover:text-brand-text disabled:opacity-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleSeedDelete("job", j.id)}
                                disabled={actionLoading === j.id}
                                className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
