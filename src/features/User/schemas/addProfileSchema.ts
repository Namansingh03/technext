import z from "zod";
import { LocationSchema } from "../../location/schema/locationSchema";

const profileHeaderSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),

  headline: z
    .string()
    .max(120, "Headline too long")
    .optional()
    .or(z.literal("")),

  location: LocationSchema,

  isAvailable: z.boolean(),

  avatar: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "Avatar must be under 2MB",
    })
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Avatar must be an image",
    }),

  banner: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Banner must be under 5MB",
    })
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Banner must be an image",
    }),
});

const educationSchema = z.object({
  school: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().min(2),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  isCurrent: z.boolean(),
});

const experienceSchema = z
  .object({
    company: z.string().min(2, "Company is required"),
    title: z.string().min(2, "Title is required"),

    location: z.string().optional().or(z.literal("")),

    startDate: z.date(),

    endDate: z.date().optional().nullable(),

    isCurrent: z.boolean(),

    description: z
      .string()
      .max(200, "Maximum 200 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.isCurrent && !data.endDate) return false;
      return true;
    },
    {
      message: "End date is required if not currently working",
      path: ["endDate"],
    },
  );

export { profileHeaderSchema, educationSchema, experienceSchema };

export type ProfileHeaderInput = z.infer<typeof profileHeaderSchema>;
export type EducationSchemaType = z.input<typeof educationSchema>;
export type ExperienceSchemaType = z.input<typeof experienceSchema>;
