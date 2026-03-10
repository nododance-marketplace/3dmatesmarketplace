import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative">
      {/* Gradient divider */}
      <div className="section-divider" />

      <div className="bg-brand-surface/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Brand */}
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/brand/Emblem.svg"
                  alt="3DMates emblem"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg"
                  unoptimized
                />
              </Link>
              <p className="text-xs text-brand-muted">
                Local 3D Fabrication Network
              </p>
            </div>

            {/* Links */}
            <nav className="flex items-center justify-center gap-8">
              <Link href="/providers" className="text-xs font-medium text-brand-muted transition hover:text-cyan">
                Providers
              </Link>
              <Link href="/jobs" className="text-xs font-medium text-brand-muted transition hover:text-cyan">
                Jobs
              </Link>
              <Link href="/auth/signin" className="text-xs font-medium text-brand-muted transition hover:text-cyan">
                Get Started
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-center text-xs text-brand-muted/40 sm:text-right">
              &copy; {new Date().getFullYear()} 3DMates. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
