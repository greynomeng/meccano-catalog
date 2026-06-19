"use client";

import { useEffect, useState } from "react";
import { Part } from "@/lib/types";

interface Props {
  initial: Part & { _id: string };
  mode: "add" | "edit";
  onSave: (part: Part & { _id: string }) => void;
  onClose: () => void;
}

export default function PartModal({ initial, mode, onSave, onClose }: Props) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(initial);
  }, [initial]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handlkeSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim()) return;
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
      </div>
    </dialog>
  );
}
