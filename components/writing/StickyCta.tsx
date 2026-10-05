"use client";

import { useEffect, useState } from "react";
import { scrollToApply } from "./PackageContext";

// Mobile-only bar that keeps the form one tap away on a long page. It shows
// once the hero is out of view and hides again when the form is on screen.
export default function StickyCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("apply");
    if (!hero || !form) return;

    const heroObserver = new IntersectionObserver(([e]) => setHeroGone(!e.isIntersecting));
    const formObserver = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting));
    heroObserver.observe(hero);
    formObserver.observe(form);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  if (!heroGone || formVisible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
      <button
        type="button"
        onClick={scrollToApply}
        className="w-full rounded-full bg-gold px-5 py-3.5 text-sm font-semibold text-ink-900 shadow-[0_10px_30px_-6px_rgba(6,13,41,0.45)]"
      >
        Yes, I want more interview invites
      </button>
    </div>
  );
}
