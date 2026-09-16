// api/upload/route.ts

import { ImageUploadError, savePartImage } from "@/lib/imageUpload";

export const runtime = "nodejs";

// POST - /api/upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const partId = formData.get("partId");

    if (!(file instanceof File)) {
      return Response.json({ error: "No image file was provided." }, { status: 400 });
    }

    if (typeof partId !== "string" || !partId.trim()) {
      return Response.json({ error: "Part ID is required." }, { status: 400 });
    }

    const imageUrl = await savePartImage(file, partId);

    return Response.json({ imageUrl });
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("Image upload failed:", error);

    return Response.json({ error: "Faile to upload image." }, { status: 500 });
  }
}
