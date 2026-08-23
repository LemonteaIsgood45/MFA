import { useRef, type PropsWithChildren } from "react";

interface HorizontalScrollerProps extends PropsWithChildren {
  title: string;
}

export default function HorizontalScroller({ title, children }: HorizontalScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-320)}
          className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          aria-label="Cuộn trái"
        >
          ‹
        </button>
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(320)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-gray-200 bg-white p-2 shadow hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          aria-label="Cuộn phải"
        >
          ›
        </button>
      </div>
    </section>
  );
}
