"use client";

import { useRef, useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import Image from "next/image";

type Props = {
  score: number;
  topFindingLabel?: string;
};

export default function ScoreCard({ score, topFindingLabel }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const shareText = [
    `I just scored ${score}/100 on JobMingle's free CV audit.`,
    topFindingLabel ? `Biggest issue it flagged: ${topFindingLabel}.` : "",
    "Check yours: jobmingle.ng",
  ]
    .filter(Boolean)
    .join("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard permission denied; nothing worth surfacing here
    }
  };

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "jobmingle-cv-score.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <div
        ref={cardRef}
        data-testid="score-card"
        className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-ink-900 px-8 py-9 text-center text-white"
      >
        <Image
          src="/logo.jpg"
          alt="JobMingle"
          width={36}
          height={36}
          style={{ width: 36, height: 36 }}
          className="rounded-full"
        />
        <p className="text-sm uppercase tracking-wide text-white/60">CV audit score</p>
        <p className="font-display text-6xl font-medium text-gold">{score}</p>
        <p className="text-sm text-white/70">out of 100</p>
        {topFindingLabel && (
          <p className="mt-1 text-sm text-white/80">{topFindingLabel}</p>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          data-testid="score-card-save"
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium text-ink-900 hover:border-ink-900/40"
        >
          <Download className="h-4 w-4" />
          {saving ? "Saving…" : "Save score card"}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          data-testid="score-card-copy"
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium text-ink-900 hover:border-ink-900/40"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>
    </div>
  );
}
