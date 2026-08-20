"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { cn } from "@/src/shared/utils/utils";

interface StringArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  buttonText?: string;
  /** "list" (default) shows editable rows, "badge" shows removable pills */
  variant?: "list" | "badge";
}

export function StringArrayInput({
  value,
  onChange,
  placeholder = "Enter a value",
  buttonText = "Add",
  variant = "list",
}: StringArrayInputProps) {
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const isEditing = editingIndex !== null;

  function addOrUpdate() {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (isEditing) {
      onChange(value.map((item, i) => (i === editingIndex ? trimmed : item)));
      setEditingIndex(null);
    } else {
      onChange([...value, trimmed]);
    }

    setInput("");
  }

  function edit(index: number) {
    setInput(value[index]);
    setEditingIndex(index);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));

    if (editingIndex === index) {
      cancelEdit();
    }
  }

  function cancelEdit() {
    setEditingIndex(null);
    setInput("");
  }

  return (
    <div className="space-y-2 w-full">
      {/* Added requirements */}
      <div
        className={cn(
          "rounded-md border p-3 border-neutral-300 w-full",
          variant === "list" && value.length > 0 && "border",
          variant === "badge" && "flex flex-wrap gap-2",
        )}
      >
        {value.length === 0
          ? ""
          : variant === "badge"
            ? value.map((item, index) => (
                <Badge
                  key={index}
                  variant={editingIndex === index ? "outline" : "secondary"}
                  className="px-3 py-4 text-sm"
                >
                  <button
                    type="button"
                    onClick={() => edit(index)}
                    className="text-sm"
                  >
                    {item}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-full p-0.5 hover:bg-black/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            : value.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3",
                    editingIndex === index,
                  )}
                >
                  <span className="flex-1 text-sm text-muted-foreground">
                    {item}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => edit(index)}
                    >
                      <Pencil className="h-2 w-2" />
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-2 w-2 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addOrUpdate();
            }
          }}
        />

        <Button type="button" onClick={addOrUpdate}>
          {isEditing ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>

        {isEditing && (
          <Button type="button" variant="outline" onClick={cancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
