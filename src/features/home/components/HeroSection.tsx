import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white dark:bg-gray-950">
      {/* Content */}
      <div className="relative max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full 
          bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
          Now live — 1,200+ jobs posted
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl font-medium 
          text-gray-900 dark:text-gray-50 leading-tight tracking-tight mb-4"
        >
          Find your next{" "}
          <span className="text-blue-500 dark:text-blue-400">developer</span>{" "}
          role
        </h1>

        {/* Subtext */}
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
          HireLoop connects talented developers with companies that value good
          engineering. Browse jobs, build your profile, and apply in minutes.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/signin"
            className="text-sm px-5 py-2.5 rounded-xl 
            bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 
            transition-colors font-medium"
          >
            Browse jobs
          </Link>

          <Link
            href="/signup"
            className="text-sm px-5 py-2.5 rounded-xl 
            border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 
            hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Post a job
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {[
            { value: "1,200+", label: "Active jobs" },
            { value: "340+", label: "Companies" },
            { value: "8,500+", label: "Candidates" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-medium text-gray-900 dark:text-gray-50">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
