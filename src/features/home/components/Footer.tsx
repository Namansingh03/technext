"use client";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full pt-20 pb-10 tonal-shift from surface-container-low">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <a
            className="text-2xl font-bold text-slate-900 dark:text-white mb-6 block font-['Inter']"
            href="#"
          >
            TalentGate
          </a>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed font-['Inter']">
            The premium destination for elite tech talent. We curate the best
            roles from the world&apos;s most innovative companies.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="font-bold text-on-surface text-sm uppercase tracking-widest">
              Platform
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  Find Jobs
                </a>
              </li>
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  Post a Job
                </a>
              </li>
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  Companies
                </a>
              </li>
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-on-surface text-sm uppercase tracking-widest">
              Company
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="text-slate-500 hover:text-indigo-500 transition-transform duration-200 hover:translate-x-1 block text-sm font-['Inter']"
                  href="#"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-['Inter'] text-sm text-slate-500 dark:text-slate-400">
          © 2024 CareerFlow Editorial. Built for the modern professional.
        </p>
        <div className="flex gap-6">
          <a
            className="text-slate-500 hover:text-indigo-500 text-sm font-['Inter']"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-slate-500 hover:text-indigo-500 text-sm font-['Inter']"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-slate-500 hover:text-indigo-500 text-sm font-['Inter']"
            href="#"
          >
            Cookie Settings
          </a>
        </div>
      </div>
    </footer>
  );
}
