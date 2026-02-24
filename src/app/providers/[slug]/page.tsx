import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { parseJsonArray } from "@/lib/helpers";
import {
  MATERIAL_COLORS,
  PROCESS_COLORS,
  CAPABILITY_COLORS,
  CAPABILITY_LABELS,
} from "@/lib/constants";
import ProviderContactGate from "@/components/ProviderContactGate";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import ProviderReviews from "@/components/ProviderReviews";

interface Props {
  params: { slug: string };
}

async function getProvider(slug: string) {
  const provider = await prisma.providerProfile.findUnique({
    where: { slug, status: "APPROVED" },
    include: {
      portfolio: { orderBy: { sortOrder: "asc" } },
      receivedReviews: { where: { hidden: false }, select: { rating: true } },
    },
  });
  return provider;
}

export default async function ProviderProfilePage({ params }: Props) {
  const provider = await getProvider(params.slug);
  if (!provider) notFound();

  const materials = parseJsonArray(provider.materials);
  const processes = parseJsonArray(provider.processes);
  const capabilities = parseJsonArray(provider.capabilities);
  const ratings = provider.receivedReviews.map((r) => r.rating);
  const avgRating =
    ratings.length > 0
      ? Math.round(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10
        ) / 10
      : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        {provider.photoUrl ? (
          <img
            src={provider.photoUrl}
            alt={provider.displayName}
            className="h-20 w-20 flex-shrink-0 rounded-full border-2 border-brand-border object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-brand-border bg-brand-surface text-2xl text-brand-muted">
            {provider.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
        <h1 className="text-3xl font-bold">{provider.displayName}</h1>
        {provider.headline && (
          <p className="mt-1 text-lg text-brand-muted">{provider.headline}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-sm text-brand-muted">
          <span>{provider.city}</span>
          {avgRating > 0 && (
            <>
              <span>&#183;</span>
              <span className="text-cyan">
                &#9733; {avgRating} ({ratings.length} review
                {ratings.length !== 1 ? "s" : ""})
              </span>
            </>
          )}
        </div>
        </div>
      </div>

      {/* Portfolio */}
      {provider.portfolio.length > 0 && (
        <div className="mb-8">
          <PortfolioCarousel
            images={provider.portfolio.map((img) => ({
              imageUrl: img.imageUrl,
              caption: img.caption,
            }))}
          />
        </div>
      )}

      {/* Bio */}
      {provider.bio && (
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">About</h2>
          <p className="whitespace-pre-wrap text-sm text-brand-muted">
            {provider.bio}
          </p>
        </div>
      )}

      {/* Badges */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        {processes.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-brand-muted">
              Processes
            </h3>
            <div className="flex flex-wrap gap-1">
              {processes.map((p) => (
                <span
                  key={p}
                  className={`rounded border px-2 py-0.5 text-xs font-medium ${PROCESS_COLORS[p] || "bg-gray-800/40 text-gray-300 border-gray-700/30"}`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
        {materials.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-brand-muted">
              Materials
            </h3>
            <div className="flex flex-wrap gap-1">
              {materials.map((m) => (
                <span
                  key={m}
                  className={`rounded border px-2 py-0.5 text-xs font-medium ${MATERIAL_COLORS[m] || "bg-gray-800/40 text-gray-300 border-gray-700/30"}`}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
        {capabilities.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-brand-muted">
              Capabilities
            </h3>
            <div className="flex flex-wrap gap-1">
              {capabilities.map((c) => (
                <span
                  key={c}
                  className={`rounded border px-2 py-0.5 text-xs font-medium ${CAPABILITY_COLORS[c] || "bg-gray-800/40 text-gray-300 border-gray-700/30"}`}
                >
                  {CAPABILITY_LABELS[c] || c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact - soft gated */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Contact</h2>
        <ProviderContactGate
          contactEmail={provider.contactEmail}
          phone={provider.phone}
          websiteUrl={provider.websiteUrl}
          instagramUrl={provider.instagramUrl}
        />
      </div>

      {/* Reviews */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
        <ProviderReviews slug={params.slug} />
      </div>
    </div>
  );
}
