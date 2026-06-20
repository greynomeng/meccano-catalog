import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import PartModel from "@/lib/PartModel";
// import { DEFAULT_PARTS } from "@/lib/types";

// GET /api/parts — list all parts, optional ?category= and ?q= filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (category && category !== "All") {
      filter.category = category;
    }
    if (query) {
      filter.$text = { $search: query };
    }

    const parts = await PartModel.find(filter).sort({ name: 1 }).lean();

    // Seed with defaults if the collection is empty
    // if (parts.length === 0 && !category && !query) {
    //   await PartModel.insertMany(DEFAULT_PARTS.map((part) => ({ ...part, partId: part.id })));
    //   const seeded = await PartModel.find({}).sort({ name: 1 }).lean();
    //   return NextResponse.json(seeded);
    // }
    return NextResponse.json(parts);
  } catch (err) {
    console.error("[GET /api/parts]", err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error has occurred";
    return NextResponse.json({ error: `Failed to fetch parts: ${errorMessage}` });
  }
}

// POST /api/parts - create a new part
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const part = await PartModel.create(body);
    return NextResponse.json(part, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create part";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
