"use client";

import { Button } from "@/src/shared/ui/button";
import Link from "next/link";

export default function HomeNavbar() {
  return (
    <header className="bg-white dark:bg-neutral-600 shadow-md border-b border-neutral-300 dark:border-neutral-700">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <Link
          href="/"
          className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-br from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600"
        >
          Talent
          <span className="text-indigo-400 dark:text-indigo-300">Gate</span>
        </Link>

        <Button
          className="text-md font-normal px-5 py-3 dark:border-neutral-400 dark:text-neutral-100 dark:hover:bg-neutral-700"
          variant={"outline"}
        >
          <Link href={"/signin"}>signin</Link>
        </Button>
      </nav>
    </header>
  );
}
