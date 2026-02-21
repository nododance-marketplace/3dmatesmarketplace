"use client";

import { useState, useEffect } from "react";
import StarRating from "./ui/StarRating";

interface Review {
  id: string;
  rating: number;
  text?: string | null;
  reviewerRole: string;
  reviewerName: string;
  reviewerImage?: string | null;
  jobTitle: string;
  createdAt: string;
}

export default function ProviderReviews({ slug }: { slug: string }) {
  const [data, setData] = useState<{
    avgRating: number;
    count: number;
    reviews: Review[];
  }>({ avgRating: 0, count: 0, reviews: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?providerSlug=${slug}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="text-sm text-brand-muted">Loading reviews...</p>;
  }

  if (data.count === 0) {
    return <p className="text-sm text-brand-muted">No reviews yet.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <StarRating rating={data.avgRating} size="md" />
        <span className="text-sm text-brand-muted">
          {data.avgRating} out of 5 ({data.count} review
          {data.count !== 1 ? "s" : ""})
        </span>
      </div>
      <div className="space-y-4">
        {data.reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-brand-border bg-brand-surface p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{r.reviewerName}</span>
                <span className="text-xs text-brand-muted">
                  ({r.reviewerRole.toLowerCase()})
                </span>
              </div>
              <StarRating rating={r.rating} />
            </div>
            {r.text && (
              <p className="mt-2 text-sm text-brand-muted">{r.text}</p>
            )}
            <p className="mt-1 text-xs text-brand-muted">
              Job: {r.jobTitle} &#183;{" "}
              {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
