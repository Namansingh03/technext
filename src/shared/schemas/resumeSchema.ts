import { z } from "zod";

const resumeSchema = z.object({
  label: z.string().min(1, "the resume label is required"),
  isDefault: z.boolean(),
  File: z
    .file()
    .mime(
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      {
        error: "only pdf and docx are supported",
      },
    )
    .max(5_000_000, { error: "file can be of max 5MB" }),
  fileName: z.string().min(1, "file name is required"),
});

export type resumeSchemaType = z.infer<typeof resumeSchema>;
export { resumeSchema };
