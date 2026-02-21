"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isProvider = session?.user?.role === "PROVIDER";
  const isAdminUser = session?.user?.isAdmin;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/brand/Blue Font.svg"
            alt="3DMates"
            width={106}
            height={40}
            className="h-8 w-auto sm:h-9"
            unoptimized
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/providers"
            className="text-sm text-brand-muted transition hover:text-brand-text"
          >
            Providers
          </Link>
          <Link
            href="/jobs"
            className="text-sm text-brand-muted transition hover:text-brand-text"
          >
            Jobs
          </Link>
          {session && (
            <Link
              href={isProvider ? "/provider/dashboard" : "/account"}
              className="text-sm text-brand-muted transition hover:text-brand-text"
            >
              Dashboard
            </Link>
          )}
          {session && !isProvider && (
            <Link
              href="/onboarding"
              className="text-sm text-cyan transition hover:text-cyan-hover"
            >
              Become a Provider
            </Link>
          )}
          {isAdminUser && (
            <Link
              href="/admin/admin-panel"
              className="text-sm text-brand-muted transition hover:text-brand-text"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded bg-brand-surface" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-brand-muted">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded border border-brand-border px-3 py-1.5 text-sm text-brand-muted transition hover:border-brand-border-light hover:text-brand-text"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded bg-cyan px-4 py-1.5 text-sm font-medium text-black transition hover:bg-cyan-hover"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 bg-brand-text transition ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-brand-text transition ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-brand-text transition ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-brand-border bg-brand-bg px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/providers"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-brand-muted hover:text-brand-text"
            >
              Providers
            </Link>
            <Link
              href="/jobs"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-brand-muted hover:text-brand-text"
            >
              Jobs
            </Link>
            {session && (
              <Link
                href={isProvider ? "/provider/dashboard" : "/account"}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-brand-muted hover:text-brand-text"
              >
                Dashboard
              </Link>
            )}
            {session && !isProvider && (
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-cyan hover:text-cyan-hover"
              >
                Become a Provider
              </Link>
            )}
            {isAdminUser && (
              <Link
                href="/admin/admin-panel"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-brand-muted hover:text-brand-text"
              >
                Admin
              </Link>
            )}
            <div className="mt-2 border-t border-brand-border pt-3">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="text-sm text-brand-muted hover:text-brand-text"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="inline-block rounded bg-cyan px-4 py-1.5 text-sm font-medium text-black"
                >
                  Get Started
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
