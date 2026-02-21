"use client";

import { getProviders, signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Providers = Awaited<ReturnType<typeof getProviders>>;

function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Providers>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/onboarding";

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, callbackUrl });
  };

  const hasGoogle = Boolean(providers?.google);

  return (
    <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm text-brand-muted"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-cyan focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-cyan py-2 text-sm font-medium text-black transition hover:bg-cyan-hover disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Continue with Email"}
        </button>
      </form>

      {hasGoogle && (
        <>
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="text-xs text-brand-muted">or</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full rounded border border-brand-border py-2 text-sm text-brand-text transition hover:border-brand-border-light hover:bg-brand-surface-hover"
          >
            Continue with Google
          </button>
        </>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-cyan">3D</span>mates
          </h1>
          <h2 className="mt-3 text-lg font-semibold text-brand-text">
            Sign in or create your account
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            We&apos;ll email you a secure magic link.
          </p>
          <p className="mt-1 text-xs text-brand-muted">
            After signing in, choose Customer or Provider.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-center text-brand-muted">
              Loading...
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
