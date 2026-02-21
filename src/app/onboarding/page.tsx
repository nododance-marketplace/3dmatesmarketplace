"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function OnboardingContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/onboarding");
    return null;
  }

  // Already onboarded — redirect to the appropriate dashboard
  if (session.user.hasOnboarded) {
    if (session.user.role === "PROVIDER") {
      router.push("/provider/dashboard");
    } else {
      router.push("/account");
    }
    return null;
  }

  const chooseRole = async (role: "CUSTOMER" | "PROVIDER") => {
    setLoading(role);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to set role");

      // Refresh the session so hasOnboarded and role are updated
      await update();

      if (role === "PROVIDER") {
        router.push(returnTo || "/provider/profile/edit");
      } else {
        router.push(returnTo || "/account");
      }
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold">
          Welcome to <span className="text-cyan">3D</span>mates
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          How do you want to use 3DMates?
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Customer card */}
          <button
            onClick={() => chooseRole("CUSTOMER")}
            disabled={loading !== null}
            className="rounded-lg border border-brand-border bg-brand-surface p-6 text-left transition hover:border-brand-border-light hover:bg-brand-surface-hover disabled:opacity-50"
          >
            <h3 className="font-semibold text-brand-text">
              I need parts made
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-brand-muted">
              <li>Browse providers</li>
              <li>Post jobs</li>
              <li>Get quotes</li>
            </ul>
            <span className="mt-4 inline-block text-sm font-medium text-cyan">
              {loading === "CUSTOMER"
                ? "Setting up..."
                : "Continue as Customer \u2192"}
            </span>
          </button>

          {/* Provider card */}
          <button
            onClick={() => chooseRole("PROVIDER")}
            disabled={loading !== null}
            className="rounded-lg border border-cyan/30 bg-brand-surface p-6 text-left transition hover:border-cyan/50 hover:bg-brand-surface-hover disabled:opacity-50"
          >
            <h3 className="font-semibold text-cyan">I can print parts</h3>
            <ul className="mt-3 space-y-1 text-sm text-brand-muted">
              <li>Create a profile</li>
              <li>Upload portfolio</li>
              <li>Respond to jobs</li>
            </ul>
            <span className="mt-4 inline-block text-sm font-medium text-cyan">
              {loading === "PROVIDER"
                ? "Setting up..."
                : "Become a Provider \u2192"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
