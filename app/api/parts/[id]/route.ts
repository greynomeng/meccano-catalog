// app\api\parts\[id]\route.ts

import { NextRequest, NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import PartModel from "@/lib/PartModel";
import { deletePartImage } from "@/lib/imageUpload";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/parts/[id]
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();

    const { id } = await params;
    const part = await PartModel.findOne({ partId: id }).lean();

    if (!part) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(part);
  } catch (err) {
    console.error("GET /api/parts/[id]", err);
    return NextResponse.json({ error: `Failed to fetch part: ${err}` });
  }
}

// PATCH /api/parts/[id] - partial update (name, category, qty, unit, note)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Strip Mongo internals so they never land in $set
    const { _id, __v, createdAt, updatedAt, ...fields } = body;

    /*
     * Get the existing part first so that we know
     * which image needs to be removed if a new one
     * replaces it.
     */
    const existingPart = await PartModel.findOne({ partId: id }).lean();

    if (!existingPart) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const oldImageUrl = existingPart.imageUrl || "";

    /*
     * Update MongoDB first.
     *
     * This is important: don't delete the old
     * physical image until the database update
     * has succeeded.
     */

    const part = await PartModel.findOneAndUpdate(
      { partId: id },
      { $set: fields },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!part) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    /*
     * If the image was replaced, remove the
     * previous physical image.
     */
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
    const message =
      err instanceof Error ? err.message : "Failed to update part";

    console.error("PATCH /api/parts/[id]", err);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/parts/[id]
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();

    const { id } = await params;

    /*
     * Find the part first so we can remember
     * its image URL.
     */
    const part = await PartModel.findOne({ partId: id });

    if (!part) {
      return NextResponse.json({ error: "Part not dound." }, { status: 404 });
    }

    const imageUrl = part.imageUrl || "";

    /*
     * Delete the MongoDB document first.
     */
    await PartModel.findOneAndDelete({ partId: id });

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
