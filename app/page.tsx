"use client";

import { Part, CATEGORIES, CATEGORY_COLORS } from "@/lib/types";
import { useParts } from "@/lib/useParts";
import { useState } from "react";
import PartRow from "./components/PartRow";
import PartModal from "./components/PartModal";
import ConfirmDelete from "./components/ConfirmDelete";

const ALL = "All";

export default function Home() {
  const { parts, loaded, error, addPart, updatePart, deletePart, adjustQty } = useParts();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(ALL);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; part: Part } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Part | null>(null);

  const blankPart = (): Part => ({
    partId: "",
    name: "",
    description: "",
    category: "",
    qty: 1,
    unit: "pcs",
    note: ""
  });

  const filtered = parts.filter((part) => {
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      part.name.toLowerCase().includes(query) ||
      part.partId.toLowerCase().includes(query) ||
      part.category.toLowerCase().includes(query);
    return matchSearch && (catFilter === ALL || part.category === catFilter);
  });

  async function handleSave(p: Part) {
    if (modal?.mode === "add") {
      await addPart(p);
    } else {
      await updatePart(p);
    }
    setModal(null);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    await deletePart(confirmDelete.partId);
    setConfirmDelete(null);
  }

  const totalQty = parts.reduce((a, p) => a + p.qty, 0);

  // 1. Extract just the names and strip out duplicates using a Set
  const uniqueNames = Array.from(new Set(parts.map((part) => part.name)));
  console.log(uniqueNames);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <div className="w-6 h-6 rounded-full border-2 border-primary-content flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-content" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold leading-tight">Meccano Inventory</h1>
            <p className="text-xl text-base-content/50">Parts catalogue &amp; stock</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="stat bg-base-100 rounded-box py-2 px-4 shadow-sm">
            <div className="stat-value text-lg">{parts.length}</div>
            <div className="stat-desc">Types</div>
          </div>
          <div className="stat bg-base-100 rounded-box py-2 px-4 shadow-sm">
            <div className="stat-value text-lg">{totalQty.toLocaleString()}</div>
            <div className="stat-desc">Total</div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error mb-4 text-md py-2">
          <span>⚠ {error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <label className="input input-bordered flex items-center gap-2 flex-1 min-w-40">
          <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search parts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow"
            aria-label="Search parts"
          />
        </label>
        <button
          className="btn btn-primary"
          onClick={() => setModal({ mode: "add", part: blankPart() })}
        >
          + Add part
        </button>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Filter by category">
        {[ALL, ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`badge badge-xl gap-1.5 cursor-pointer border transition-colors ${
              catFilter === cat
                ? "badge-primary border-primary"
                : "badge-ghost border-base-300 hover:"
            }`}
          >
            {cat !== ALL && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }}
              />
            )}
            {cat}
          </button>
        ))}
      </div>

      {/* Parts List */}
      <div className="flex flex-col gap-2" aria-label="Parts list">
        {!loaded ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-base-content/40">
            <p className="text-2xl mb-2">⊘</p>
            <p className="text-sm">No parts found</p>
          </div>
        ) : (
          filtered.map((p) => (
            <PartRow
              key={p.partId}
              part={p}
              onEdit={() => setModal({ mode: "edit", part: { ...p } })}
              onDelete={() => setConfirmDelete(p)}
              onAdjust={adjustQty}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <PartModal
          initial={modal.part}
          mode={modal.mode}
          uniqueNames={uniqueNames}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmDelete
          partName={`${confirmDelete.partId} – ${confirmDelete.name}`}
          onConfirm={handleConfirmDelete}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </main>
  );
}
