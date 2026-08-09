"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { useState, useTransition } from "react";
import { UpdateProfileText } from "@/src/features/candidate/actions/updateActions";

interface TextEditDialogProps {
  label: "about" | "bio";
  initialText: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxLength?: number;
}

export default function TextEditDialog({
  label,
  initialText,
  open,
  onOpenChange,
  maxLength = 200,
}: TextEditDialogProps) {
  const [value, setValue] = useState(initialText);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValue(initialText);
      setError("");
    }
    onOpenChange(nextOpen);
  };

  const handleChange = (val: string) => {
    setValue(val);
    setError(
      val.length > maxLength ? `Maximum ${maxLength} characters allowed` : "",
    );
  };

  const handleSubmit = () => {
    if (value.length > maxLength) return;

    startTransition(async () => {
      const res = await UpdateProfileText({
        text: value,
        textType: label,
      });

      if (!res.success) {
        if (res.redirectUrl) {
          router.push(res.redirectUrl);
          return;
        }
        return;
      }

      router.refresh();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
          <DialogDescription>
            Update your {label.toLowerCase()}. Max {maxLength} characters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <textarea
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Write your ${label.toLowerCase()} here...`}
          />
          <div className="flex justify-between text-xs">
            <span className="text-destructive">{error}</span>
            <span
              className={
                value.length > maxLength
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {value.length}/{maxLength}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !!error}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
