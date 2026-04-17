"use client";

import { useEffect, useMemo } from "react";

import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { divIcon } from "leaflet";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { trackEvent } from "@/lib/analytics";

export type InteractiveMapItem = {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  latitude: number;
  longitude: number;
  accentLabel?: string;
};

type InteractiveListingsMapInnerProps = {
  items: InteractiveMapItem[];
  selectedId?: string | null;
  onSelectHref?: boolean;
  className?: string;
  trackingContext?: string;
};

function FitMapBounds({
  items,
  selectedId,
}: {
  items: InteractiveMapItem[];
  selectedId?: string | null;
}) {
  const map = useMap();

  const selectedItem = selectedId
    ? items.find((item) => item.id === selectedId) ?? null
    : null;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    if (selectedItem) {
      map.flyTo([selectedItem.latitude, selectedItem.longitude], Math.max(map.getZoom(), 13), {
        duration: 0.65,
      });
      return;
    }

    if (items.length === 1) {
      map.setView([items[0].latitude, items[0].longitude], 13);
      return;
    }

    const bounds: LatLngBoundsExpression = items.map((item) => [
      item.latitude,
      item.longitude,
    ]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [items, map, selectedItem]);

  return null;
}

export function InteractiveListingsMapInner({
  items,
  selectedId,
  onSelectHref = true,
  className,
  trackingContext = "map",
}: InteractiveListingsMapInnerProps) {
  const initialCenter: LatLngExpression = items[0]
    ? [items[0].latitude, items[0].longitude]
    : [25.2048, 55.2708];

  const selectedItem = selectedId
    ? items.find((item) => item.id === selectedId) ?? null
    : null;

  const activeMarkerIcon = useMemo(
    () =>
      divIcon({
        className: "interactive-map-pin-wrapper",
        html: '<span class="interactive-map-pin interactive-map-pin-active"></span>',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      }),
    [],
  );

  return (
    <div className={className}>
      <MapContainer
        center={initialCenter}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapBounds items={items} selectedId={selectedId} />

        {items.map((item) => {
          const position: LatLngExpression = [item.latitude, item.longitude];
          const isSelected = selectedItem?.id === item.id;

          if (isSelected) {
            return (
              <Marker key={item.id} position={position} icon={activeMarkerIcon}>
                <Popup
                  eventHandlers={{
                    add: () =>
                      trackEvent("map_marker_selected", {
                        context: trackingContext,
                        item_id: item.id,
                        item_title: item.title,
                        item_subtitle: item.subtitle ?? "",
                        item_href: item.href ?? "",
                      }),
                  }}
                >
                  <div className="space-y-2">
                    {item.accentLabel ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                        {item.accentLabel}
                      </p>
                    ) : null}
                    <p className="text-sm font-semibold text-stone-950">{item.title}</p>
                    {item.subtitle ? (
                      <p className="text-xs leading-6 text-stone-600">{item.subtitle}</p>
                    ) : null}
                    {item.href && onSelectHref ? (
                      <a
                        href={item.href}
                        className="inline-flex bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)]"
                      >
                        Open
                      </a>
                    ) : null}
                  </div>
                </Popup>
              </Marker>
            );
          }

          return (
            <CircleMarker
              key={item.id}
              center={position}
              radius={9}
              pathOptions={{
                color: "rgba(141,104,71,0.95)",
                fillColor: "rgba(141,104,71,0.78)",
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Popup
                eventHandlers={{
                  add: () =>
                    trackEvent("map_marker_selected", {
                      context: trackingContext,
                      item_id: item.id,
                      item_title: item.title,
                      item_subtitle: item.subtitle ?? "",
                      item_href: item.href ?? "",
                    }),
                }}
              >
                <div className="space-y-2">
                  {item.accentLabel ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                      {item.accentLabel}
                    </p>
                  ) : null}
                  <p className="text-sm font-semibold text-stone-950">{item.title}</p>
                  {item.subtitle ? (
                    <p className="text-xs leading-6 text-stone-600">{item.subtitle}</p>
                  ) : null}
                  {item.href && onSelectHref ? (
                    <a
                      href={item.href}
                      className="inline-flex bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)]"
                    >
                      Open
                    </a>
                  ) : null}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
