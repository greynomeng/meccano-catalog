// lib\imageUpload.ts

import "server-only";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import {
  ALLOWED_IMAGE_TYPES,
  // MAX_IMAGE_SIZE,  // May re-instate this later
  PART_IMAGE_UPLOAD_DIR,
  PART_IMAGE_URL_PREFIX,
} from "@/lib/constants";

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

/**
 * Validate an uploaded image
 */
export function validateImage(file: File): void {
  if (!file || file.size === 0) {
    throw new ImageUploadError("No image ws provided.");
  }

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    throw new ImageUploadError("Only JPEG, PNG, and WebP images are allowed.");
  }

  // May re-instate this later
  // if (file.size > MAX_IMAGE_SIZE) {
  //   throw new ImageUploadError("Image must be 5 MB or smaller.");
  // }
}

/**
 * Convert MIME type to the extension we use for stored files.
 */
function getExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";

    case "image/png":
      return ".png";

    case "image/webp":
      return ".webp";

    default:
      throw new ImageUploadError("Unsupported image type.");
  }
}

/**
 * Generate a unique file name for a part image.
 */
export function generateImageFilename(
  partId: string,
  mimeType: string,
): string {
  const safePartId = partId
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-");

  const extension = getExtension(mimeType);

  return `${safePartId}-${randomUUID()}${extension}`;
}

/**
 * Save a part image to the local file system.
 *
 * Returns the public URL.
 */
export async function savePartImage(
  file: File,
  partId: string,
): Promise<string> {
  validateImage(file);

  if (!partId.trim()) {
    throw new ImageUploadError("Part ID is required.");
  }

  const filename = generateImageFilename(partId, file.type);

  const uploadDir = path.join(process.cwd(), PART_IMAGE_UPLOAD_DIR);
  const filePath = path.join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `${PART_IMAGE_URL_PREFIX}/${filename}`;
}

/**
 * Delete a previously uploaded part image.
 *
 * Only files inside our own part-image directory can be delated.
 *
 * Missing files are ignored.
 */
export async function deletePartImage(imageUrl?: string | null): Promise<void> {
  if (!imageUrl) {
    return;
  }

  if (!imageUrl.startsWith(`${PART_IMAGE_URL_PREFIX}/`)) {
    return;
  }

  const filename = path.basename(imageUrl);

  if (!filename) {
    return;
  }

  const uploadDir = path.join(process.cwd(), PART_IMAGE_UPLOAD_DIR);
  const filePath = path.join(uploadDir, filename);

  try {
    await unlink(filePath);
  } catch (error) {
    const fsError = error as NodeJS.ErrnoException;

    // Already gone - nothing to do
    if (fsError.code === "ENOENT") {
      return;
    }
    throw error;
  }
}
