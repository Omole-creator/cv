"use client";

import { useEffect } from "react";

// One observer for the whole page: anything marked data-reveal gets
// .is-in when it scrolls into view, which drives the fade-ups and the
// highlighter sweeps in globals.css.
export default function ScrollFx() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );
    els.forEach((el) => {
      // Anything already above the fold (or scrolled past, e.g. after a
      // jump to the form) shows at once instead of waiting to fade in.
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
