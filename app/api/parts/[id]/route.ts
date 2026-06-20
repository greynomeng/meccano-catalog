import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import PartModel from "@/lib/PartModel";

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

    const part = await PartModel.findOneAndUpdate(
      { partId: id },
      { $set: fields },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!part) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(part);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update part";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/parts/[id]
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;
    const part = PartModel.findOneAndDelete({ partId: id });
    if (!part) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("DELETE /api/parts/[id]", err);
    return NextResponse.json({ error: `Failed to delete part: ${err}` });
  }
}
