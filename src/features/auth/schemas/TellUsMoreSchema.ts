import { z } from "zod";
import { LocationSchema } from "../../location/schema/locationSchema";
import { resumeSchema } from "@/src/shared/schemas/resumeSchema";

const TellUsMoreSchema = z.object({
  image: z
    .file()
    .mime(["image/jpeg", "image/png", "image/svg+xml", "image/webp"], {
      error: "this file type is not supported",
    })
    .optional(),
  headline: z.string().max(20).min(1, "Specialization is required").trim(),
  location: LocationSchema,
  bio: z
    .string()
    .max(300, "Only 300 characters are allowed")
    .min(1, "Bio is required"),
  skills: z.array(z.string()).min(5, "at least 5 skill is required"),
  resume: z.array(resumeSchema).optional(),
});

export type TellUsMoreSchemaType = z.infer<typeof TellUsMoreSchema>;
export { TellUsMoreSchema };
