"use client";

import { MessageCircle } from "lucide-react";
import { buildGeneralMessage, GENERAL_NUMBER, generateWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppButton({ className = "" }: { className?: string }) {
  const href = generateWhatsAppLink(GENERAL_NUMBER, buildGeneralMessage());

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="general-whatsapp-cta"
      className={`inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900/40 ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      Chat on WhatsApp
    </a>
  );
}
