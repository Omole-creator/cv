import Uploader from "./Uploader";

type Props = {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
  statusLine: string;
  fileName?: string;
};

export default function Hero(props: Props) {
  return (
    <section id="top" className="mx-auto max-w-3xl px-5 pb-14 pt-16 text-center sm:pt-24">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-600">
        Free CV audit
      </p>
      <h1 className="font-display text-4xl font-medium leading-tight text-ink-900 sm:text-5xl">
        Is your CV holding you back from your dream career?
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-ink-400">
        Upload it and we&apos;ll check it against the same 15 point standard we use to
        write CVs professionally, no signup, nothing saved anywhere.
      </p>
      <div className="mt-8">
        <Uploader {...props} />
      </div>
    </section>
  );
}
