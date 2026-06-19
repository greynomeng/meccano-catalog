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

function toFrontend(raw: RawPart): Part & { _id: string } {
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
      const responseponse = await fetch(`/api/parts/${params}`);
      if (!responseponse.ok) {
        throw new Error(await responseponse.text());
      }
      const data: RawPart[] = await responseponse.json();
      setParts(data.map(toFrontend));
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

  async function addPart(part: Part) {
    try {
      const responseponse = await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(part)
      });
      if (!responseponse.ok) {
        throw new Error(await responseponse.text());
      }
      const raw: RawPart = await responseponse.json();
      setParts((prev) => [toFrontend(raw), ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add part");
    }
  }

  async function updatePart(part: Part & { _id: string }) {
    try {
      const response = await fetch(`/api/parts/${part._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(part)
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const raw: RawPart = await response.json();
      setParts((prev) => prev.map((p) => (p._id === part._id ? toFrontend(raw) : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update part");
    }
  }

  return { parts, loaded, error, addPart, updatePart, refetch: fetchParts };
}
