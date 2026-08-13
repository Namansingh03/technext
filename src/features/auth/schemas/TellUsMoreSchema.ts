import { z } from "zod";
import { LocationSchema } from "../../location/schema/locationSchema";

const TellUsMoreSchema = z.object({
  image: z.instanceof(File).optional(),
  headline: z.string().max(20).min(1, "Specialization is required").trim(),
  location: LocationSchema,
  bio: z
    .string()
    .max(300, "Only 300 characters are allowed")
    .min(1, "Bio is required"),
});

export type TellUsMoreSchemaType = z.infer<typeof TellUsMoreSchema>;
export { TellUsMoreSchema };
