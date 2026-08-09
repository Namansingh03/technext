"use server";

import prismaDb from "@/src/server/db/db";
import { TellUsMoreSchemaType } from "../schemas/TellUsMoreSchema";
import { getUserOrThrow } from "@/src/shared/utils/getUserOrThrow";
import { createResponse } from "@/src/shared/utils/createResponse";
import { uploadImage } from "@/src/server/cloudinary/uploadImage";
import { Roles } from "@/prisma/generated/enums";

export async function createUser(data: TellUsMoreSchemaType) {
  try {
    const user = await getUserOrThrow();

    let imageUrl: string | undefined;

    const role = data.role.toUpperCase();

    if (!Object.values(Roles).includes(role as Roles)) {
      return createResponse(false, "Invalid role");
    }

    if (data.image) {
      const uploaded = await uploadImage({
        file: data.image,
        slug: user.id,
      });

      imageUrl = uploaded.url;
    }

    await prismaDb.user.update({
      where: {
        id: user.id,
      },
      data: {
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        role: data.role as Roles,

        ...(imageUrl && {
          image: imageUrl,
        }),
      },
      select: {
        email: true,
        name: true,
        username: true,
        image: true,
        role: true,
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
