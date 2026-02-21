"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { JOB_CATEGORIES, JOB_CATEGORY_LABELS } from "@/lib/constants";

interface Job {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  city: string;
  status: string;
  responseCount: number;
  customerName: string;
  createdAt: string;
}

function fmtBudget(min?: number | null, max?: number | null) {
  if (min && max) return `$${min} - $${max}`;
  if (min) return `$${min}+`;
  if (max) return `Up to $${max}`;
  return "Flexible";
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);

  const fetchJobs = async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [search, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Job Board</h1>
        {session && (
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover"
          >
            {showPostForm ? "Cancel" : "Post a Job"}
          </button>
        )}
      </div>

      {/* Post form */}
      {showPostForm && session && (
        <PostJobForm
          onPosted={() => {
            setShowPostForm(false);
            fetchJobs();
          }}
        />
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-cyan focus:outline-none sm:max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {JOB_CATEGORY_LABELS[c] || c}
            </option>
          ))}
        </select>
      </div>

      {/* Jobs list */}
      {loading ? (
        <div className="py-20 text-center text-brand-muted">Loading...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((j) => (
            <Link
              key={j.id}
              href={`/jobs/${j.id}`}
              className="group rounded-lg border border-brand-border bg-brand-surface p-4 transition hover:border-brand-border-light hover:bg-brand-surface-hover"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-brand-text">{j.title}</h3>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                    j.status === "OPEN"
                      ? "bg-emerald-900/40 text-emerald-300"
                      : "bg-gray-800/40 text-gray-300"
                  }`}
                >
                  {j.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-brand-muted line-clamp-2">
                {j.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-brand-muted">
                <span>{j.city}</span>
                <span>&#183;</span>
                <span>{fmtBudget(j.budgetMin, j.budgetMax)}</span>
                <span>&#183;</span>
                <span>{timeAgo(j.createdAt)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-brand-muted">
                  {j.responseCount} response
                  {j.responseCount !== 1 ? "s" : ""}
                </span>
                {j.category && (
                  <span className="rounded bg-brand-bg px-2 py-0.5 text-brand-muted">
                    {JOB_CATEGORY_LABELS[j.category] || j.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
          {jobs.length === 0 && (
            <div className="col-span-full py-20 text-center text-brand-muted">
              No open jobs found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PostJobForm({ onPosted }: { onPosted: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category || undefined,
        budgetMin: form.budgetMin ? parseInt(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? parseInt(form.budgetMax) : undefined,
        deadline: form.deadline || undefined,
      }),
    });

    if (res.ok) {
      onPosted();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to post job");
    }
    setSubmitting(false);
  };

  return (
    <div className="mb-8 rounded-lg border border-brand-border bg-brand-surface p-6">
      <h2 className="mb-4 text-lg font-semibold">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-brand-muted">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-brand-muted">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            >
              <option value="">Select...</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {JOB_CATEGORY_LABELS[c] || c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Budget Min ($)
            </label>
            <input
              type="number"
              value={form.budgetMin}
              onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Budget Max ($)
            </label>
            <input
              type="number"
              value={form.budgetMax}
              onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-brand-muted">
            Deadline (optional)
          </label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
