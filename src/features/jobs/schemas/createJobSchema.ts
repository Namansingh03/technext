import { z } from "zod";

export const EmploymentType = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
]);

export const JobPostingType = z.enum([
  "CANDIDATE_HIRING",
  "RECRUITER_HIRING",
  "INTERVIEWER_HIRING",
]);

export const WorkMode = z.enum(["REMOTE", "HYBRID", "ONSITE"]);

export const ExperienceLevel = z.enum(["ENTRY", "MID", "SENIOR", "LEAD"]);

export const JobPostStatus = z.enum([
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
  "ARCHIVED",
]);

// ---- Main schema ----
export const recruiterJobPostSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be under 100 characters"),

    description: z
      .string()
      .trim()
      .min(50, "Description must be at least 50 characters"),

    responsibilities: z
      .array(z.string().trim().min(1))
      .min(1, "Add at least one responsibility"),

    requirements: z
      .array(z.string().trim().min(1))
      .min(1, "Add at least one requirement"),

    employmentType: EmploymentType,
    workMode: WorkMode,
    jobPostingType: JobPostingType,

    location: z.string().trim().max(100).optional(),

    minSalary: z.coerce.number().int().positive().optional(),

    maxSalary: z.coerce.number().int().positive().optional(),

    currency: z.string().trim().length(3).default("USD"), // ISO 4217 e.g. "USD"

    experienceLevel: ExperienceLevel,

    skills: z
      .array(z.string().trim().min(1))
      .min(1, "Add at least one required skill"),

    status: JobPostStatus.default("DRAFT"),

    applicationDeadline: z.coerce
      .date()
      .refine((date) => date > new Date(), {
        message: "Deadline must be in the future",
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.workMode === "REMOTE" || (data.location && data.location.length > 0),
    {
      message: "Location is required for hybrid or onsite roles",
      path: ["location"],
    },
  )
  .refine(
    (data) =>
      !data.minSalary || !data.maxSalary || data.maxSalary >= data.minSalary,
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    },
  );

export type RecruiterJobPostType = z.infer<typeof recruiterJobPostSchema>;
