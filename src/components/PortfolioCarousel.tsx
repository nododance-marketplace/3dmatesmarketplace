"use client";

import { useState } from "react";

interface Image {
  imageUrl: string;
  caption?: string | null;
}

export default function PortfolioCarousel({ images }: { images: Image[] }) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setIdx((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIdx((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="relative">
      <div className="aspect-video overflow-hidden rounded-lg border border-brand-border bg-brand-bg">
        <img
          src={images[idx].imageUrl}
          alt={images[idx].caption || "Portfolio image"}
          className="h-full w-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2.5 py-1 text-sm text-white transition hover:bg-black/70"
          >
            &#8249;
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2.5 py-1 text-sm text-white transition hover:bg-black/70"
          >
            &#8250;
          </button>
          <div className="mt-2 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 w-1.5 rounded-full transition ${i === idx ? "bg-cyan" : "bg-brand-border"}`}
              />
            ))}
          </div>
        </>
      )}

      {images[idx].caption && (
        <p className="mt-2 text-center text-xs text-brand-muted">
          {images[idx].caption}
        </p>
      )}
    </div>
  );
}
