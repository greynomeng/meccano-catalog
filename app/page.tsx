"use client";

import { useState } from "react";

export default function Home() {
  const [error, setError] = useState();
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
            className="grow"
            aria-label="Search parts"
          />
        </label>
        <button className="btn btn-primary">+ Add part</button>
      </div>
    </main>
  );
}
