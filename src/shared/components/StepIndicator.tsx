type StepIndicatorProps = {
  count: number;
  current: number;
};

const StepIndicator = ({ count, current }: StepIndicatorProps) => (
  <div className="flex items-center justify-center gap-2 py-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`rounded-full transition-all duration-300 ${
          i + 1 === current
            ? "w-6 h-2 bg-zinc-900 dark:bg-zinc-100"
            : "w-2 h-2 bg-zinc-300 dark:bg-zinc-700"
        }`}
      />
    ))}
  </div>
);

export default StepIndicator;
