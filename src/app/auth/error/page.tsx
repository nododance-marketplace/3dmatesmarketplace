"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const messages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access denied. You do not have permission.",
  Verification:
    "The verification link may have expired or already been used.",
  Default: "An authentication error occurred.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <p className="mt-2 text-sm text-brand-muted">
      {messages[error || "Default"] || messages.Default}
    </p>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-bold text-brand-text">
          Authentication Error
        </h1>
        <Suspense
          fallback={
            <p className="mt-2 text-sm text-brand-muted">Loading...</p>
          }
        >
          <ErrorContent />
        </Suspense>
        <Link
          href="/auth/signin"
          className="mt-4 inline-block rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
