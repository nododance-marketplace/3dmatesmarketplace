// ── Utility helpers ──────────────────────────────────────────

/**
 * Safely parse a JSON array string. Returns [] on failure.
 */
export function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Sanitize an address for geocoding:
 * Strip suite, unit, apt, building, floor, rm, #.
 */
export function sanitizeAddress(address: string): string {
  return address
    .replace(
      /\b(suite|ste|apt|unit|building|bldg|floor|fl|rm|room|#)\s*[\w-]*/gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Geocode an address using OpenStreetMap Nominatim.
 * Falls back to sanitized address if first attempt fails.
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const tryGeocode = async (q: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "3DMates/1.0" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  };

  // Try original address first
  const result = await tryGeocode(address);
  if (result) return result;

  // Fallback: sanitized address
  const sanitized = sanitizeAddress(address);
  if (sanitized !== address) {
    return tryGeocode(sanitized);
  }

  return null;
}

/**
 * Generate a URL-safe slug from a display name + short unique suffix.
 */
export function generateSlug(displayName: string): string {
  const { nanoid } = require("nanoid");
  const base = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${nanoid(6)}`;
}

/**
 * Check if a user email is in the admin allowlist.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Format a date relative to now (e.g., "2 days ago").
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString();
}

/**
 * Format a price range for display.
 */
export function formatBudget(min?: number | null, max?: number | null): string {
  if (min && max) return `$${min} - $${max}`;
  if (min) return `$${min}+`;
  if (max) return `Up to $${max}`;
  return "Flexible";
}
