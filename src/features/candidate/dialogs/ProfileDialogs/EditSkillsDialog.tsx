"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { useState, useTransition } from "react";
import { formatDate } from "@/src/shared/utils/formatDate";
import SelectedSkills from "@/src/shared/components/SelectedSkills";
import { UpdateProfileSkills } from "@/src/features/candidate/actions/updateActions";

interface SkillsEditProps {
  skills?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditSkillsDialog = ({
  onOpenChange,
  open,
  skills = [],
}: SkillsEditProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(skills);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleSave = async () => {
    console.log(selectedSkills);

    startTransition(async () => {
      const res = await UpdateProfileSkills(selectedSkills);

      if (!res.success) {
        toast.error(res.message, { description: formatDate() });
        if (res.redirectUrl) {
          router.push(res.redirectUrl);
        }
      }

      toast.success(res.message, { description: formatDate() });
      router.refresh();
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Skills</DialogTitle>
          <DialogDescription>Add skills to your profile</DialogDescription>
        </DialogHeader>

        <SelectedSkills skills={selectedSkills} onChange={setSelectedSkills} />

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant={"secondary"}>
            Cancel
          </Button>

          <Button variant="default" onClick={handleSave} disabled={isPending}>
            {isPending ? <Loader2Icon className="animate-spin" /> : "save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkillsDialog;
