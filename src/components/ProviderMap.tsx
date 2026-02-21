"use client";

import { useEffect, useState } from "react";
import { MAP_PIN_COLORS } from "@/lib/constants";

interface Provider {
  slug: string;
  displayName: string;
  headline?: string | null;
  lat?: number | null;
  lng?: number | null;
  processes: string[];
}

interface ProviderMapProps {
  providers: Provider[];
}

export default function ProviderMap({ providers }: ProviderMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-brand-border bg-brand-surface">
        <span className="text-sm text-brand-muted">Loading map...</span>
      </div>
    );
  }

  return <MapInner providers={providers} />;
}

function MapInner({ providers }: ProviderMapProps) {
  const [L, setL] = useState<any>(null);
  const [components, setComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    Promise.all([
      import("leaflet"),
      import("react-leaflet"),
    ]).then(([leaflet, reactLeaflet]) => {
      // Fix default marker icons
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      setL(leaflet.default);
      setComponents(reactLeaflet);
    });
  }, []);

  if (!L || !components) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-brand-border bg-brand-surface">
        <span className="text-sm text-brand-muted">Loading map...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = components;

  // Charlotte, NC center
  const center: [number, number] = [35.2271, -80.8431];
  const mappableProviders = providers.filter((p) => p.lat && p.lng);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg border border-brand-border"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {mappableProviders.map((p) => {
          const pinColor =
            MAP_PIN_COLORS[p.processes[0]] || MAP_PIN_COLORS.DEFAULT;
          const icon = L.divIcon({
            className: "custom-marker",
            html: `<div style="width:24px;height:24px;border-radius:50%;background:${pinColor};border:2px solid rgba(255,255,255,0.3);box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          return (
            <Marker
              key={p.slug}
              position={[p.lat!, p.lng!]}
              icon={icon}
            >
              <Popup>
                <div className="text-sm">
                  <a
                    href={`/providers/${p.slug}`}
                    className="font-semibold text-cyan hover:underline"
                  >
                    {p.displayName}
                  </a>
                  {p.headline && (
                    <p className="mt-1 text-xs text-brand-muted">
                      {p.headline}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
