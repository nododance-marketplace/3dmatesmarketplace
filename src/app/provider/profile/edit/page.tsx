"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MATERIALS,
  PROCESSES,
  CAPABILITIES,
  CAPABILITY_LABELS,
} from "@/lib/constants";

export default function EditProviderProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    headline: "",
    bio: "",
    city: "Charlotte",
    address: "",
    serviceRadiusMiles: 15,
    materials: [] as string[],
    processes: [] as string[],
    capabilities: [] as string[],
    websiteUrl: "",
    instagramUrl: "",
    contactEmail: "",
    phone: "",
  });

  const [portfolio, setPortfolio] = useState<any[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetch("/api/provider-profile/me")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          const parse = (s: string) => {
            try {
              return JSON.parse(s);
            } catch {
              return [];
            }
          };
          setForm({
            displayName: data.displayName || "",
            headline: data.headline || "",
            bio: data.bio || "",
            city: data.city || "Charlotte",
            address: data.address || "",
            serviceRadiusMiles: data.serviceRadiusMiles || 15,
            materials: parse(data.materials),
            processes: parse(data.processes),
            capabilities: parse(data.capabilities),
            websiteUrl: data.websiteUrl || "",
            instagramUrl: data.instagramUrl || "",
            contactEmail: data.contactEmail || "",
            phone: data.phone || "",
          });
          setPortfolio(data.portfolio || []);
          setPhotoUrl(data.photoUrl || null);
        } else {
          // Pre-fill contact email from session
          setForm((f) => ({
            ...f,
            contactEmail: session.user.email || "",
            displayName: session.user.name || "",
          }));
        }
        setLoading(false);
      });
  }, [session, status]);

  const toggle = (field: "materials" | "processes" | "capabilities", val: string) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter((v) => v !== val)
        : [...f[field], val],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/provider-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("Profile saved! Redirecting...");
      setTimeout(() => router.push("/provider/dashboard"), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save profile");
    }
    setSubmitting(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("caption", "");

    const res = await fetch("/api/upload/provider-portfolio-image", {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      const img = await res.json();
      setPortfolio((p) => [...p, img]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload/provider-profile-photo", {
      method: "POST",
      body: fd,
    });
    if (res.ok) {
      const data = await res.json();
      setPhotoUrl(data.photoUrl);
    }
    setUploadingPhoto(false);
    e.target.value = "";
  };

  if (status === "loading" || loading)
    return (
      <div className="py-20 text-center text-brand-muted">Loading...</div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">
        {form.displayName ? "Edit" : "Create"} Provider Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile photo */}
        <div className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4">
          <h2 className="font-semibold">Profile Photo</h2>
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-2 border-brand-border"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-brand-border bg-brand-bg text-3xl text-brand-muted">
                {form.displayName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <label className="cursor-pointer rounded border border-dashed border-brand-border-light bg-brand-bg px-4 py-3 text-sm text-brand-muted transition hover:border-cyan hover:text-brand-text">
              {uploadingPhoto ? "Uploading..." : photoUrl ? "Change Photo" : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Basic info */}
        <div className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4">
          <h2 className="font-semibold">Basic Info</h2>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Display Name *
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              required
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Headline
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="e.g. FDM & Resin specialist, Charlotte NC"
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4">
          <h2 className="font-semibold">Location</h2>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Address (for map placement)
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. 123 Main St, Charlotte, NC 28202"
              className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-cyan focus:outline-none"
            />
            <p className="mt-1 text-xs text-brand-muted">
              Your address is used for map placement only and won&apos;t be
              displayed publicly.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-brand-muted">
              Service Radius (miles)
            </label>
            <input
              type="number"
              value={form.serviceRadiusMiles}
              onChange={(e) =>
                setForm({
                  ...form,
                  serviceRadiusMiles: parseInt(e.target.value) || 15,
                })
              }
              className="w-32 rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        {/* Capabilities */}
        <div className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4">
          <h2 className="font-semibold">Processes</h2>
          <div className="flex flex-wrap gap-2">
            {PROCESSES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => toggle("processes", p)}
                className={`rounded border px-3 py-1 text-sm transition ${
                  form.processes.includes(p)
                    ? "border-cyan bg-cyan/20 text-cyan"
                    : "border-brand-border text-brand-muted hover:text-brand-text"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <h2 className="font-semibold">Materials</h2>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggle("materials", m)}
                className={`rounded border px-3 py-1 text-sm transition ${
                  form.materials.includes(m)
                    ? "border-cyan bg-cyan/20 text-cyan"
                    : "border-brand-border text-brand-muted hover:text-brand-text"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <h2 className="font-semibold">Additional Capabilities</h2>
          <div className="flex flex-wrap gap-2">
            {CAPABILITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggle("capabilities", c)}
                className={`rounded border px-3 py-1 text-sm transition ${
                  form.capabilities.includes(c)
                    ? "border-cyan bg-cyan/20 text-cyan"
                    : "border-brand-border text-brand-muted hover:text-brand-text"
                }`}
              >
                {CAPABILITY_LABELS[c] || c}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4">
          <h2 className="font-semibold">Contact Info</h2>
          <p className="text-xs text-brand-muted">
            Shown only to logged-in users.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
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
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-brand-muted">
                Website URL
              </label>
              <input
                type="url"
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm({ ...form, websiteUrl: e.target.value })
                }
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-brand-muted">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm({ ...form, instagramUrl: e.target.value })
                }
                className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Portfolio upload */}
        <div
          id="portfolio"
          className="space-y-4 rounded-lg border border-brand-border bg-brand-surface p-4"
        >
          <h2 className="font-semibold">Portfolio Images</h2>
          {portfolio.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {portfolio.map((img: any) => (
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
          )}
          <div>
            <label className="cursor-pointer rounded border border-dashed border-brand-border-light bg-brand-bg px-4 py-6 text-center text-sm text-brand-muted transition hover:border-cyan hover:text-brand-text block">
              {uploading ? "Uploading..." : "Click to upload an image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-cyan py-2.5 text-sm font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
