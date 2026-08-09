"use client";

import Link from "next/link";
import { useState } from "react";
import EditContactDialog from "@/src/features/candidate/dialogs/ProfileDialogs/EditContactDialog";
import { FaLinkedin, FaGithub, FaGlobe, FaUser } from "react-icons/fa";

interface ContactCardProps {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  resumeUrl?: string | null;
}

export default function ContactCard({
  githubUrl,
  linkedinUrl,
  portfolioUrl,
  resumeUrl,
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
    {
      label: "Resume",
      href: resumeUrl,
      icon: <FaUser size={16} />,
    },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="">
      {/* Header */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4 flex justify-between">
        Contact
        <span
          className="text-blue-500 justify-self-end capitalize cursor-pointer"
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
            className="flex items-center gap-3 text-gray-700 hover:text-blue-500 transition-colors"
          >
            <Link href={link.href ?? ""}>{link.icon}</Link>
            <p className="text-md border-slate-500 border-b rounded-xs w-full p-2">
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
        resumeUrl={resumeUrl}
      />
    </div>
  );
}
