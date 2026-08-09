"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/formatDate";
import React, { useState, useTransition } from "react";
import { UpdateProfileContacts } from "@/src/features/candidate/actions/updateActions";
import { FaGithub, FaLinkedin, FaGlobe, FaUser } from "react-icons/fa";

interface Props {
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

type FormDataType = {
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
};

const EditContactDialog = ({
  githubUrl,
  linkedinUrl,
  portfolioUrl,
  resumeUrl,
  open,
  handleOpenChange,
}: Props) => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const getInitialState = (): FormDataType => ({
    githubUrl: githubUrl ?? "",
    linkedinUrl: linkedinUrl ?? "",
    portfolioUrl: portfolioUrl ?? "",
    resumeUrl: resumeUrl ?? "",
  });

  const [formData, setFormData] = useState<FormDataType>(getInitialState());

  const links = [
    {
      label: "GitHub",
      key: "githubUrl" as keyof FormDataType,
      icon: <FaGithub size={16} />,
      placeholder: "https://github.com/username",
    },
    {
      label: "LinkedIn",
      key: "linkedinUrl" as keyof FormDataType,
      icon: <FaLinkedin size={16} />,
      placeholder: "https://linkedin.com/in/username",
    },
    {
      label: "Portfolio",
      key: "portfolioUrl" as keyof FormDataType,
      icon: <FaGlobe size={16} />,
      placeholder: "https://yourportfolio.com",
    },
    {
      label: "Resume",
      key: "resumeUrl" as keyof FormDataType,
      icon: <FaUser size={16} />,
      placeholder: "https://drive.google.com/...",
    },
  ];

  const handleChange = (key: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setFormData(getInitialState()); // reset values on open
    }

    handleOpenChange(nextOpen);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await UpdateProfileContacts({ candidateProfile: formData });

      if (!res.success && !res.redirectUrl) {
        toast.error(res.message, {
          description: formatDate(),
        });
        return;
      }

      if (res.redirectUrl) {
        toast.error(res.message, {
          description: formatDate(),
        });

        router.push(res.redirectUrl);
        return;
      }

      toast.success("Links updated", {
        description: formatDate(),
      });

      router.refresh();
      handleOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Contact Links</DialogTitle>
          <DialogDescription>
            Add or update your profile URLs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {links.map((link) => (
            <div key={link.label} className="space-y-2">
              <label
                htmlFor={link.key}
                className="flex items-center gap-2 text-sm font-medium"
              >
                {link.icon}
                {link.label}
              </label>

              <Input
                id={link.key}
                value={formData[link.key]}
                placeholder={link.placeholder}
                onChange={(e) => handleChange(link.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2Icon className="size-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
