import { z } from "zod";

const LocationSchema = z.object({
  placeId: z.string(),
  formattedAddress: z.string(),

  city: z.string().nullable(),
  state: z.string().nullable(),

  country: z.string().nullable(),
  countryCode: z.string().nullable(),

  latitude: z.number(),
  longitude: z.number(),

  label: z.string(),
});

export type locationSchemaType = z.infer<typeof LocationSchema>;

export { LocationSchema };
