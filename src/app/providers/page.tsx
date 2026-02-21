"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProviderMap from "@/components/ProviderMap";
import {
  MATERIALS,
  PROCESSES,
  CAPABILITIES,
  PROCESS_COLORS,
  CAPABILITY_LABELS,
  CAPABILITY_COLORS,
} from "@/lib/constants";

interface Provider {
  id: string;
  slug: string;
  displayName: string;
  headline?: string | null;
  city: string;
  lat?: number | null;
  lng?: number | null;
  materials: string[];
  processes: string[];
  capabilities: string[];
  thumbnailUrl?: string | null;
  avgRating: number;
  reviewCount: number;
}

export default function ProvidersPage() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [search, setSearch] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    []
  );
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fetchProviders = async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedMaterials.length)
      params.set("materials", selectedMaterials.join(","));
    if (selectedProcesses.length)
      params.set("processes", selectedProcesses.join(","));
    if (selectedCapabilities.length)
      params.set("capabilities", selectedCapabilities.join(","));
    if (viewMode === "map") params.set("mapMode", "1");

    const res = await fetch(`/api/providers?${params}`);
    const data = await res.json();
    setProviders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchSaved = async () => {
    if (!session) return;
    const res = await fetch("/api/saved/providers/me");
    const data = await res.json();
    if (Array.isArray(data)) {
      setSavedIds(new Set(data.map((s: any) => s.providerId)));
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [search, selectedMaterials, selectedProcesses, selectedCapabilities, viewMode]);

  useEffect(() => {
    fetchSaved();
  }, [session]);

  const toggleSave = async (providerId: string) => {
    if (!session) return;
    await fetch("/api/saved/provider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId }),
    });
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) next.delete(providerId);
      else next.add(providerId);
      return next;
    });
  };

  const toggleFilter = (
    arr: string[],
    setArr: (v: string[]) => void,
    val: string
  ) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Providers</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`rounded px-3 py-1.5 text-sm transition ${viewMode === "list" ? "bg-cyan text-black" : "border border-brand-border text-brand-muted hover:text-brand-text"}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`rounded px-3 py-1.5 text-sm transition ${viewMode === "map" ? "bg-cyan text-black" : "border border-brand-border text-brand-muted hover:text-brand-text"}`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-cyan focus:outline-none sm:max-w-xs"
        />

        <div className="flex flex-wrap gap-4 text-xs">
          {/* Processes */}
          <div>
            <span className="mb-1 block text-brand-muted">Processes</span>
            <div className="flex flex-wrap gap-1">
              {PROCESSES.map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    toggleFilter(
                      selectedProcesses,
                      setSelectedProcesses,
                      p
                    )
                  }
                  className={`rounded border px-2 py-0.5 transition ${
                    selectedProcesses.includes(p)
                      ? "border-cyan bg-cyan/20 text-cyan"
                      : "border-brand-border text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {/* Materials */}
          <div>
            <span className="mb-1 block text-brand-muted">Materials</span>
            <div className="flex flex-wrap gap-1">
              {MATERIALS.map((m) => (
                <button
                  key={m}
                  onClick={() =>
                    toggleFilter(
                      selectedMaterials,
                      setSelectedMaterials,
                      m
                    )
                  }
                  className={`rounded border px-2 py-0.5 transition ${
                    selectedMaterials.includes(m)
                      ? "border-cyan bg-cyan/20 text-cyan"
                      : "border-brand-border text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-brand-muted">Loading...</div>
      ) : viewMode === "map" ? (
        <ProviderMap providers={providers} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <div
              key={p.slug}
              className="group relative rounded-lg border border-brand-border bg-brand-surface p-4 transition hover:border-brand-border-light hover:bg-brand-surface-hover"
            >
              {/* Save button */}
              {session && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSave(p.id);
                  }}
                  className="absolute right-3 top-3 text-lg"
                  title={savedIds.has(p.id) ? "Unsave" : "Save"}
                >
                  {savedIds.has(p.id) ? (
                    <span className="text-cyan">&#9829;</span>
                  ) : (
                    <span className="text-brand-muted hover:text-cyan">
                      &#9825;
                    </span>
                  )}
                </button>
              )}

              <Link href={`/providers/${p.slug}`}>
                {p.thumbnailUrl && (
                  <div className="mb-3 aspect-video overflow-hidden rounded bg-brand-bg">
                    <img
                      src={p.thumbnailUrl}
                      alt={p.displayName}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-brand-text">
                  {p.displayName}
                </h3>
                {p.headline && (
                  <p className="mt-1 text-sm text-brand-muted">{p.headline}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-brand-muted">
                  <span>{p.city}</span>
                  {p.avgRating > 0 && (
                    <>
                      <span>&#183;</span>
                      <span className="text-cyan">
                        &#9733; {p.avgRating} ({p.reviewCount})
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.processes.slice(0, 3).map((proc) => (
                    <span
                      key={proc}
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${PROCESS_COLORS[proc] || "bg-gray-800/40 text-gray-300 border-gray-700/30"}`}
                    >
                      {proc}
                    </span>
                  ))}
                  {p.capabilities.slice(0, 2).map((cap) => (
                    <span
                      key={cap}
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${CAPABILITY_COLORS[cap] || "bg-gray-800/40 text-gray-300 border-gray-700/30"}`}
                    >
                      {CAPABILITY_LABELS[cap] || cap}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          ))}
          {providers.length === 0 && (
            <div className="col-span-full py-20 text-center text-brand-muted">
              No providers found. Try adjusting your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
