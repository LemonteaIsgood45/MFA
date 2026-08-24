import { useState } from "react";
import type { PromoBanner as PromoBannerData } from "@/api/catalog";

interface PromoBannerProps {
  banners: PromoBannerData[];
}

export default function PromoBanner({ banners }: PromoBannerProps) {
  const [index, setIndex] = useState(0);
  const banner = banners[index];

  function go(delta: number) {
    setIndex((previous) => (previous + delta + banners.length) % banners.length);
  }

  if (!banner) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-800">
      <img src={banner.imageUrl} alt="Khuyến mãi" className="h-48 w-full object-cover sm:h-56" />

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute bottom-4 right-16 rounded-full border border-gray-300 bg-white p-1.5 text-sm shadow dark:border-slate-600 dark:bg-slate-800"
            aria-label="Banner trước"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute bottom-4 right-4 rounded-full border border-gray-300 bg-white p-1.5 text-sm shadow dark:border-slate-600 dark:bg-slate-800"
            aria-label="Banner tiếp theo"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
