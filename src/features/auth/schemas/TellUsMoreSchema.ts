import { z } from "zod";

const TellUsMoreSchema = z.object({
  image: z.instanceof(File).optional(),
  role: z.enum(["candidate", "admin"]),
  headline: z.string().max(20).min(1, "Specialization is required").trim(),
  location: z.string(),
  bio: z
    .string()
    .max(100, "Only 200 characters are allowed")
    .min(1, "Bio is required"),
});

export type TellUsMoreSchemaType = z.infer<typeof TellUsMoreSchema>;
export { TellUsMoreSchema };
