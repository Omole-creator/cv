import Image from "next/image";

const LINKS = [
  { href: "#how-it-works", label: "How it Works" },
  { href: "#about", label: "About JobMingle" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/5 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="JobMingle"
            height={40}
            width={40}
            style={{ height: 40, width: 40 }}
            className="rounded-full"
            priority
          />
          <span className="font-display text-lg font-medium text-ink-900">JobMingle</span>
        </a>
        <nav className="hidden gap-7 text-sm font-medium text-ink-600 sm:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-ink-900">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-ink-900/15 px-4 py-1.5 text-sm font-medium text-ink-900 transition-colors hover:border-ink-900/40 sm:hidden"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
