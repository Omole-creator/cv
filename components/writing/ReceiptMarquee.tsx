import Image from "next/image";

// Real transfer receipts from clients, cropped to the receipt card with the
// sender's name blurred (see public/writing/receipts). Widths match the
// files; the browser scales them to the card width.
const RECEIPTS = [
  { n: 1, h: 764 },
  { n: 2, h: 656 },
  { n: 3, h: 724 },
  { n: 4, h: 776 },
  { n: 5, h: 774 },
  { n: 6, h: 506 },
  { n: 7, h: 772 },
  { n: 8, h: 772 },
  { n: 9, h: 772 },
  { n: 10, h: 448 },
];

// Two copies of the strip side by side; the track slides one copy's width
// to the right and loops, so the motion never shows a seam.
export default function ReceiptMarquee() {
  return (
    <div data-testid="receipt-marquee" className="w-marquee mt-12">
      <div className="w-marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-5 pr-5">
            {RECEIPTS.map(({ n, h }) => (
              <li
                key={n}
                className="w-[220px] shrink-0 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:w-[240px]"
              >
                <Image
                  src={`/writing/receipts/receipt-${n}.jpg`}
                  alt={copy === 0 ? "A client's bank transfer receipt to JobMingle Limited" : ""}
                  width={560}
                  height={h}
                  sizes="240px"
                  className="h-auto w-full rounded-xl"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
