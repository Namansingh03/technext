import "server-only";

import cloudinary from "./cloudinary";
import {
  resumeSchema,
  resumeSchemaType,
} from "@/src/shared/schemas/resumeSchema";
import { createResponse, ApiResponse } from "@/src/shared";

export interface UploadedResume {
  label: string;
  fileUrl: string;
  isDefault: boolean;
  fileName: string;
}

export async function uploadResumes(
  resumes: resumeSchemaType[],
  userId: string,
): Promise<ApiResponse<UploadedResume[]>> {
  if (!resumes.length) {
    return createResponse(false, "no resumes found");
  }

  if (!userId) {
    return createResponse(false, "user id is required");
  }

  const defaultCount = resumes.filter((resume) => resume.isDefault).length;

  if (defaultCount > 1) {
    return createResponse(false, "Only one resume can be default");
  }

  const uploadedResumes: UploadedResume[] = [];

  for (const resume of resumes) {
    const parsed = resumeSchema.safeParse(resume);

    if (!parsed.success) {
      return createResponse(false, "Invalid resume");
    }

    const file = parsed.data.File;

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `resumes/${userId}`,
          resource_type: "raw",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
          });
        },
      );

      uploadStream.end(buffer);
    });

    uploadedResumes.push({
      label: parsed.data.label,
      fileUrl: uploadResult.secure_url,
      isDefault: parsed.data.isDefault,
      fileName: parsed.data.fileName,
    });
  }

  return createResponse(
    true,
    "resumes uploaded on cloudinary successfully",
    uploadedResumes,
  );
}
