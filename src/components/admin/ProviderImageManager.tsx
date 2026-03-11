"use client";

import { useState, useRef } from "react";

interface PortfolioImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

interface Props {
  providerId: string;
  photoUrl: string | null;
  portfolio: PortfolioImage[];
  onUpdate: () => void;
}

export default function ProviderImageManager({
  providerId,
  photoUrl,
  portfolio,
  onUpdate,
}: Props) {
  const [uploading, setUploading] = useState<string | null>(null); // "profile" | "portfolio" | null
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, type: "profile" | "portfolio") => {
    setUploading(type);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("providerId", providerId);
    formData.append("type", type);

    try {
      const res = await fetch("/api/admin/provider-images", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        onUpdate();
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(null);
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, "profile");
    e.target.value = "";
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Upload files sequentially
    (async () => {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], "portfolio");
      }
    })();
    e.target.value = "";
  };

  const handleRemovePhoto = async () => {
    setActionLoading("removePhoto");
    await fetch("/api/admin/provider-images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removePhoto", providerId }),
    });
    onUpdate();
    setActionLoading(null);
  };

  const handleDeleteImage = async (imageId: string) => {
    setActionLoading(imageId);
    await fetch("/api/admin/provider-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    onUpdate();
    setActionLoading(null);
  };

  const handleReorder = async (imageId: string, direction: "up" | "down") => {
    setActionLoading(imageId + direction);
    await fetch("/api/admin/provider-images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", imageId, direction }),
    });
    onUpdate();
    setActionLoading(null);
  };

  return (
    <div className="mt-4 space-y-4 border-t border-brand-border pt-4">
      {/* ── Profile Photo ──────────────────────────────── */}
      <div>
        <label className="mb-2 block text-xs font-medium text-brand-muted">
          Profile Photo
        </label>
        <div className="flex items-center gap-3">
          {photoUrl ? (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-brand-border">
              <img
                src={photoUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-brand-border bg-brand-bg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-brand-muted"
              >
                <circle
                  cx="10"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 18c0-4 3.5-7 8-7s8 3 8 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => profileInputRef.current?.click()}
              disabled={uploading === "profile"}
              className="rounded border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-muted transition hover:text-brand-text disabled:opacity-50"
            >
              {uploading === "profile"
                ? "Uploading..."
                : photoUrl
                  ? "Replace"
                  : "Upload"}
            </button>
            {photoUrl && (
              <button
                onClick={handleRemovePhoto}
                disabled={actionLoading === "removePhoto"}
                className="rounded px-3 py-1.5 text-xs font-medium text-red-400 transition hover:text-red-300 disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleProfileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* ── Portfolio Images ───────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium text-brand-muted">
            Portfolio Images ({portfolio.length})
          </label>
          <button
            onClick={() => portfolioInputRef.current?.click()}
            disabled={uploading === "portfolio"}
            className="rounded border border-cyan/20 bg-cyan/5 px-3 py-1 text-xs font-medium text-cyan transition hover:bg-cyan/10 disabled:opacity-50"
          >
            {uploading === "portfolio" ? "Uploading..." : "+ Add Images"}
          </button>
          <input
            ref={portfolioInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePortfolioUpload}
            className="hidden"
          />
        </div>

        {portfolio.length === 0 ? (
          <div className="rounded-lg border border-dashed border-brand-border p-6 text-center">
            <p className="text-xs text-brand-muted">
              No portfolio images yet. Click &quot;+ Add Images&quot; to upload.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {portfolio.map((img, idx) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-lg border border-brand-border bg-brand-bg"
              >
                <div className="aspect-video">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || `Portfolio ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Overlay controls */}
                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                  {/* Reorder */}
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => handleReorder(img.id, "up")}
                      disabled={
                        idx === 0 ||
                        actionLoading === img.id + "up"
                      }
                      className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30"
                      title="Move left"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => handleReorder(img.id, "down")}
                      disabled={
                        idx === portfolio.length - 1 ||
                        actionLoading === img.id + "down"
                      }
                      className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30"
                      title="Move right"
                    >
                      →
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    disabled={actionLoading === img.id}
                    className="rounded bg-red-600/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm transition hover:bg-red-600 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>

                {/* Sort order badge */}
                <div className="absolute left-1 top-1 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white/60 backdrop-blur-sm">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
