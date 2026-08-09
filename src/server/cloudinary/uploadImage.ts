"use server";

import crypto from "crypto";
import cloudinary from "./cloudinary";
import type { UploadApiResponse } from "cloudinary";

interface cloudinaryProps {
  file: File;
  slug: string;
}

export async function uploadImage({ file, slug }: cloudinaryProps) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  const publicId = `uploads/${hash}/${slug}`;

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
          overwrite: false, // won't re-upload if it already exists
          unique_filename: false,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));
          resolve(result);
        },
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}
