"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { parseJsonArray } from "@/lib/helpers";

export default function ProviderDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
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

    fetch("/api/provider-profile/me")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, [session, status]);

  if (status === "loading" || loading)
    return (
      <div className="py-20 text-center text-brand-muted">Loading...</div>
    );

  if (!profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Set Up Your Provider Profile</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Create your profile to start receiving job requests.
        </p>
        <Link
          href="/provider/profile/edit"
          className="mt-4 inline-block rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  const materials = parseJsonArray(profile.materials);
  const processes = parseJsonArray(profile.processes);
  const completionItems = [
    { label: "Display name", done: !!profile.displayName },
    { label: "Headline", done: !!profile.headline },
    { label: "Bio", done: !!profile.bio },
    { label: "Address (for map)", done: !!profile.address },
    { label: "Contact email", done: !!profile.contactEmail },
    { label: "Processes", done: processes.length > 0 },
    { label: "Materials", done: materials.length > 0 },
    { label: "Portfolio images", done: profile.portfolio?.length > 0 },
  ];
  const completionPct = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) *
      100
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <Link
          href="/provider/profile/edit"
          className="rounded border border-cyan px-3 py-1.5 text-sm text-cyan transition hover:bg-cyan/10"
        >
          Edit Profile
        </Link>
      </div>

      {/* Status badge */}
      <div className="mb-6 rounded-lg border border-brand-border bg-brand-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{profile.displayName}</h2>
            <p className="text-sm text-brand-muted">
              {profile.headline || "No headline set"}
            </p>
          </div>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              profile.status === "APPROVED"
                ? "bg-emerald-900/40 text-emerald-300"
                : profile.status === "PENDING"
                  ? "bg-amber-900/40 text-amber-300"
                  : "bg-red-900/40 text-red-300"
            }`}
          >
            {profile.status}
          </span>
        </div>
        {profile.status === "PENDING" && (
          <p className="mt-2 text-xs text-amber-300">
            Your profile is pending admin approval. You&apos;ll appear publicly
            once approved.
          </p>
        )}
      </div>

      {/* Profile completion */}
      <div className="mb-6 rounded-lg border border-brand-border bg-brand-surface p-4">
        <h3 className="mb-2 text-sm font-medium">
          Profile Completion: {completionPct}%
        </h3>
        <div className="mb-3 h-2 rounded-full bg-brand-bg">
          <div
            className="h-2 rounded-full bg-cyan transition-all"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {completionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <span className={item.done ? "text-emerald-400" : "text-brand-muted"}>
                {item.done ? "&#10003;" : "&#9675;"}
              </span>
              <span
                className={
                  item.done ? "text-brand-text" : "text-brand-muted"
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Portfolio</h2>
          <Link
            href="/provider/profile/edit#portfolio"
            className="text-sm text-cyan hover:text-cyan-hover"
          >
            Manage
          </Link>
        </div>
        {profile.portfolio?.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {profile.portfolio.map((img: any) => (
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
        ) : (
          <p className="text-sm text-brand-muted">
            No portfolio images yet. Add some to showcase your work.
          </p>
        )}
      </div>
    </div>
  );
}
