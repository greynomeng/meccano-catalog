// lib/useParts.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { Part } from "./types";

// Strip Mongo internals (_id, __v, etc.) before storing in state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPart(raw: any): Part {
  return {
    partId: raw.partId,
    name: raw.name,
    description: raw.description,
    category: raw.category,
    qty: raw.qty,
    unit: raw.unit,
    note: raw.note ?? "",
    imageUrl: raw.imageUrl ?? ""
  };
}

export function useParts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = useCallback(async (category?: string, q?: string) => {
    try {
      setError(null);

      const params = new URLSearchParams();

      if (category && category !== "All") {
        params.set("category", category);
      }

      if (q) {
        params.set("q", q);
      }

      const query = params.toString();

      const res = await fetch(query ? `/api/parts/${query}` : "/api/parts");

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      setParts(data.map(toPart));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load parts.";

      setError(message);
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
      setError(null);

      const res = await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(part)
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const created = toPart(await res.json());

      setParts((prev) => [created, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add part.";

      setError(message);

      throw err;
    }
  }

  async function updatePart(part: Part) {
    try {
      setError(null);

      const res = await fetch(`/api/parts/${part.partId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(part)
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const updated = toPart(await res.json());

      setParts((prev) => prev.map((p) => (p.partId === updated.partId ? updated : p)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update part.";

      setError(message);

      throw err;
    }
  }

  async function deletePart(partId: string) {
    try {
      setError(null);

      const res = await fetch(`/api/parts/${partId}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setParts((prev) => prev.filter((p) => p.partId !== partId));
    } catch (err) {
      console.error("deletePart-err:", err);

      const message = err instanceof Error ? err.message : "Failed to delete part.";

      setError(message);

      throw err;
    }
  }

  async function adjustQty(partId: string, delta: number) {
    const part = parts.find((p) => p.partId === partId);

    if (!part) {
      return;
    }

    const qty = Math.max(0, part.qty + delta);

    try {
      setError(null);

      const res = await fetch(`/api/parts/${partId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const updated: Part = await res.json();

      setParts((prev) => prev.map((p) => (p.partId === partId ? updated : p)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to adjust quantity.";

      setError(message);
    }
  }

  return { parts, loaded, error, addPart, updatePart, deletePart, adjustQty, refetch: fetchParts };
}
