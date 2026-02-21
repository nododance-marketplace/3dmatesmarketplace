"use client";

import { useSession, signIn } from "next-auth/react";

interface Props {
  contactEmail?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
}

export default function ProviderContactGate({
  contactEmail,
  phone,
  websiteUrl,
  instagramUrl,
}: Props) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="rounded-lg border border-brand-border bg-brand-surface p-6 text-center">
        <p className="text-sm text-brand-muted">
          Create a free account to unlock contact details.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-3 rounded bg-cyan px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-hover"
        >
          Sign In to View Contact
        </button>
      </div>
    );
  }

  const hasContact = contactEmail || phone || websiteUrl || instagramUrl;

  if (!hasContact) {
    return (
      <p className="text-sm text-brand-muted">
        This provider has not shared contact information yet.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border bg-brand-surface p-4">
      <div className="space-y-2 text-sm">
        {contactEmail && (
          <div className="flex items-center gap-2">
            <span className="text-brand-muted">Email:</span>
            <a
              href={`mailto:${contactEmail}`}
              className="text-cyan hover:underline"
            >
              {contactEmail}
            </a>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <span className="text-brand-muted">Phone:</span>
            <a
              href={`tel:${phone}`}
              className="text-cyan hover:underline"
            >
              {phone}
            </a>
          </div>
        )}
        {websiteUrl && (
          <div className="flex items-center gap-2">
            <span className="text-brand-muted">Website:</span>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              {websiteUrl}
            </a>
          </div>
        )}
        {instagramUrl && (
          <div className="flex items-center gap-2">
            <span className="text-brand-muted">Instagram:</span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              {instagramUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
