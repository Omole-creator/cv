"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ArrowRight } from "lucide-react";
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
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        featured
          ? "w-shine bg-gold text-ink-900 hover:shadow-[0_8px_30px_-6px_rgba(244,203,25,0.6)]"
          : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
      }`}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

export function ApplyButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={scrollToApply}
      className={`w-shine group inline-flex items-center justify-center gap-2.5 rounded-full bg-gold px-7 py-4 text-base font-semibold text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(244,203,25,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      {label}
      <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}
