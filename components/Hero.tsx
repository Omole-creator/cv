import Uploader from "./Uploader";

type Props = {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
  statusLine: string;
  fileName?: string;
};

export default function Hero(props: Props) {
  return (
    <section
      id="top"
      className="relative mx-auto max-w-3xl overflow-hidden px-5 pb-14 pt-16 text-center sm:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,#F4CB19,transparent)] opacity-50 blur-3xl"
      />

      <span className="animate-fade-in inline-flex items-center gap-1.5 rounded-full border border-gold-600/30 bg-gold/15 px-4 py-1.5 text-sm font-semibold text-ink-900">
        Free CV audit
      </span>

      <h1 className="animate-fade-in [animation-delay:100ms] font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 opacity-0 sm:text-5xl md:text-6xl">
        Most CVs get rejected before a human ever reads them.
      </h1>

      <p className="animate-fade-in [animation-delay:200ms] mx-auto mt-5 max-w-xl text-lg text-ink-400 opacity-0">
        Upload it and we&apos;ll run the same 15-point industry standard we use to write
        CVs for paying clients. No signup required, and your CV is never saved, because
        we respect your privacy.
      </p>

      <div className="animate-fade-up [animation-delay:300ms] mt-8 opacity-0">
        <Uploader {...props} />
      </div>
    </section>
  );
}
