// src/lib/constants.ts

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const PART_IMAGE_UPLOAD_DIR = "public/uploads/parts";

export const PART_IMAGE_URL_PREFIX = "/uploads/parts";
