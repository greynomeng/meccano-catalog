// app\api\parts\route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { CATEGORIES, UNITS } from "@/lib/types";

// GET /api/parts — list all parts, optional ?category= and ?q= filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const parts = await prisma.part.findMany({
      where: {
        ...(category && category !== "All" ? { category } : {}),
        ...(query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                  },
                },
              ],
            }
          : {}),
      },
    });

    return NextResponse.json(parts);
  } catch (err) {
    console.error("[GET /api/parts]", err);

    const message =
      err instanceof Error ? err.message : "An unknown error has occurred";

    return NextResponse.json(
      {
        error: `Failed to fetch parts: ${message}`,
      },
      { status: 500 },
    );
  }
}

// POST /api/parts - create a new part
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      partId,
      name,
      description = "",
      category,
      qty = 0,
      unit = "pcs",
      note = "",
      imageUrl = "",
    } = body;

    if (!partId?.trim()) {
      return NextResponse.json(
        { error: "Part ID is required" },
        { status: 400 },
      );
    }

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!UNITS.includes(unit)) {
      return NextResponse.json({ error: "Invalid unit" }, { status: 400 });
    }

    if (!Number.isInteger(qty) || qty < 0) {
      return NextResponse.json(
        { error: "Quantity must be a non-negative integer" },
        { status: 400 },
      );
    }

    const part = await prisma.part.create({
      data: {
        partId: partId.trim(),
        name: name.trim(),
        description,
        category,
        qty,
        unit,
        note,
        imageUrl,
      },
    });

    return NextResponse.json(part, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/parts]", err);

    const message =
      err instanceof Error ? err.message : "Failed to create part";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
