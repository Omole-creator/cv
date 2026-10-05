"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Play } from "lucide-react";

// Plays the video right on the page. The full YouTube player only loads
// after a click, so the page stays fast. The YouTube logo in the corner
// is the way out to youtube.com for anyone who wants it.
export default function YouTubeLite({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-ink-900/10">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${title}`}
            data-testid={`play-${id}`}
            className="group absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold"
          >
            <img
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full scale-[1.02] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink-900 shadow-[0_0_0_8px_rgba(244,203,25,0.25)] transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-current" />
              </span>
            </span>
          </button>
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch on YouTube"
            title="Watch on YouTube"
            className="absolute bottom-2.5 right-2.5 rounded-md bg-black/40 p-1.5 backdrop-blur transition-colors hover:bg-black/70"
          >
            <svg viewBox="0 0 28 20" className="h-4 w-[22px]" aria-hidden>
              <path
                fill="#FF0000"
                d="M27.4 3.1A3.5 3.5 0 0 0 25 .6C22.8 0 14 0 14 0S5.2 0 3 .6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9A3.5 3.5 0 0 0 3 19.4c2.2.6 11 .6 11 .6s8.8 0 11-.6a3.5 3.5 0 0 0 2.4-2.5c.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9Z"
              />
              <path fill="#fff" d="m11.2 14.3 7.3-4.3-7.3-4.3v8.6Z" />
            </svg>
          </a>
        </>
      )}
    </div>
  );
}
