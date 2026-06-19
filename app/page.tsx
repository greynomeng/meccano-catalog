"use client";

import { Part, CATEGORIES, CATEGORY_COLORS } from "@/lib/types";
import { useParts } from "@/lib/useParts";
import { useState } from "react";
import PartRow from "./components/PartRow";
import PartModal from "./components/PartModal";

const ALL = "All";
type PartWithId = Part & { _id: string };

export default function Home() {
  const { parts, loaded, error, addPart, updatePart, deletePart, adjustQty } = useParts();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(ALL);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; part: PartWithId } | null>(null);

  function blankPart(): PartWithId {
    return {
      _id: "",
      id: "",
      name: "",
      category: "Structural",
      qty: 1,
      unit: "pcs",
      note: ""
    };
  }

  const filtered = parts.filter((part) => {
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      part.name.toLowerCase().includes(query) ||
      part.id.toLowerCase().includes(query) ||
      part.category.toLowerCase().includes(query);
    return matchSearch && (catFilter === ALL || part.category === catFilter);
  });

  async function handleSave(part: PartWithId) {
    if (modal?.mode === "add") {
      await addPart(part);
    } else {
      await updatePart(part);
    }
    setModal(null);
  }

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
            <div className="stat-value text-lg">354</div>
            <div className="stat-desc">Types</div>
          </div>
          <div className="stat bg-base-100 rounded-box py-2 px-4 shadow-sm">
            <div className="stat-value text-lg">78</div>
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
                : "badge-ghost border-base-300 hover: border-base-content/30"
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
          <></>
        ) : (
          filtered.map((part) => (
            <PartRow
              key={part._id}
              part={part}
              onEdit={() => {
                setModal({ mode: "edit", part: { ...part } });
              }}
              onDelete={() => deletePart(part._id)}
              onAdjust={(_, delta) => adjustQty(part._id, delta)}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <PartModal
          initial={modal.part}
          mode={modal.mode}
          onSave={(part) => handleSave(part as PartWithId)}
          onClose={() => setModal(null)}
        />
      )}
    </main>
  );
}
