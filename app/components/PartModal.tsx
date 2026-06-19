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
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Part No.</legend>
                <input
                  className="input input-bordered input-sm"
                  type="text"
                  value={form.partId}
                  onChange={(e) => set("partId", e.target.value)}
                  placeholder="e.g. 12B"
                  required
                  autoFocus={mode === "add"}
                />
              </fieldset>
            </label>

            <label className="form-control">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Category</legend>
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
              </fieldset>
            </label>
          </div>

          <label className="form-control">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Part name</legend>
              <input
                className="input input-bordered input-sm w-full"
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
            </fieldset>
          </label>

          <label className="form-control">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Description</legend>
              <input
                className="input input-bordered input-sm w-full"
                type="text"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="e.g. 5-hole, 12 cm"
              />
            </fieldset>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="form-control">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Quantity</legend>

                <input
                  className="input input-bordered input-sm"
                  type="number"
                  min={0}
                  value={form.qty}
                  onChange={(e) => set("qty", parseInt(e.target.value) || 0)}
                />
              </fieldset>
            </label>

            <label className="form-control">
              <fieldset>
                <legend className="fieldset-legend">Unit</legend>
                <select
                  className="select select-bordered select-sm"
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                >
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </fieldset>
            </label>
          </div>

          <label className="form-control">
            <fieldset>
              <legend className="fieldset-legend">Note</legend>
              <input
                className="input input-bordered input-sm w-full"
                type="text"
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="e.g. from set #10030"
              />
              <p className="label">Optional</p>
            </fieldset>
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
