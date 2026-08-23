interface CarrierTabsProps {
  carriers: readonly string[];
  active: string;
  onChange: (carrier: string) => void;
}

export default function CarrierTabs({ carriers, active, onChange }: CarrierTabsProps) {
  const options = ["Tất cả", ...carriers];

  return (
    <div className="mt-8 flex gap-6 border-b border-gray-200 dark:border-slate-700">
      {options.map((carrier) => (
        <button
          key={carrier}
          type="button"
          onClick={() => onChange(carrier)}
          className={`-mb-px border-b-2 pb-2 text-sm font-medium ${
            active === carrier
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-100"
          }`}
        >
          {carrier}
        </button>
      ))}
    </div>
  );
}
