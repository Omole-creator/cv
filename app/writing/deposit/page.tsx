import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import DepositCard from "@/components/writing/DepositCard";
import { FormFallback } from "@/components/writing/WritingForm";
import ReceiptMarquee from "@/components/writing/ReceiptMarquee";

export const metadata: Metadata = {
  title: "Pay Your Deposit | JobMingle",
  description: "Pay your deposit to JobMingle Limited and send us the receipt on WhatsApp to get started.",
  robots: { index: false },
};

// Step 2 of the /writing form. Reached from WritingForm with the answers in
// the query string; see DepositCard.
export default function DepositPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-ink-900 pb-16">
      <div aria-hidden className="w-grid-bg absolute inset-0" />
      <div aria-hidden className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]" />

      <header className="relative mx-auto flex h-16 max-w-6xl items-center px-5">
        <Link href="/writing" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="JobMingle"
            height={32}
            width={32}
            style={{ height: 32, width: 32 }}
            className="rounded-full"
            priority
          />
          <span className="font-display text-[17px] font-semibold tracking-[-0.03em] text-white">JobMingle</span>
        </Link>
      </header>

      <div className="relative mx-auto mt-6 max-w-xl px-5">
        <Suspense fallback={<FormFallback />}>
          <DepositCard />
        </Suspense>
      </div>

      <div className="relative mt-14">
        <p className="px-5 text-center font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">
          Real receipts from our clients
        </p>
        <p className="mx-auto mt-2 max-w-md px-5 text-center text-sm text-white/70">
          They all sent money to JobMingle Limited, just like you.
        </p>
        <ReceiptMarquee />
      </div>
    </main>
  );
}
