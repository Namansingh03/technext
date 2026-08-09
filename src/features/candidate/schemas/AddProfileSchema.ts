import { z } from "zod";

const linkSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(50, "Label too long"),

  url: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")) // allow empty input
    .refine((val) => !val || /^https?:\/\/.+/.test(val), "Invalid URL"),
});

const AddProfileSchema = z.object({
  bannerImage: z.instanceof(File).optional(),

  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required")
    .max(15, "Maximum 15 skills allowed"),

  about: z.string().max(500, "About section must be under 500 characters"),

  links: z.array(linkSchema).max(4, "Maximum 5 links allowed").optional(),
});

export type AddProfileSchemaType = z.infer<typeof AddProfileSchema>;
export type linkSchemaType = z.infer<typeof linkSchema>;

export { AddProfileSchema, linkSchema };
