"use client";

import React from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/src/shared/ui/button";

interface FormActionsProps {
  isPending: boolean;
  onCancel: () => void;
  type: "create" | "update";
}

export function FormActions({ isPending, onCancel, type }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pb-10">
      <Button
        type="button"
        variant="ghost"
        className="text-neutral-500 hover:text-neutral-700"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isPending}
        className="bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-transform text-white px-6 h-10 rounded-xl font-medium text-sm"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2Icon className="w-4 h-4 animate-spin" />
            {type === "create" ? "creating..." : "updating..."}
          </span>
        ) : type === "create" ? (
          "create"
        ) : (
          "update"
        )}
      </Button>
    </div>
  );
}

export default FormActions;
