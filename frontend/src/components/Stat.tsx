type StatProps = {
  label: string;
  value: number | string;
  variant?: "green" | "red";
  highlight?: boolean;
};

const Stat = ({ label, value, variant, highlight }: StatProps) => {
  const textColor = highlight
    ? "text-white text-4xl sm:text-5xl"
    : variant === "green"
    ? "text-green-500 text-3xl sm:text-4xl"
    : variant === "red"
    ? "text-red-500 text-3xl sm:text-4xl"
    : "text-white text-3xl sm:text-4xl";

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
      <p className="text-xs sm:text-sm uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <h2 className={`mt-2 font-bold ${textColor}`}>{value}</h2>
    </div>
  );
};
export default Stat;