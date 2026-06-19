"use client";

interface Props {
  partName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDelete({ partName, onConfirm, onClose }: Props) {
  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-semibold text-lg">Delete part?</h3>
        <p className="py-3 text-sm text-base-content/70">
          <span className="font-medium text-base-content">{partName}</span> will be permanently
          removed from your inventory.
        </p>
        <div className="modal-action">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-sm btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </dialog>
  );
}
