interface CarrierTabsProps {
  carriers: readonly string[];
  active: string;
  onChange: (carrier: string) => void;
}

export default function CarrierTabs({ carriers, active, onChange }: CarrierTabsProps) {
  const options = ["Tất cả", ...carriers];
  const brand: Record<string, { monogram: string; color: string }> = {
    Viettel: { monogram: "V", color: "bg-emerald-600" },
    Mobifone: { monogram: "M", color: "bg-blue-600" },
    Vinaphone: { monogram: "V", color: "bg-blue-600" },
    VietnamMobile: { monogram: "VM", color: "bg-amber-500" },
  };

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
          {brand[carrier] && <span aria-hidden="true" className={`mr-2 inline-grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white ${brand[carrier].color}`}>{brand[carrier].monogram}</span>}
          {carrier}
        </button>
      ))}
    </div>
  );
}
