"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { JOB_CATEGORIES, JOB_CATEGORY_LABELS } from "@/lib/constants";

export default function EditJobPage() {
  const { id } = useParams();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    preferredContactMethod: "EMAIL",
  });

  useEffect(() => {
    if (authStatus === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((job) => {
        if (!job.isOwner) {
          router.push(`/jobs/${id}`);
          return;
        }
        setForm({
          title: job.title || "",
          description: job.description || "",
          category: job.category || "",
          budgetMin: job.budgetMin?.toString() || "",
          budgetMax: job.budgetMax?.toString() || "",
          deadline: job.deadline ? job.deadline.slice(0, 10) : "",
          contactName: job.contactName || "",
          contactEmail: job.contactEmail || "",
          contactPhone: job.contactPhone || "",
          preferredContactMethod: job.preferredContactMethod || "EMAIL",
        });
        setLoading(false);
      });
  }, [session, authStatus, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category || null,
        budgetMin: form.budgetMin ? parseInt(form.budgetMin) : null,
        budgetMax: form.budgetMax ? parseInt(form.budgetMax) : null,
        deadline: form.deadline || null,
        contactName: form.contactName || null,
        contactEmail: form.contactEmail || null,
        contactPhone: form.contactPhone || null,
        preferredContactMethod: form.preferredContactMethod || null,
      }),
    });

    if (res.ok) {
      setSuccess("Job updated! Redirecting...");
      setTimeout(() => router.push(`/jobs/${id}`), 1200);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update job");
    }
    setSubmitting(false);
  };

  if (authStatus === "loading" || loading)
    return (
      <div className="py-20 text-center text-brand-muted">Loading...</div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Job</h1>

      {error && (
        <p className="mb-4 rounded border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-400">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job details */}
        <div className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4">
          <h2 className="font-semibold">Job Details</h2>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Title *
            </label>
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
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              rows={5}
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
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, budgetMin: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, budgetMax: e.target.value })
                }
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
              className="rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4">
          <h2 className="font-semibold">Contact Info</h2>
          <p className="text-xs text-brand-muted">
            How should providers reach you?
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-brand-muted">
                Name
              </label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) =>
                  setForm({ ...form, contactName: e.target.value })
                }
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-brand-muted">
                Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-brand-muted">
                Phone
              </label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-brand-muted">
                Preferred Contact
              </label>
              <select
                value={form.preferredContactMethod}
                onChange={(e) =>
                  setForm({
                    ...form,
                    preferredContactMethod: e.target.value,
                  })
                }
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
              >
                <option value="EMAIL">Email</option>
                <option value="PHONE">Phone</option>
                <option value="PLATFORM_RESPONSE">Platform Response</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-cyan py-2.5 text-sm font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
