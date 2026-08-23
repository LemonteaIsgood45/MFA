interface QuantitySelectorProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-gray-300 dark:border-slate-600">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-1.5 text-lg leading-none hover:bg-gray-100 dark:hover:bg-slate-700"
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <span className="w-10 text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-1.5 text-lg leading-none hover:bg-gray-100 dark:hover:bg-slate-700"
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
}
