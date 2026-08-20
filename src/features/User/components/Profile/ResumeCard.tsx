"use client";

import {
  FileText,
  MoreVertical,
  Star,
  ExternalLink,
  Trash2,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { ProfileResume } from "../../types/profileResumeTypes";
import { useTransition } from "react";
import { toast } from "sonner";
import { formatDate } from "@/src/shared";
import { deleteResume } from "../../actions/deleteActions";
import { makeDefault } from "../../actions/updateActions";

interface ResumeCardProps {
  resumes: ProfileResume[];
  isOwner: boolean;
}

const ResumeCard = ({ resumes, isOwner }: ResumeCardProps) => {
  const [isPending, startTransition] = useTransition();
  const formattedDate = formatDate();
  const onDelete = (resumeId: string) => {
    startTransition(async () => {
      const res = await deleteResume(resumeId);

      if (!res.success) {
        toast.error(res.message, { description: formattedDate });
        return;
      }

      toast.success("resume deleted", { description: formattedDate });
    });
  };

  const onMakeDefault = (resumeId: string) => {
    startTransition(async () => {
      const res = await makeDefault(resumeId);

      if (!res.success) {
        toast.error(res.message, { description: formattedDate });
        return;
      }
      return;
    });
  };

  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

        <h3 className="font-medium">No resumes added</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          user has&apos;nt added any resumes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {resumes.map((resume) => {
        const formattedDate = new Date(resume.createdAt).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          },
        );

        const fileExtension = resume.fileName.split(".").pop() ?? "FILE";

        return (
          <Card key={resume.id} className="w-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex min-w-0 items-start gap-3">
                {/* File icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
                  <FileText className="h-5 w-5" />
                </div>

                {/* Resume information */}
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="truncate text-base">
                      {resume.label}
                    </CardTitle>

                    {resume.default && (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Default
                      </Badge>
                    )}
                  </div>

                  <p className="truncate text-sm text-muted-foreground">
                    {resume.fileName}
                  </p>
                </div>
              </div>

              {/* Menu */}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />

                      <span className="sr-only">Resume options</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={isPending} asChild>
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open
                      </a>
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled={isPending} asChild>
                      <a href={resume.fileUrl} download={resume.fileName}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>

                    {!resume.default && onMakeDefault && (
                      <DropdownMenuItem
                        disabled={isPending}
                        onClick={() => onMakeDefault(resume.id)}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Make default
                      </DropdownMenuItem>
                    )}

                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(resume.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Added {formattedDate}</span>

                <span className="uppercase">{fileExtension}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ResumeCard;
