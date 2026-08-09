import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="relative bg-linear-to-br from-indigo-200 via-indigo-400 to-indigo-600 dark:from-indigo-400 dark:via-indigo-600 dark:to-indigo-800 rounded-lg p-16 md:p-24 overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Start Your Career Journey Today
            </h2>
            <p className="text-indigo-100 dark:text-indigo-200 text-xl max-w-2xl mx-auto mb-12">
              Join 50,000+ professionals finding their next role on the
              world&apos;s most premium job portal.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-5 bg-white dark:bg-neutral-100 text-indigo-700 dark:text-indigo-800 font-extrabold text-lg rounded-xl hover:bg-indigo-50 dark:hover:bg-neutral-200 transition-all shadow-xl">
                <Link href={"/signup"}>Create a free account</Link>
              </button>
              <button className="px-10 py-5 bg-indigo-500/20 dark:bg-indigo-900/30 text-white border border-white/30 dark:border-white/20 backdrop-blur-md font-bold text-lg rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all">
                <Link href={"/signin"}>Browse all jobs</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
