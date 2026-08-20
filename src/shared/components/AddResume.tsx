"use client";

import React, { useState } from "react";
import { resumeSchema, resumeSchemaType } from "../schemas/resumeSchema";
import { Badge } from "../ui/badge";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

interface AddResumeProps {
  resumes: resumeSchemaType[];
  onChange: (resumes: resumeSchemaType[]) => void;
  errors?: string | null;
}

const AddResume = ({ resumes, onChange, errors }: AddResumeProps) => {
  const [label, setLabel] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);
  };

  const handleAddResume = () => {
    setError(null);

    // Make sure all fields are present before validation
    if (!label.trim()) {
      setError("resume label is required");
      return;
    }

    if (!file) {
      setError("please select a resume file");
      return;
    }

    // Validate the complete resume object
    const result = resumeSchema.safeParse({
      label: label.trim(),
      isDefault,
      File: file,
    });

    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "invalid resume";

      setError(firstError);
      return;
    }

    const newResume = result.data;

    let updatedResumes: resumeSchemaType[];

    if (newResume.isDefault) {
      updatedResumes = [
        ...resumes.map((resume) => ({
          ...resume,
          isDefault: false,
        })),
        newResume,
      ];
    } else {
      updatedResumes = [...resumes, newResume];
    }

    onChange(updatedResumes);

    // Reset form
    setLabel("");
    setIsDefault(false);
    setFile(null);

    // Reset file input
    const fileInput = document.getElementById(
      "resume-file",
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Added resumes */}
      <div className="w-full p-3 rounded-md border dark:border-neutral-600 border-neutral-600 min-h-14">
        {resumes?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add resumes to your profile
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {resumes?.map((resume, index) => (
              <Badge key={`${resume.label}-${index}`} variant="outline">
                {resume.label}

                {resume.isDefault && (
                  <span className="ml-1 text-xs">(default)</span>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Resume form */}
      <FieldSet className="w-full">
        <FieldGroup className="w-full grid grid-cols-2 gap-5">
          {/* Label */}
          <Field>
            <Label htmlFor="resume-label">Label</Label>

            <Input
              id="resume-label"
              placeholder="e.g. Software Engineer Resume"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setError(null);
              }}
            />
          </Field>

          {/* Default */}
          <Field>
            <Label htmlFor="is-default">Default Resume</Label>

            <div className="flex flex-row items-center gap-x-2">
              <Checkbox
                id="is-default"
                checked={isDefault}
                onCheckedChange={(checked) => {
                  setIsDefault(checked === true);
                }}
              />

              <Label htmlFor="is-default" className="font-normal">
                Make this my default resume
              </Label>
            </div>
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>File Name</FieldLabel>
            <Input
              value={fileName}
              type="text"
              placeholder="enter the file name"
              onChange={(e) => setFileName(e.target.value)}
            />
          </Field>
        </FieldGroup>

        {/* File */}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="resume-file">Resume File</FieldLabel>

            <Input
              id="resume-file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </Field>
        </FieldGroup>

        {/* Errors */}
        {(error || errors) && (
          <p className="text-sm text-red-400">{error || errors}</p>
        )}

        {/* Add */}
        <Button type="button" onClick={handleAddResume} className="w-fit">
          Add Resume
        </Button>
      </FieldSet>
    </div>
  );
};

export default AddResume;
