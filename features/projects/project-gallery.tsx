"use client";

import { useMemo, useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
};

type ProjectGalleryProps = {
  images: GalleryImage[];
};

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const galleryImages = useMemo(
    () => images.filter((image) => image.src),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (galleryImages.length === 0) {
    return (
      <div className="h-full min-h-[24rem] rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(141,104,71,0.24),rgba(198,154,91,0.18))]" />
    );
  }

  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  const goPrev = () => {
    setActiveIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  const handleTouchStart = (clientX: number) => setTouchStartX(clientX);
  const handleTouchEnd = (clientX: number) => {
    if (touchStartX == null) return;
    const delta = clientX - touchStartX;
    if (delta > 40) goPrev();
    if (delta < -40) goNext();
    setTouchStartX(null);
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative h-[24rem] w-full overflow-hidden rounded-[1.6rem] border border-[var(--border)]"
          onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
          onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="h-full w-full object-cover"
            />
          </button>

          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-[rgba(17,14,12,0.38)] px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm"
                aria-label="Previous image"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-[rgba(17,14,12,0.38)] px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm"
                aria-label="Next image"
              >
                Next
              </button>
              <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image.src}-dot-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`h-2.5 rounded-full transition ${
                      activeIndex === index
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/55 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-[rgba(17,14,12,0.38)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                {activeIndex + 1} / {galleryImages.length}
              </div>
            </>
          ) : null}
        </div>

        {galleryImages.length > 1 ? (
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.slice(0, 4).map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-[1rem] border ${
                  activeIndex === index
                    ? "border-[var(--primary)] ring-2 ring-[rgba(141,104,71,0.18)]"
                    : "border-[var(--border)]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt} className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[70] bg-[rgba(17,14,12,0.92)] p-4">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
                Image {activeIndex + 1} of {galleryImages.length}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full border border-white/16 px-4 py-2 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 z-10 rounded-full border border-white/16 bg-white/10 px-4 py-3 text-sm font-semibold text-white"
              >
                Prev
              </button>
              <div
                className="h-full w-full"
                onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
                onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="h-full w-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 z-10 rounded-full border border-white/16 bg-white/10 px-4 py-3 text-sm font-semibold text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
