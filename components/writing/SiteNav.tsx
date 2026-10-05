"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Sits transparent over the dark hero, then turns into a frosted navy
// bar once the visitor starts scrolling.
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="JobMingle"
            height={32}
            width={32}
            style={{ height: 32, width: 32 }}
            className="rounded-full"
            priority
          />
          <span
            className="font-display text-[17px] font-semibold tracking-[-0.03em] text-white"
          >
            JobMingle
          </span>
        </a>
      </div>
    </header>
  );
}
