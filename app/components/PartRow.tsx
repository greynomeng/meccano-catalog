// components/PartRow.tsx

"use client";

import Image from "next/image";

import { Part, CATEGORY_COLORS } from "@/lib/types";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

interface Props {
  part: Part;
  onEdit: () => void;
  onDelete: () => void;
  onAdjust: (id: string, delta: number) => void;
}

export default function PartRow({ part, onEdit, onDelete, onAdjust }: Props) {
  const color = CATEGORY_COLORS[part.category] ?? "#888";

  return (
    <div className="card card-compact bg-base-100 shadow-sm border border-base-200 hover:border-base-300 transition-colors">
      <div className="card-body flex-row items-center gap-3">
        {/* Image */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-base-200 bg-base-200 shrink-0">
          {part.imageUrl ? (
            <Image
              src={part.imageUrl}
              alt={part.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base-content/25 text-xs">
              —
            </div>
          )}
        </div>
        {/* Category dot */}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {part.name} {part.description && `(${part.description})`}
          </p>
          <p className="text-xs text-base-content/50 mt-0.5 font-mono">
            {part.partId} . {part.category}
          </p>
          {part.note && (
            <p className="text-xs text-base-content/40 italic mt-0.5">
              {part.note}
            </p>
          )}
        </div>

        {/* Qty controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            className="bin btn-xs byn-ghost btn-square"
            onClick={() => onAdjust(part.partId, -1)}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-sm font-semibold tabular-nums w-9 text-center">
            {part.qty}
          </span>
          <button
            className="btn btn-xs btn-ghost btn-square"
            onClick={() => onAdjust(part.partId, 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
          <span className="text-xs text-base-content/40 w-6">{part.unit}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1 shrink-0">
          <button
            className="btn btn-xs btn-ghost btn-square me-4"
            onClick={onEdit}
            aria-label="Edit part"
            title="Edit"
          >
            <BsPencilSquare size={20} className="text-success" />
          </button>
          <button
            className="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10"
            onClick={onDelete}
            aria-label="Delete part"
            title="Delete"
          >
            <BsTrash size={20} className="text-error" />
          </button>
        </div>
      </div>
    </div>
  );
}
