// component/PartModal.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ALLOWED_IMAGE_TYPES /*MAX_IMAGE_SIZE*/ } from "@/lib/constants";
import { Part, CATEGORIES, UNITS } from "@/lib/types";
import { BsFloppy, BsXCircle } from "react-icons/bs";

interface Props {
  initial: Part;
  mode: "add" | "edit";
  uniqueNames?: string[];
  onSave: (part: Part, imageFile?: File | null) => Promise<void>;
  onClose: () => void;
}

export default function PartModal({
  initial,
  mode,
  uniqueNames = [],
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState<Part>(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(initial);

    setImageFile(null);

    setPreviewUrl(initial.imageUrl || null);
  }, [initial]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function set<K extends keyof Part>(key: K, value: Part[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleImageChange(file: File | null) {
    setImageError(null);

    if (!file) {
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
      )
    ) {
      setImageError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    // if (file.size > MAX_IMAGE_SIZE) {
    //   setImageError("Image must be 5 MB or smaller.");
    //   return;
    // }

    if (previewUrl?.startsWith("blob")) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);

    setImageFile(file);
    setPreviewUrl(url);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.partId.trim() || !form.name.trim()) {
      return;
    }

    if (imageError) {
      return;
    }

    try {
      setSaving(true);

      await onSave(
        { ...form, partId: form.partId.trim(), name: form.name.trim() },
        imageFile,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
          disabled={saving}
          aria-label="Close"
        >
          X
        </button>

        <h3 className="font-semibold text-lg mb-4">
          {mode === "add" ? "New part" : "Edit part"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Part ID */}
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

            {/* Category */}
            <label className="form-control">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Category</legend>
                <select
                  className="select select-bordered select-sm"
                  value={form.category}
                  onChange={(e) =>
                    set("category", e.target.value as Part["category"])
                  }
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

          {/* Part name */}
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

          {/* Description */}
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

          {/* Image */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Image</legend>

            <div className="flex gap-3 item-start">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-base-300 bg-base-200 shrink-0">
                {previewUrl ? (
                  previewUrl.startsWith("blob") ? (
                    <img
                      src={previewUrl}
                      alt="Selected part"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={previewUrl}
                      alt="Part image"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-content/30 text-xs text-center">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0] ?? null)
                  }
                  disabled={saving}
                />

                {/* <p className="text-xs text-base-content/50 mt-1">
                  JPEG, PNG or WebP · max 5 MB
                </p> */}
                <p className="text-xs text-base-content/50 mt-1">
                  JPEG, PNG or WebP
                </p>

                {imageError && (
                  <p className="text-xs text-error mt-1">{imageError}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Quantity */}
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

            {/* Unit */}
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

          {/* Note */}
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
            {/* Cancel button */}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={onClose}
              disabled={saving}
            >
              <BsXCircle />
              Cancel
            </button>

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={saving}
            >
              <BsFloppy />
              {saving && (
                <span className="loading loading-spinner loading-xs" />
              )}
              {mode === "add" ? "Add part" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
