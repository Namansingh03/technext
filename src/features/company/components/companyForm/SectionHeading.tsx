import React from "react";

interface SectionHeadingProps {
  step: string;
  title: string;
  subtitle: string;
}

export function SectionHeading({ step, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="flex-none w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center mt-0.5 dark:bg-neutral-200 dark:text-neutral-900">
        {step}
      </div>
      <div>
        <h2 className="text-sm dark:text-neutral-200 font-semibold text-neutral-800">
          {title}
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5 dark:text-neutral-300">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default SectionHeading;
