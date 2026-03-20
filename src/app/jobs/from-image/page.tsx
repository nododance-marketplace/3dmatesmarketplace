"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JOB_CATEGORIES, JOB_CATEGORY_LABELS, MATERIALS } from "@/lib/constants";

const INTENDED_USES = [
  { value: "REPLACEMENT_PART", label: "Replacement part" },
  { value: "PROTOTYPE", label: "Prototype / proof of concept" },
  { value: "ART_PIECE", label: "Art piece / sculpture" },
  { value: "ACCESSORY", label: "Accessory / mount / holder" },
  { value: "COSPLAY", label: "Cosplay / prop" },
  { value: "HOME_DECOR", label: "Home decor" },
  { value: "GIFT", label: "Custom gift" },
  { value: "MECHANICAL", label: "Mechanical / functional part" },
  { value: "OTHER", label: "Other" },
];

export default function FromImagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    intendedUse: "",
    dimensions: "",
    quantity: "1",
    materials: [] as string[],
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    preferredContactMethod: "EMAIL",
    hasFile: false,
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        contactName: f.contactName || session.user.name || "",
        contactEmail: f.contactEmail || session.user.email || "",
      }));
    }
  }, [session]);

  if (status === "loading") {
    return <div className="py-20 text-center text-brand-muted">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/10 ring-1 ring-cyan/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Turn Your Image Into a 3D Print</h1>
        <p className="mt-3 text-sm text-brand-muted">
          Sign in to upload reference images and connect with local providers who can bring your idea to life.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-6 rounded-xl bg-cyan px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-hover"
        >
          Sign In to Get Started
        </button>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || imageUrls.length >= 5) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload/job-image", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setImageUrls((prev) => [...prev, data.imageUrl]);
    }
    setUploadingImage(false);
    e.target.value = "";
  };

  const toggleMaterial = (m: string) => {
    setForm((f) => ({
      ...f,
      materials: f.materials.includes(m)
        ? f.materials.filter((x) => x !== m)
        : [...f.materials, m],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0 && !form.hasFile) {
      setError("Please upload at least one reference image.");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category || undefined,
        materials: form.materials,
        budgetMin: form.budgetMin ? parseInt(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? parseInt(form.budgetMax) : undefined,
        deadline: form.deadline || undefined,
        imageUrls,
        contactName: form.contactName || undefined,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        preferredContactMethod: form.preferredContactMethod || undefined,
        needsModeling: !form.hasFile,
        intendedUse: form.intendedUse || undefined,
        dimensions: form.dimensions || undefined,
        quantity: form.quantity ? parseInt(form.quantity) : 1,
      }),
    });

    if (res.ok) {
      const job = await res.json();
      router.push(`/jobs/${job.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to post job");
    }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 ring-1 ring-cyan/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Turn Your Image Into a{" "}
          <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
            3D Print
          </span>
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          No 3D file? No problem. Upload photos of what you want made and local
          fabricators will help bring it to life.
        </p>
      </div>

      {/* Progress steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => {
              if (s === 1 || (s === 2 && imageUrls.length > 0) || (s === 3 && form.title)) {
                setStep(s);
              }
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
              step === s
                ? "bg-cyan text-black"
                : step > s
                  ? "bg-cyan/20 text-cyan"
                  : "bg-brand-surface text-brand-muted"
            }`}
          >
            {step > s ? "✓" : s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Step 1: Upload Images ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
              <h2 className="text-lg font-semibold">Upload Reference Images</h2>
              <p className="mt-1 text-sm text-brand-muted">
                Photos, screenshots, sketches, or inspiration images — anything
                that shows what you want made. Upload up to 5 images.
              </p>

              {/* Image grid */}
              {imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {imageUrls.map((url, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-brand-border"
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImageUrls((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition group-hover:opacity-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {imageUrls.length < 5 && (
                <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-brand-border-light bg-brand-bg px-6 py-8 text-center transition hover:border-cyan hover:bg-cyan/5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm font-medium text-brand-text">
                    {uploadingImage ? "Uploading..." : "Click to upload an image"}
                  </span>
                  <span className="text-xs text-brand-muted">
                    JPG, PNG, WebP — photos, sketches, screenshots
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Already have a file? */}
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasFile}
                  onChange={(e) =>
                    setForm({ ...form, hasFile: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-brand-border accent-cyan"
                />
                <div>
                  <span className="text-sm font-medium text-brand-text">
                    I already have a 3D file (STL, OBJ, etc.)
                  </span>
                  <p className="mt-0.5 text-xs text-brand-muted">
                    Check this if you have a print-ready model. You can still
                    upload reference images for context.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                if (imageUrls.length === 0 && !form.hasFile) {
                  setError("Please upload at least one image or check that you have a 3D file.");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="w-full rounded-xl bg-cyan px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-hover"
            >
              Continue
            </button>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </div>
        )}

        {/* ── Step 2: Describe the Object ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 space-y-4">
              <h2 className="text-lg font-semibold">Describe What You Need</h2>

              <div>
                <label className="mb-1 block text-sm text-brand-muted">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder='e.g. "Custom phone stand" or "Replacement bracket"'
                  required
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 focus:border-cyan focus:outline-none"
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
                  placeholder="Describe what the object is, what it's for, and any specific requirements (color, finish, tolerances, etc.)"
                  required
                  rows={4}
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-brand-muted">
                    What is this for?
                  </label>
                  <select
                    value={form.intendedUse}
                    onChange={(e) =>
                      setForm({ ...form, intendedUse: e.target.value })
                    }
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                  >
                    <option value="">Select...</option>
                    {INTENDED_USES.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-brand-muted">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                  >
                    <option value="">Select...</option>
                    {JOB_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {JOB_CATEGORY_LABELS[c] || c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-brand-muted">
                    Approximate Size / Dimensions
                  </label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) =>
                      setForm({ ...form, dimensions: e.target.value })
                    }
                    placeholder='e.g. "6 inches tall" or "fits a 2in pipe"'
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 focus:border-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-brand-muted">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                  />
                </div>
              </div>

              {/* Material preference */}
              <div>
                <label className="mb-2 block text-sm text-brand-muted">
                  Material Preference (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMaterial(m)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        form.materials.includes(m)
                          ? "border-cyan bg-cyan/10 text-cyan"
                          : "border-brand-border bg-brand-bg text-brand-muted hover:border-brand-border-light"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-brand-muted">
                  Not sure? That&apos;s okay — providers can suggest the best material.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-brand-border px-6 py-3 text-sm font-medium text-brand-muted transition hover:border-brand-border-light hover:text-brand-text"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!form.title || !form.description) {
                    setError("Title and description are required.");
                    return;
                  }
                  if (form.description.length < 10) {
                    setError("Please write a more detailed description (at least 10 characters).");
                    return;
                  }
                  setError("");
                  setStep(3);
                }}
                className="flex-1 rounded-xl bg-cyan px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-hover"
              >
                Continue
              </button>
            </div>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </div>
        )}

        {/* ── Step 3: Budget & Contact ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 space-y-4">
              <h2 className="text-lg font-semibold">Budget & Contact</h2>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    placeholder="Optional"
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 focus:border-cyan focus:outline-none"
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
                    placeholder="Optional"
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 focus:border-cyan focus:outline-none"
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
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className="rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-brand-text">
                Your Contact Info
              </h3>
              <p className="text-xs text-brand-muted">
                How should providers reach you? Visible only to logged-in
                providers.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-brand-muted">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) =>
                      setForm({ ...form, contactName: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-brand-muted">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm({ ...form, contactEmail: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-brand-muted">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm({ ...form, contactPhone: e.target.value })
                    }
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-brand-muted">
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
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-brand-text focus:border-cyan focus:outline-none"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                    <option value="PLATFORM_RESPONSE">Platform Response</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Summary */}
            {!form.hasFile && (
              <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan/20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cyan">
                      This request will be labeled &ldquo;Needs Modeling&rdquo;
                    </p>
                    <p className="mt-0.5 text-xs text-brand-muted">
                      Providers will know you need help creating a 3D model from
                      your reference images before printing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-center text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-brand-border px-6 py-3 text-sm font-medium text-brand-muted transition hover:border-brand-border-light hover:text-brand-text"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-cyan px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-hover disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Bottom helper */}
      <div className="mt-8 text-center">
        <p className="text-xs text-brand-muted">
          Already have a 3D file ready?{" "}
          <Link href="/jobs" className="text-cyan hover:underline">
            Post a standard job instead
          </Link>
        </p>
      </div>
    </div>
  );
}
