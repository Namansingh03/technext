"use client";

import Link from "next/link";
import { useState } from "react";
import EditContactDialog from "../../dialogs/ProfileDialogs/EditContactDialog";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

interface ContactCardProps {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

export default function ContactCard({
  githubUrl,
  linkedinUrl,
  portfolioUrl,
}: ContactCardProps) {
  const links = [
    {
      label: "GitHub",
      href: githubUrl,
      icon: <FaGithub size={16} />,
    },
    {
      label: "LinkedIn",
      href: linkedinUrl,
      icon: <FaLinkedin size={16} />,
    },
    {
      label: "Portfolio",
      href: portfolioUrl,
      icon: <FaGlobe size={16} />,
    },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="">
      {/* Header */}
      <p className="mb-4 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Contact
        <span
          className="cursor-pointer justify-self-end text-xs font-medium capitalize text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          Edit
        </span>
      </p>

      {/* Links */}
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <div
            key={link.label}
            className="flex items-center gap-3 text-neutral-500 transition-colors dark:text-neutral-400"
          >
            <Link
              href={link.href ?? ""}
              className="shrink-0 text-neutral-400 transition-colors hover:text-blue-500 dark:text-neutral-500 dark:hover:text-blue-400"
            >
              {link.icon}
            </Link>
            <p className="text-md w-full truncate rounded-xs border-b border-neutral-200 p-2 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
              {link.href}
            </p>
          </div>
        ))}
      </div>

      <EditContactDialog
        handleOpenChange={() => setIsOpen(!open)}
        open={isOpen}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        portfolioUrl={portfolioUrl}
      />
    </div>
  );
}
