"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { GalleryAlbumRecord } from "@/lib/data/types";
import { INITIAL_DATABASE_STATE } from "@/lib/data/seed";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ModalDialog } from "@/components/ui/ModalDialog";

export default function GalleryAlbumDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const [album, setAlbum] = useState<GalleryAlbumRecord | undefined>(() =>
    INITIAL_DATABASE_STATE.gallery.find(
      (g) => g.slug === slug || g.id === slug
    )
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data?.db?.gallery) {
          const found = data.db.gallery.find(
            (g: GalleryAlbumRecord) => g.slug === slug || g.id === slug
          );
          if (found) setAlbum(found);
        }
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (lightboxIndex === null || !album) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? 0 : (prev + 1) % album.photos.length
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? 0
            : (prev - 1 + album.photos.length) % album.photos.length
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, album]);

  if (!album) {
    return (
      <div className="mx-auto max-w-[960px] py-20 px-4 text-center space-y-4">
        <h1 className="text-[30px] font-bold text-[#14243b]">Album not found</h1>
        <Button href="/gallery" variant="primary">
          Back to Gallery
        </Button>
      </div>
    );
  }

  const activePhoto =
    lightboxIndex !== null ? album.photos[lightboxIndex] : null;

  return (
    <div className="bg-[#f8f7f3] text-[#14243b] py-[64px] px-5 sm:px-10 lg:px-[120px]">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="flex flex-col gap-2">
          <nav aria-label="Breadcrumb" className="text-[14px] leading-[22px] text-[#475569]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/gallery" className="hover:underline">
                  Gallery
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-[#14243b]">
                {album.title}
              </li>
            </ol>
          </nav>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#14243b] hover:underline self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all gallery albums</span>
          </Link>
        </div>

        {/* Album Header */}
        <div className="rounded-[12px] border border-[#dce1e7] bg-white p-8 sm:p-12 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone="info">
              {album.category} • {album.year}
            </StatusBadge>
            <span className="text-[13px] font-semibold text-[#475569] flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#14243b]" />
              {album.dateLabel}
            </span>
            <span className="text-[13px] font-semibold text-[#475569] flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#14243b]" />
              {album.location}
            </span>
            <span className="text-[13px] font-semibold text-[#475569] flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-[#14243b]" />
              {album.photos.length} photographs
            </span>
          </div>

          <h1 className="text-[34px] sm:text-[44px] font-bold text-[#14243b]">
            {album.title}
          </h1>

          <p className="text-[16px] leading-[26px] text-[#475569] max-w-3xl">
            {album.summary}
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {album.photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group overflow-hidden rounded-[12px] border border-[#dce1e7] bg-white flex flex-col"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#dde6df] text-left cursor-pointer"
                aria-label={`Open photo ${index + 1} of ${album.photos.length}: ${photo.title}`}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute bottom-3 right-3 rounded-[8px] bg-[#14243b]/90 px-3 py-1.5 text-[12px] font-semibold text-white inline-flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-[#d5ac50]" />
                  <span>
                    Photo {index + 1} of {album.photos.length}
                  </span>
                </div>
              </button>

              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h2 className="text-[20px] font-semibold text-[#14243b]">
                    {photo.title}
                  </h2>
                  <p className="text-[14px] leading-[22px] text-[#475569]">
                    {photo.caption}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#dce1e7] flex items-center justify-between text-[12px] text-[#475569]">
                  <span>Photographed by {photo.photographer}</span>
                  <span>{photo.dateLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Photo Viewer Lightbox (Figma Node 40:7090) */}
      <ModalDialog
        open={lightboxIndex !== null && Boolean(activePhoto)}
        onClose={() => setLightboxIndex(null)}
        title={
          activePhoto
            ? `${activePhoto.title} (${(lightboxIndex ?? 0) + 1} of ${album.photos.length})`
            : "Photo Viewer"
        }
        description={
          activePhoto
            ? `${album.title} · Photographed by ${activePhoto.photographer} · ${activePhoto.dateLabel}`
            : undefined
        }
        maxWidth="xl"
        footer={
          activePhoto && (
            <div className="flex w-full items-center justify-between gap-4">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ChevronLeft className="h-4 w-4" />}
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null
                      ? 0
                      : (prev - 1 + album.photos.length) % album.photos.length
                  )
                }
              >
                Previous Photo
              </Button>
              <span className="text-[13px] font-bold text-[#475569]">
                Use ← / → arrow keys to navigate
              </span>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ChevronRight className="h-4 w-4" />}
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? 0 : (prev + 1) % album.photos.length
                  )
                }
              >
                Next Photo
              </Button>
            </div>
          )
        }
      >
        {activePhoto && (
          <div className="space-y-4">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] bg-[#14243b]">
              <Image
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>
            <p className="text-[15px] leading-[24px] text-[#475569]">
              {activePhoto.caption}
            </p>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
