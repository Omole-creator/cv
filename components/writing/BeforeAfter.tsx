"use client";

import Image from "next/image";
import { useState } from "react";

type Shot = { src: string; w: number; h: number };

export default function BeforeAfter({
  name,
  before,
  after,
}: {
  name: string;
  before: Shot;
  after: Shot;
}) {
  const [showAfter, setShowAfter] = useState(true);
  const shots = [
    ["Before", before],
    ["After", after],
  ] as const;

  return (
    <div>
      <div
        role="tablist"
        aria-label={`${name}'s LinkedIn profile`}
        className="relative mx-auto mb-4 grid w-52 grid-cols-2 rounded-full bg-ink-900/[0.06] p-1 font-mono text-xs uppercase tracking-wider"
      >
        <span
          aria-hidden
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink-900 transition-transform duration-300 ${
            showAfter ? "translate-x-full" : ""
          }`}
        />
        {shots.map(([label]) => {
          const active = (label === "After") === showAfter;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setShowAfter(label === "After")}
              className={`relative z-10 rounded-full py-1.5 transition-colors ${
                active ? "text-white" : "text-ink-400 hover:text-ink-900"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="grid">
        {shots.map(([label, shot]) => {
          const active = (label === "After") === showAfter;
          return (
            <Image
              key={label}
              src={shot.src}
              alt={`${name}'s LinkedIn profile ${label.toLowerCase()} JobMingle rebuilt it`}
              width={shot.w}
              height={shot.h}
              aria-hidden={!active}
              className={`col-start-1 row-start-1 w-full self-center rounded-xl ring-1 ring-ink-900/10 transition-all duration-500 ${
                active ? "opacity-100" : "pointer-events-none scale-[0.98] opacity-0"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
