"use client";

import { useCallback, useEffect, useState } from "react";
import { Part } from "./types";

// Shape returned by Mongoose (uses _id, partId instead of id)
interface RawPart {
  _id: string;
  partId: string;
  name: string;
  category: Part["category"];
  qty: number;
  unit: string;
  note: string;
}

function toFrontEnd(raw: RawPart): Part & { _id: string } {
  return {
    _id: raw._id,
    id: raw.partId,
    name: raw.name,
    category: raw.category,
    qty: raw.qty,
    unit: raw.unit,
    note: raw.note
  };
}

export function useParts() {
  const [parts, setParts] = useState<(Part & { _id: string })[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = useCallback(async (category?: string, query?: string) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") {
        params.set("category", category);
      }
      if (query) {
        params.set("q", query);
      }
      const response = await fetch(`/api/parts/${params}`);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data: RawPart[] = await response.json();
      setParts(data.map(toFrontEnd));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load parts");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchParts();
  }, [fetchParts]);

  return { parts, loaded, error, refetch: fetchParts };
}
