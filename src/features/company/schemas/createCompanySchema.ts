import { z } from "zod";

export const CompanySizeEnum = z.enum([
  "STARTUP",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "ENTERPRISE",
]);

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  logo: z.union([z.string().url(), z.file()]).nullable(),

  banner: z.union([z.string().url(), z.file()]).nullable(),

  website: z.string().url("Website must be a valid URL"),

  linkedin: z.string().url("LinkedIn URL must be valid"),

  description: z.any().optional(),

  industry: z.string().min(2, "Industry is required").max(100),

  size: CompanySizeEnum,

  location: z.string().min(2, "Location is required").max(200),

  companyEmail: z.email(),
});

export type createCompanyTypes = z.infer<typeof createCompanySchema>;
