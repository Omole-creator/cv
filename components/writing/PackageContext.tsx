"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import type { PackageChoice } from "@/lib/writingPackages";

type Ctx = {
  choice: PackageChoice | "";
  setChoice: (choice: PackageChoice) => void;
};

const PackageContext = createContext<Ctx | null>(null);

export function PackageProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<PackageChoice | "">("");
  return (
    <PackageContext.Provider value={{ choice, setChoice }}>{children}</PackageContext.Provider>
  );
}

export function usePackage() {
  const ctx = useContext(PackageContext);
  if (!ctx) throw new Error("usePackage must be used inside <PackageProvider>");
  return ctx;
}

export function scrollToApply() {
  document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Package card buttons don't take payment. They preselect the package in
// the form at the bottom of the page and scroll down to it.
export function ChoosePackageButton({
  pkg,
  label,
  featured,
}: {
  pkg: PackageChoice;
  label: string;
  featured?: boolean;
}) {
  const { setChoice } = usePackage();
  return (
    <button
      type="button"
      data-testid={`choose-${pkg}`}
      onClick={() => {
        setChoice(pkg);
        scrollToApply();
      }}
      className={`w-full rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
        featured ? "bg-gold text-ink-900" : "bg-ink-900 text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function ApplyButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={scrollToApply}
      className={`inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-base font-semibold text-ink-900 shadow-card transition-opacity hover:opacity-90 ${className}`}
    >
      {label}
    </button>
  );
}
