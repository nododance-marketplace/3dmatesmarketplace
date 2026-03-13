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

            {/* Social + Copyright */}
            <div className="flex flex-col items-center gap-3 sm:items-end">
              <a
                href="https://www.instagram.com/printwith3dmates/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-muted/60 transition hover:text-cyan"
                aria-label="Follow 3DMates on Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <p className="text-xs text-brand-muted/40">
                &copy; {new Date().getFullYear()} 3DMates. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
