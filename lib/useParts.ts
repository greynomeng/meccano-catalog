"use client";

import { useCallback, useEffect, useState } from "react";
import { Part } from "./types";

// Strip Mongo internals (_id, __v, etc.) before storing in state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPart(raw: any): Part {
  return {
    partId: raw.partId,
    name: raw.name,
    category: raw.category,
    qty: raw.qty,
    unit: raw.unit,
    note: raw.note ?? ""
  };
}

export function useParts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = useCallback(async (category?: string, q?: string) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") {
        params.set("category", category);
      }
      if (q) {
        params.set("q", q);
      }
      const res = await fetch(`/api/parts/${params}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      setParts(data.map(toPart));
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
      setError(err instanceof Error ? err.message : "Failed to add part");
    }
  }

  async function updatePart(part: Part) {
    try {
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
      setError(err instanceof Error ? err.message : "Failed to update part");
    }
  }

  async function deletePart(partId: string) {
    try {
      const res = await fetch(`/api/parts/${partId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setParts((prev) => prev.filter((p) => p.partId !== partId));
    } catch (err) {
      console.error("deletePart-err:", err);
      setError(err instanceof Error ? err.message : "Failed to delete part");
    }
  }

  async function adjustQty(partId: string, delta: number) {
    const part = parts.find((p) => p.partId === partId);
    if (!part) return;
    const qty = Math.max(0, part.qty + delta);
    try {
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
      setError(err instanceof Error ? err.message : "Failed to adjust quantity");
    }
  }

  return { parts, loaded, error, addPart, updatePart, deletePart, adjustQty, refetch: fetchParts };
}
