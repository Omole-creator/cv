import WhatsAppButton from "./WhatsAppButton";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-ink-900/10 bg-white py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-5 text-center">
        <p className="font-display text-lg font-medium text-ink-900">
          Have a question first?
        </p>
        <p className="max-w-md text-sm text-ink-400">
          Message us directly, no form, no waiting on a reply to an email that never
          comes.
        </p>
        <WhatsAppButton />
        <p className="mt-6 text-xs text-ink-400">
          © {new Date().getFullYear()} JobMingle. Career Growth Audit.
        </p>
      </div>
    </footer>
  );
}
