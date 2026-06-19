"use client";

import { useEffect, useState } from "react";
import { Part, CATEGORIES, UNITS } from "@/lib/types";

interface Props {
  initial: Part;
  mode: "add" | "edit";
  uniqueNames?: string[];
  onSave: (p: Part) => void;
  onClose: () => void;
}

export default function PartModal({ initial, mode, uniqueNames = [], onSave, onClose }: Props) {
  const [form, setForm] = useState(initial);
  console.log(uniqueNames);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(initial);
  }, [initial]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.partId.trim() || !form.name.trim()) return;
    onSave(form);
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
          aria-label="Close"
        >
          X
        </button>
        <h3 className="font-semibold text-lg mb-4">{mode === "add" ? "New part" : "Edit part"}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Part no.</span>
              </div>
              <input
                className="input input-bordered input-sm"
                type="text"
                value={form.partId}
                onChange={(e) => set("partId", e.target.value)}
                placeholder="e.g. MEK-001"
                required
                autoFocus={mode === "add"}
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Category</span>
              </div>
              <select
                className="select select-bordered select-sm"
                value={form.category}
                onChange={(e) => set("category", e.target.value as Part["category"])}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Part name</span>
            </div>
            <input
              className="input input-bordered input-sm"
              type="text"
              value={form.name}
              list="part-names-list"
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Angle Girder 48.5mm"
              required
              autoFocus={mode === "edit"}
            />
            <datalist id="part-names-list">
              {uniqueNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Quantity</span>
              </div>
              <input
                className="input input-bordered input-sm"
                type="number"
                min={0}
                value={form.qty}
                onChange={(e) => set("qty", parseInt(e.target.value) || 0)}
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Unit</span>
              </div>
              <select
                className="select select-bordered select-sm"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
              >
                {UNITS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-control">
            <div className="label">
              <span className="label-text">Note</span>
              <span className="label-text-alt text-base-content/40">optional</span>
            </div>
            <input
              className="input input-bordered input-sm"
              type="text"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="e.g. from set #10030"
            />
          </label>

          <div className="modal-action mt-1">
            <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              {mode === "add" ? "Add part" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
