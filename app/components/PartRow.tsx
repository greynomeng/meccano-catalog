"use client";

import { Part, CATEGORY_COLORS } from "@/lib/types";

interface Props {
  part: Part & { _id: string };
  onEdit: () => void;
  onDelete: () => void;
  onAdjust: (id: string, delta: number) => void;
}

export default function PartRow({ part, onEdit, onDelete, onAdjust }: Props) {
  const color = CATEGORY_COLORS[part.category] ?? "#888";

  return (
    <div className="card card-compact bg-base-100 shadow-sm border border-base-200 hover:border-base-300 transition-colors">
      <div className="card-body flex-row items-center gap-3">
        {/* Category dot */}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text truncate">{part.name}</p>
          <p className="text-xs text-base-content/50 mt-0.5 font-mono">
            {part.id} . {part.category}
          </p>
          {part.note && <p className="text-xs text-base-content/40 italic mt-0.5">{part.note}</p>}
        </div>

        {/* Qty controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            className="bin btn-sm byn-ghost btn-square"
            onClick={() => onAdjust(part._id, -1)}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-sm font-semibold tabular-nums w-9 text-center">{part.qty}</span>
          <button
            className="btn btn-xs btn-ghost btn-square"
            onClick={() => onAdjust(part._id, 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
          <span className="text-xs text-base-content/40 w-6">{part.unit}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1 shrink-0">
          <button
            className="btn btn-xs btn-ghost btn-square"
            onClick={onEdit}
            aria-label="Edit part"
            title="Edit"
          >
            ✎
          </button>
          <button
            className="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10"
            onClick={onDelete}
            aria-label="Delete part"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
