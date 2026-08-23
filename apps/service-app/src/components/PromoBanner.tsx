import { useState } from "react";

const slides = [
  {
    title: "GIGATEL",
    subtitle: "eSIM",
    tagline: "SIÊU TỐC ĐỘ CHO MỌI TRẢI NGHIỆM",
    note: "CÔNG NGHỆ ESIM THẾ HỆ MỚI",
    priceLabel: "GIÁ CHỈ TỪ",
    price: "149.000",
    unit: "đ/tháng",
  },
  {
    title: "NOVAMOBILE",
    subtitle: "DATA+",
    tagline: "KẾT NỐI KHÔNG GIỚI HẠN",
    note: "ƯU ĐÃI THÁNG ĐẦU TIÊN",
    priceLabel: "GIẢM ĐẾN",
    price: "50%",
    unit: "cho khách hàng mới",
  },
];

export default function PromoBanner() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  function go(delta: number) {
    setIndex((prev) => (prev + delta + slides.length) % slides.length);
  }

  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 p-8 dark:from-slate-800 dark:to-slate-700">
      <div>
        <div className="text-sm font-semibold tracking-wide text-red-600">{slide.title}</div>
        <div className="text-4xl font-extrabold leading-tight text-red-600">{slide.subtitle}</div>
        <p className="mt-1 text-sm font-medium">{slide.tagline}</p>
        <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">{slide.note}</p>
        <p className="mt-2 text-xl font-bold text-red-600">
          {slide.priceLabel} {slide.price}
          <span className="ml-1 text-sm font-normal text-gray-600 dark:text-slate-300">
            {slide.unit}
          </span>
        </p>
      </div>

      <div className="hidden h-40 w-56 flex-shrink-0 items-center justify-center rounded-lg bg-white/60 text-6xl dark:bg-slate-900/40 sm:flex">
        📶
      </div>

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
    </div>
  );
}
