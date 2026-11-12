// app\api\parts\[id]\route.ts

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { deletePartImage } from "@/lib/imageUpload";
import { CATEGORIES, UNITS } from "@/lib/types";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/parts/[id]
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    console.log(">>> id:", id);
    const part = await prisma.part.findUnique({
      where: { partId: id },
    });

    if (!part) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(part);
  } catch (err) {
    console.error("GET /api/parts/[id]", err);

    return NextResponse.json(
      { error: `Failed to fetch part: ${err}` },
      { status: 500 },
    );
  }
}

// PATCH /api/parts/[id] - partial update (name, category, qty, unit, note)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { ...fields } = body;

    /*
     * Get the existing part first so that we know
     * which image needs to be removed if a new one
     * replaces it.
     */
    const existingPart = await prisma.part.findUnique({
      where: { partId: id },
    });

    if (!existingPart) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    // Validate supplied fields.
    if (
      fields.name !== undefined &&
      (typeof fields.name !== "string" || !fields.name.trim())
    ) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (fields.name !== undefined && fields.name.length > 120) {
      return NextResponse.json(
        { error: "Name must be 120 characters or fewer" },
        { status: 400 },
      );
    }

    if (
      fields.description !== undefined &&
      (typeof fields.description !== "string" ||
        fields.description.length > 120)
    ) {
      return NextResponse.json(
        { error: "Description must be 120 characters or fewer" },
        { status: 400 },
      );
    }

    if (
      fields.category !== undefined &&
      !CATEGORIES.includes(fields.category)
    ) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (
      fields.qty !== undefined &&
      (!Number.isInteger(fields.qty) || fields.qty < 0)
    ) {
      return NextResponse.json(
        { error: "Quantity must be a non-negative integer" },
        { status: 400 },
      );
    }

    if (fields.unit !== undefined && !UNITS.includes(fields.unit)) {
      return NextResponse.json({ error: "Invalid unit" }, { status: 400 });
    }

    if (
      fields.note !== undefined &&
      (typeof fields.note !== "string" || fields.note.length > 300)
    ) {
      return NextResponse.json(
        { error: "Note must be 300 characters or fewer" },
        { status: 400 },
      );
    }

    if (fields.imageUrl !== undefined && typeof fields.imageUrl !== "string") {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    // Trim the name if supplied.
    if (fields.name !== undefined) {
      fields.name = fields.name.trim();
    }

    const oldImageUrl = existingPart.imageUrl || "";

    // Update the database first.
    const part = await prisma.part.update({
      where: { partId: id },
      data: fields,
    });

    if (!part) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete the old physical image only after successful update.
    const newImageUrl = part.imageUrl || "";

    if (oldImageUrl && oldImageUrl !== newImageUrl) {
      try {
        await deletePartImage(oldImageUrl);
      } catch (imageError) {
        /*
         * The database update succeeded, so don't
         * report the entire PATCH as failed just
         * because cleanup failed.
         *
         * The old file can be cleaned up manually
         * or by a future cleanup process.
         */
        console.error("Failed to delete old part image:", imageError);
      }
    }

    return NextResponse.json(part);
  } catch (err: unknown) {
    console.error("PATCH /api/parts/[id]", err);

    const message =
      err instanceof Error ? err.message : "Failed to update part";

    console.error("PATCH /api/parts/[id]", err);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/parts/[id]
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    /*
     * Find the part first so we can remember
     * its image URL.
     */
    const part = await prisma.part.findUnique({ where: { partId: id } });

    if (!part) {
      return NextResponse.json({ error: "Part not dound." }, { status: 404 });
    }

    const imageUrl = part.imageUrl || "";

    /*
     * Delete the MongoDB document first.
     */
    await await prisma.part.delete({ where: { partId: id } });

    /*
     * Then remove the physical image.
     */
    if (imageUrl) {
      try {
        await deletePartImage(imageUrl);
      } catch (imageError) {
        /*
         * The Part has already been deleted.
         * Log the cleanup failure rather than
         * pretending the Part deletion failed.
         */
        console.error("Failed to delete part image:", imageError);
      }
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("DELETE /api/parts/[id]", err);

    return NextResponse.json(
      { error: `Failed to delete part: ${err}` },
      { status: 500 },
    );
  }
}
