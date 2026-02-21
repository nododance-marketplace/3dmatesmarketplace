"use client";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  max = 5,
  size = "sm",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClass = size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <span
            key={i}
            className={`${filled ? "text-cyan" : "text-brand-border"} ${interactive ? "cursor-pointer hover:text-cyan" : ""}`}
            onClick={() => interactive && onChange?.(i + 1)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
}
