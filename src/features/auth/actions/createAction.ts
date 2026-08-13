"use server";

import prismaDb from "@/src/server/db/db";
import { TellUsMoreSchemaType } from "../schemas/TellUsMoreSchema";
import { getUserOrThrow } from "@/src/shared/utils/getUserOrThrow";
import { createResponse } from "@/src/shared/utils/createResponse";
import { uploadImage } from "@/src/server/cloudinary/uploadImage";
import { LocationSchema } from "../../location/schema/locationSchema";

export async function createUser(data: TellUsMoreSchemaType) {
  try {
    const user = await getUserOrThrow();

    let imageUrl: string | undefined;

    if (data.image) {
      const uploaded = await uploadImage({
        file: data.image,
        slug: user.id,
      });

      imageUrl = uploaded.url;
    }

    const parsed = LocationSchema.parse(data.location);

    if (!parsed) {
      return createResponse(false, "invalid location field");
    }

    const location = await prismaDb.location.create({
      data: {
        city: parsed.city!,
        state: parsed.state!,
        country: parsed.country!,
        countryCode: parsed.countryCode!,
        lat: parsed.latitude,
        lng: parsed.longitude,
        label: `${parsed.city}, ${parsed.state ?? ""}, ${parsed.country}`,
      },
    });

    await prismaDb.user.update({
      where: {
        id: user.id,
      },
      data: {
        headline: data.headline,
        bio: data.bio,
        locationId: location.id,
        ...(imageUrl && {
          image: imageUrl,
        }),
      },
    });
    return createResponse(
      true,
      "User created successfully please signin one more time",
    );
  } catch (error) {
    console.log("error creating user : ", error);
    return createResponse(false, "something went wrong");
  }
}
