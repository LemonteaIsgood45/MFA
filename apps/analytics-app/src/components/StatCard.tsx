interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-sm text-gray-500 dark:text-slate-400">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-400 dark:text-slate-500">{hint}</div>}
    </div>
  );
}
