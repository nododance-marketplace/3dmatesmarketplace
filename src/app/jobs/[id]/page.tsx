"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { parseJsonArray, formatBudget, timeAgo } from "@/lib/helpers";
import { JOB_CATEGORY_LABELS } from "@/lib/constants";
import StarRating from "@/components/ui/StarRating";

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchJob = async () => {
    const res = await fetch(`/api/jobs/${id}`);
    if (res.ok) {
      setJob(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading)
    return (
      <div className="py-20 text-center text-brand-muted">Loading...</div>
    );
  if (!job)
    return (
      <div className="py-20 text-center text-brand-muted">Job not found.</div>
    );

  const materials = typeof job.materials === "string" ? parseJsonArray(job.materials) : (job.materials || []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              job.status === "OPEN"
                ? "bg-emerald-900/40 text-emerald-300"
                : job.status === "IN_PROGRESS"
                  ? "bg-blue-900/40 text-blue-300"
                  : job.status === "COMPLETED"
                    ? "bg-cyan-900/40 text-cyan"
                    : "bg-gray-800/40 text-gray-300"
            }`}
          >
            {job.status}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-brand-muted">
          <span>Posted by {job.customer?.name || "Anonymous"}</span>
          <span>&#183;</span>
          <span>{job.city}</span>
          <span>&#183;</span>
          <span>{timeAgo(job.createdAt)}</span>
        </div>
      </div>

      {/* Details */}
      <div className="mb-6 rounded-lg border border-brand-border bg-brand-surface p-4">
        <p className="whitespace-pre-wrap text-sm text-brand-text">
          {job.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-muted">
          {job.category && (
            <span>
              Category:{" "}
              {JOB_CATEGORY_LABELS[job.category] || job.category}
            </span>
          )}
          <span>Budget: {formatBudget(job.budgetMin, job.budgetMax)}</span>
          {job.deadline && (
            <span>
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
        {materials.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {materials.map((m: string) => (
              <span
                key={m}
                className="rounded border border-brand-border bg-brand-bg px-2 py-0.5 text-xs text-brand-muted"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reference Images */}
      {job.images && job.images.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-brand-muted">Reference Images</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {job.images.map((img: any) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded border border-brand-border">
                <img src={img.imageUrl} alt={img.caption || ""} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owner actions */}
      {job.isOwner && job.status === "IN_PROGRESS" && (
        <div className="mb-6">
          <button
            onClick={async () => {
              const res = await fetch(`/api/jobs/${id}/complete`, {
                method: "POST",
              });
              if (res.ok) fetchJob();
            }}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Mark as Completed
          </button>
        </div>
      )}

      {/* Responses */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">
          Responses ({job.responses?.length || 0})
        </h2>

        {job.isOwner && job.responses?.length > 0 ? (
          <div className="space-y-3">
            {job.responses.map((r: any) => (
              <div
                key={r.id}
                className="rounded-lg border border-brand-border bg-brand-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-brand-text">
                      {r.providerUser?.providerProfile?.displayName ||
                        r.providerUser?.name ||
                        "Provider"}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        r.status === "ACCEPTED"
                          ? "bg-emerald-900/40 text-emerald-300"
                          : r.status === "DECLINED"
                            ? "bg-red-900/40 text-red-300"
                            : "bg-gray-800/40 text-gray-300"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  {job.status === "OPEN" && r.status === "SENT" && (
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/jobs/${id}/accept`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ responseId: r.id }),
                        });
                        if (res.ok) fetchJob();
                      }}
                      className="rounded bg-cyan px-3 py-1 text-xs font-medium text-black transition hover:bg-cyan-hover"
                    >
                      Accept
                    </button>
                  )}
                </div>
                {r.message && (
                  <p className="mt-2 text-sm text-brand-muted">{r.message}</p>
                )}
                <div className="mt-2 flex gap-4 text-xs text-brand-muted">
                  {r.estimatedPrice && <span>${r.estimatedPrice}</span>}
                  {r.turnaroundDays && <span>{r.turnaroundDays} days</span>}
                </div>
                {r.providerUser?.providerProfile?.slug && (
                  <Link
                    href={`/providers/${r.providerUser.providerProfile.slug}`}
                    className="mt-2 inline-block text-xs text-cyan hover:underline"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-muted">
            {job.responses?.length > 0
              ? `${job.responses.length} provider(s) have responded.`
              : "No responses yet."}
          </p>
        )}
      </div>

      {/* Provider respond CTA */}
      {job.canRespond && job.status === "OPEN" && (
        <div className="mb-6">
          {showResponseForm ? (
            <ResponseForm
              jobId={job.id}
              onDone={() => {
                setShowResponseForm(false);
                fetchJob();
              }}
            />
          ) : (
            <button
              onClick={() => setShowResponseForm(true)}
              className="rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover"
            >
              Respond to this Job
            </button>
          )}
        </div>
      )}

      {/* Visitor gate */}
      {!session && job.status === "OPEN" && (
        <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-center">
          <p className="text-sm text-brand-muted">
            Sign in to respond to this job.
          </p>
          <button
            onClick={() => signIn()}
            className="mt-3 rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Review section - show after completion */}
      {job.status === "COMPLETED" && session && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Review</h2>
          {showReviewForm ? (
            <ReviewForm
              jobId={job.id}
              isOwner={job.isOwner}
              acceptedProviderUserId={
                job.responses?.find((r: any) => r.status === "ACCEPTED")
                  ?.providerUser?.id
              }
              customerId={job.customer?.id}
              onDone={() => {
                setShowReviewForm(false);
                fetchJob();
              }}
            />
          ) : (
            <button
              onClick={() => setShowReviewForm(true)}
              className="rounded border border-cyan px-4 py-2 text-sm text-cyan transition hover:bg-cyan/10"
            >
              Leave a Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ResponseForm({
  jobId,
  onDone,
}: {
  jobId: string;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    message: "",
    estimatedPrice: "",
    turnaroundDays: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/jobs/${jobId}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: form.message,
        estimatedPrice: form.estimatedPrice
          ? parseInt(form.estimatedPrice)
          : undefined,
        turnaroundDays: form.turnaroundDays
          ? parseInt(form.turnaroundDays)
          : undefined,
      }),
    });

    if (res.ok) {
      onDone();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to submit response");
    }
    setSubmitting(false);
  };

  return (
    <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-brand-muted">
            Your message
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={3}
            className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Estimated Price ($)
            </label>
            <input
              type="number"
              value={form.estimatedPrice}
              onChange={(e) =>
                setForm({ ...form, estimatedPrice: e.target.value })
              }
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Turnaround (days)
            </label>
            <input
              type="number"
              value={form.turnaroundDays}
              onChange={(e) =>
                setForm({ ...form, turnaroundDays: e.target.value })
              }
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Response"}
        </button>
      </form>
    </div>
  );
}

function ReviewForm({
  jobId,
  isOwner,
  acceptedProviderUserId,
  customerId,
  onDone,
}: {
  jobId: string;
  isOwner: boolean;
  acceptedProviderUserId?: string;
  customerId?: string;
  onDone: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const revieweeId = isOwner ? acceptedProviderUserId : customerId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revieweeId) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, revieweeId, rating, text: text || undefined }),
    });

    if (res.ok) {
      onDone();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to submit review");
    }
    setSubmitting(false);
  };

  return (
    <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-brand-muted">Rating</label>
          <StarRating rating={rating} interactive onChange={setRating} size="md" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-brand-muted">
            Comment (optional)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
