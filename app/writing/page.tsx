import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Check, Quote as QuoteIcon, ShieldCheck } from "lucide-react";
import {
  ApplyButton,
  ChoosePackageButton,
  PackageProvider,
} from "@/components/writing/PackageContext";
import { Suspense } from "react";
import WritingForm, { FormFallback } from "@/components/writing/WritingForm";
import StickyCta from "@/components/writing/StickyCta";
import ScrollFx from "@/components/writing/ScrollFx";
import SiteNav from "@/components/writing/SiteNav";
import YouTubeLite from "@/components/writing/YouTubeLite";
import ReceiptMarquee from "@/components/writing/ReceiptMarquee";
import { formatNaira, PACKAGE_WORK, PACKAGES } from "@/lib/writingPackages";

export const metadata: Metadata = {
  title: "A CV That Shows What You're Worth | JobMingle",
  description:
    "Already working and want a better-paying role, or a remote job that pays in dollars? We rewrite your CV to show your results, not just your duties. From ₦10,000, ready in 24 to 48 hours.",
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Body copy. Lines wrapped in ** are the lines a recruiter's highlighter
// would catch: they render bolder and get the gold marker sweep.
function Prose({ lines, className = "", dark }: { lines: string[]; className?: string; dark?: boolean }) {
  return (
    <div
      className={`mx-auto max-w-[640px] space-y-5 text-[17px] leading-[1.75] sm:text-[18px] ${
        dark ? "text-white/85" : "text-ink-600"
      } ${className}`}
    >
      {lines.map((line) =>
        line.startsWith("**") ? (
          <p
            key={line}
            data-reveal
            className={`font-semibold ${dark ? "text-white" : "text-ink-900"}`}
          >
            <span className={dark ? "w-hl-dark" : "w-hl"}>{line.slice(2).replace(/\*\*$/, "")}</span>
          </p>
        ) : (
          <p key={line} data-reveal>
            {line}
          </p>
        )
      )}
    </div>
  );
}

function H2({ children, dark, className = "" }: { children: string; dark?: boolean; className?: string }) {
  return (
    <h2
      data-reveal
      className={`mx-auto max-w-3xl text-balance text-center font-helvetica text-[2rem] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl ${
        dark ? "text-white" : "text-ink-900"
      } ${className}`}
    >
      {titleCase(children)}
    </h2>
  );
}

// Headline style: every word starts with a capital except "and", "in"
// and "a" (unless one of those opens the heading). Hyphenated words get a
// capital on each part, so "90-day" becomes "90-Day".
const LOWER = new Set(["and", "in", "a"]);
function titleCase(text: string): string {
  return text
    .split(" ")
    .map((word, i) =>
      i > 0 && LOWER.has(word.toLowerCase())
        ? word.toLowerCase()
        : word
            .split("-")
            .map((part) => part.replace(/^(["“]?)([a-z])/, (_, q: string, c: string) => q + c.toUpperCase()))
            .join("-")
    )
    .join(" ");
}

type Tone = "white" | "mist" | "ink";

function Section({
  children,
  id,
  tone = "white",
  className = "",
}: {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  className?: string;
}) {
  const bg = { white: "bg-white", mist: "bg-mist", ink: "bg-ink-900" }[tone];
  return (
    <section id={id} className={`relative overflow-hidden ${bg} py-20 sm:py-28 ${className}`}>
      <div className="relative mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

function Photo({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <div data-reveal className="mx-auto my-12 max-w-[720px]">
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        className="w-full rounded-3xl object-cover shadow-[0_30px_60px_-30px_rgba(6,13,41,0.45)] ring-1 ring-ink-900/5"
      />
    </div>
  );
}

// WhatsApp screenshots sit in a phone-like frame so they read as real
// messages, not stock graphics.
function PhoneShot({
  src,
  alt,
  w,
  h,
  caption,
  width = "max-w-[320px]",
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  caption?: ReactNode;
  width?: string;
}) {
  return (
    <figure data-reveal className={`mx-auto my-14 ${width}`}>
      <div className="rounded-[2.2rem] bg-ink-900 p-2.5 shadow-[0_40px_80px_-30px_rgba(6,13,41,0.55)] ring-1 ring-white/10">
        <Image src={src} alt={alt} width={w} height={h} className="w-full rounded-[1.7rem]" />
      </div>
      {caption && (
        <figcaption className="mt-5 text-center font-mono text-[12px] uppercase leading-relaxed tracking-wider text-ink-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const VIDEOS_TOP = [
  { id: "0mUIGefw4fA", name: "Matthew Peace", role: "Customer Service" },
  { id: "PjKczmhzQuk", name: "Sophia Chike", role: "Career" },
  { id: "61ZLAi1vTuY", name: "Davies Elabha", role: "Technical Writer" },
];

const VIDEOS_BOTTOM = [
  { id: "c0bXP8VMPlg", name: "Udo Nseheabasi", role: "Career" },
  { id: "Xpb4_1dQ--s", name: "Taiwo Matthew", role: "Content Creator" },
];

function VideoGrid({ videos }: { videos: typeof VIDEOS_TOP }) {
  return (
    <div
      className={`mx-auto mt-12 grid gap-6 sm:grid-cols-2 ${
        videos.length === 3 ? "lg:grid-cols-3" : "max-w-4xl"
      }`}
    >
      {videos.map((v, i) => (
        <div key={v.id} data-reveal style={delay(i * 90)}>
          <YouTubeLite id={v.id} title={`${v.name} talks about working with JobMingle`} />
          <p className="mt-3 font-display font-semibold tracking-[-0.02em] text-ink-900">{v.name}</p>
          <p className="font-mono text-[12px] uppercase tracking-wider text-ink-600">{v.role}</p>
        </div>
      ))}
    </div>
  );
}

type Quote = { name: string; role: string; img: string; text: string };

function Quotes({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="mt-8 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
      {quotes.map((q, i) => (
        <figure
          key={q.name}
          data-reveal
          style={delay(i * 90)}
          className="break-inside-avoid rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(6,13,41,0.04),0_20px_40px_-24px_rgba(6,13,41,0.25)] ring-1 ring-ink-900/[0.06]"
        >
          <QuoteIcon className="h-6 w-6 fill-gold text-gold" />
          <blockquote className="mt-4 text-[16px] leading-[1.7] text-ink-600">{q.text}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <Image
              src={q.img}
              alt={q.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/40"
            />
            <span>
              <span className="block font-display text-sm font-semibold tracking-[-0.01em] text-ink-900">
                {q.name}
              </span>
              <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-600">{q.role}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

const QUOTES_A: Quote[] = [
  {
    name: "Damilola Akanni",
    role: "Virtual Assistant",
    img: "/writing/damilolaakanni.jpeg",
    text: "JobMingle really put a lot of thought into revamping my CV. The interviews I couldn't get with my old CV, I started getting them with the CV they wrote for me, which was really cool.",
  },
  {
    name: "Celestine Ikenna",
    role: "Quality Analyst",
    img: "/writing/celestineikenna.jpeg",
    text: "I have received a couple of interview invitations from the CV you guys assisted me with. One particularly interesting opportunity was an interview with Marriott International, which I progressed through various stages of the interview, and even got sponsored to two of their masterclasses for free.",
  },
  {
    name: "Khalim Bakare",
    role: "Customer Experience",
    img: "/writing/khalilbakare.jpeg",
    text: "JobMingle played a significant role in helping me gain clarity in my career path. I owe my current job to the CV they prepared for me. I highly recommend them.",
  },
];

const QUOTES_B: Quote[] = [
  {
    name: "Gyume Gideon",
    role: "Admin Assistant",
    img: "/writing/gyumengideon.jpeg",
    text: "JobMingle did an amazing job on my CV. They made me realize how important it is to have a strong CV when applying for jobs. If I had worked with them earlier, I wouldn't have received so many rejections before finding them.",
  },
  {
    name: "Aisha Bukola",
    role: "Financial Advisor",
    img: "/writing/aishabukola.jpeg",
    text: "JobMingle is such an amazing platform. I have gotten two jobs from their platform so far. I will always recommend them.",
  },
];

const SYSTEM_STEPS = [
  [
    "Step 1: We pointed her CV at the right job.",
    "We rebuilt it around the exact roles she was applying for, so a recruiter could see she fit within the first few lines.",
  ],
  [
    "Step 2: We made it readable for the software.",
    "We used the words and the simple layout that screening software reads correctly, the same software companies use in Nigeria and abroad.",
  ],
  [
    "Step 3: We stopped her CV from underselling her.",
    "We rewrote her experience to show results instead of duties, so the first 7 seconds made recruiters want to read the rest.",
  ],
];

const MISTAKES = [
  [
    "Sending a CV that screening software can't read.",
    "Many companies run every CV through software before a person looks at it. If the software can't read yours, it may never reach a recruiter.",
  ],
  [
    "Sending a CV that doesn't show your worth in the first few seconds.",
    "Recruiters skim. If the top of your CV doesn't make them want to read more, they move on to the next one.",
  ],
  [
    "Applying for jobs that don't fit you.",
    "Every hour you spend on a role you were never going to get is an hour you didn't spend on one you could.",
  ],
];

const STEPS = [
  [
    "Fill in the short form at the bottom of this page.",
    "It's four quick questions and takes about a minute.",
  ],
  [
    "Pay a small deposit to our company account.",
    "It's ₦3,000, or ₦5,000 if you've worked 8 years or more, and it comes off your total.",
  ],
  [
    "Press the button and WhatsApp opens with your answers already typed.",
    "Add the picture of your receipt and press send. Our team replies from there.",
  ],
  [
    "We send for your details or work from your old CV, then we get to work.",
    "Your CV, and your cover letter if you asked for one, is ready in 24 to 48 hours.",
  ],
];

const FAQS = [
  [
    "Do I have to pay anything to fill the form?",
    "The form is free. To start, you pay a small deposit by bank transfer: ₦3,000, or ₦5,000 if you've worked 8 years or more. It comes off your total fee, so it doesn't cost you anything extra.",
  ],
  [
    "How do I know this isn't a scam?",
    "We will never ask you to pay for a job or a \"job slot\". We're not a recruiter. You pay for a CV or a cover letter, into our company account in the name JobMingle Limited, never a personal account. Our clients' stories, with their names and faces, are all over this page.",
  ],
  [
    "Will you just add big grammar to my CV?",
    "No. Big grammar doesn't get interviews. We use plain, clear English that shows what you achieved, so a recruiter gets it in 7 seconds.",
  ],
  [
    "My grade is low, or I've spent years in one role. Can a CV really fix that?",
    "We can't change your grade, and we won't make anything up. What we do is find the results already in your work history and put them where a recruiter will see them. Most people have done more than their CV shows.",
  ],
  [
    "Why does the price change with my experience?",
    "A CV for someone with 2 years of work is shorter and quicker to get right. With 10 or 15 years, there's a lot more to go through, and picking what to leave out takes time. So you only pay for the work your CV needs.",
  ],
  [
    "I'm a fresh graduate, or I don't have a CV yet. Can you still help?",
    "Yes. If you have an old CV, we work from that. If you don't, we send you a short form to collect your details. We write for every experience level.",
  ],
  [
    "Will this work for remote jobs abroad?",
    "Yes. Companies abroad use the same kind of screening software, and we write for that.",
  ],
  [
    "What if I don't like what you write?",
    "Tell us what to change. Every CV and cover letter comes with unlimited revisions until you're happy with it.",
  ],
  [
    "How do I pay when I'm ready?",
    "After the form, you'll see our company bank accounts and pay your deposit there. Our team sends the details for the rest on WhatsApp.",
  ],
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function WritingPage() {
  return (
    <PackageProvider>
      {/* Turns motion on before first paint. Without JS, nothing is hidden. */}
      {/* Also stops the browser restoring the old scroll spot on reload, so
          the page always opens on the hero. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.documentElement.classList.add('fx');if('scrollRestoration' in history)history.scrollRestoration='manual'",
        }}
      />
      <ScrollFx />
      <SiteNav />
      <main className="overflow-x-clip">
        {/* Hero */}
        <section id="top" className="relative overflow-hidden bg-ink-900 pb-20 pt-28 sm:pb-28 sm:pt-32">
          <div aria-hidden className="w-grid-bg absolute inset-0" />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/3 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]"
          />
          <div className="relative mx-auto max-w-5xl px-5 text-center">
            {/* Stacked scale: small lead-in, one huge phrase, medium close. */}
            <h1 className="font-display leading-[1.05] tracking-[-0.05em] text-white">
              <span className="animate-fade-in block text-2xl font-normal text-white/80 opacity-0 [animation-delay:100ms] sm:text-3xl">
                You&apos;re Good at Your Job. Your CV Doesn&apos;t Show It.
              </span>
              <span className="animate-fade-in mt-3 block text-3xl font-semibold text-white opacity-0 [animation-delay:250ms] sm:text-4xl lg:text-5xl">
                We Rewrite It So Recruiters in Nigeria and Abroad See
              </span>
              <span className="animate-fade-in mt-2 block text-[2.9rem] font-semibold leading-[0.95] text-gold opacity-0 [animation-delay:400ms] sm:text-[4.75rem] lg:text-[5.75rem]">
                What You&apos;re Worth
              </span>
              <span className="animate-fade-in mt-2 block text-3xl font-semibold text-white/90 opacity-0 [animation-delay:550ms] sm:text-4xl lg:text-5xl">
                in the First 7 Seconds.
              </span>
            </h1>
            <p className="animate-fade-in mx-auto mt-8 max-w-2xl text-[17px] leading-[1.7] text-white/80 opacity-0 [animation-delay:700ms] sm:text-lg">
              This is for you if you have a job but want one that pays more, or a remote job that pays
              in dollars. Most CVs only list what you were asked to do. We rewrite yours to show what you
              actually got done, so the people hiring can see why you&apos;re worth more.
            </p>
            <div className="animate-fade-in mt-9 flex flex-col items-center gap-3 opacity-0 [animation-delay:850ms]">
              <ApplyButton label="Get my CV rewritten" />
              <p className="text-sm text-white/70">Ready in 24 to 48 hours.</p>
            </div>
            <div className="animate-fade-up mx-auto mt-14 max-w-[340px] opacity-0 [animation-delay:1000ms]">
              <div className="rounded-[2.2rem] bg-black p-2.5 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
                <Image
                  src="/writing/client-underselling.jpg"
                  alt="Victoria Harry's WhatsApp message saying the new CV showed she had been underselling herself, and that she is now getting callbacks and has an interview with a hospital in Lagos"
                  width={700}
                  height={1102}
                  priority
                  className="w-full rounded-[1.7rem]"
                />
              </div>
              <p className="mt-5 text-center font-mono text-[12px] uppercase leading-relaxed tracking-wider text-white/70">
                Victoria Harry: &ldquo;I had been underselling myself.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Lead */}
        <Section>
          <div className="mx-auto max-w-[640px]">
            <p data-reveal className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink-900">
              Dear Professional,
            </p>
          </div>
          <Prose
            className="mt-6"
            lines={[
              "It's 11:30 PM. You've just come back from work, and you're too tired to sleep.",
              "You're good at your job. Your manager knows it, and some days they hand you the work nobody else can do.",
              "But your pay hasn't moved much. Prices go up every month, and what you take home stays the same.",
              "So you pick up your phone and look for something better. A bigger role, a better company, or a remote job that pays in dollars.",
              "You find one that fits you well. You send your CV, and then there's total silence.",
              "No email comes. No rejection letter comes either. It's like your CV fell into a black hole.",
              "And tomorrow morning, you'll be back at the same desk, doing the same work for the same pay.",
            ]}
          />
          <Photo src="/writing/cv-girl2.jpg" alt="A woman looking at her phone in a dark room late at night" w={612} h={323} />
          <H2>How much longer can you keep waiting for your turn?</H2>
          <Prose
            className="mt-10"
            lines={[
              "You watch people you started with move on. One is now a manager at another company. Another got a remote job and now earns in dollars.",
              "You're truly happy for them. But a quiet voice inside you asks, \"What do they have that I don't?\"",
              "And when a recruiter does call, it's often for a role at your level, for about the same money. So you stay where you are.",
              "It's not that you're lazy. You show up and do good work every day. But being passed over again and again, or worse, being ignored, wears you down.",
              "**It makes you wonder if this is as far as you'll go. It makes you question your worth, your talent, and your future.**",
            ]}
          />
          <Photo src="/writing/cv-girl1.jpeg" alt="A woman holding her head as she looks at her phone" w={612} h={408} />
        </Section>

        {/* Problem mechanism */}
        <Section tone="mist">
          <H2>But here is the truth you need to hear right now</H2>
          <Prose
            className="mt-10"
            lines={[
              "**This silence doesn't mean you're not good enough. Most of the time, it means your CV is underselling you.**",
              "Here's what we mean. A study by the job site Ladders found that recruiters look at a CV for about 7 seconds before they decide what to do with it.",
              "In those 7 seconds, they're looking for one thing: proof that you can do the job well.",
              "But most CVs only list duties. \"Responsible for customer enquiries\" tells a recruiter what your job was. It doesn't tell them you were good at it.",
              "Compare it with this: \"Handled about 60 customer enquiries a day and kept complaints low enough that my manager put me in charge of training new staff.\"",
              "It's the same person and the same job. The second line just shows what the first one hides.",
              "Nobody taught you to write it that way. School taught you to list duties, and most CV templates do the same thing.",
              "**So a strong person ends up looking like everyone else in the pile, and that's where the CV stays.**",
              "Victoria Harry found this out when she saw the CV we wrote for her. Read what she sent us.",
            ]}
          />
          <PhoneShot
            src="/writing/client-underselling.jpg"
            alt="Victoria Harry's WhatsApp message saying the new CV showed she had been underselling herself, and that she is now getting callbacks and has an interview with a hospital in Lagos"
            w={700}
            h={1102}
            width="max-w-[360px]"
            caption={
              <>
                Victoria Harry: &ldquo;I had been underselling myself.&rdquo; Now she&apos;s getting callbacks.
              </>
            }
          />
          <Prose
            lines={[
              "There's a second problem too. Many companies, in Nigeria and abroad, run every CV through software before a person reads it. If the software can't read your CV properly, nobody sees how good you are, however well it's written.",
              "**That's why we built the JobMingle 3-Step Interview Invitation System to fix both problems at once.**",
            ]}
          />
          <div
            data-reveal
            className="mx-auto mt-12 max-w-[640px] rounded-3xl bg-ink-900 p-7 text-white shadow-[0_30px_60px_-30px_rgba(6,13,41,0.6)] sm:p-9"
          >
            <p className="font-display text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              &ldquo;But don&apos;t you need connections to get a job in Nigeria?&rdquo;
            </p>
            <p className="mt-4 text-[17px] leading-[1.7] text-white/70">
              Knowing somebody helps, and we won&apos;t pretend it doesn&apos;t. But companies still post
              jobs online every day, and somebody still gets them. Ayomide and Victoria got their
              replies by sending out CVs. A CV that sells you properly is how you compete when you
              don&apos;t have an uncle in the company.
            </p>
          </div>
        </Section>

        {/* Ayomide + solution mechanism */}
        <Section>
          <H2>{"One of the 203 people we've helped was Ayomide"}</H2>
          <Prose
            className="mt-10"
            lines={[
              "We've used this system for 203 jobseekers so far. They were qualified, hardworking people doing almost everything right, but still hitting the same wall you're hitting now.",
              "Ayomide had been job hunting for 5 months. Even with her effort and her qualifications, nothing came back.",
              "We didn't just fix her grammar or give her CV a new design. We took it through our 3-Step Interview Invitation System.",
            ]}
          />
          <ol className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
            {SYSTEM_STEPS.map(([title, body], i) => (
              <li
                key={title}
                data-reveal
                style={delay(i * 120)}
                className="group relative overflow-hidden rounded-3xl bg-mist p-7 ring-1 ring-ink-900/[0.05] transition-all duration-500 hover:-translate-y-1 hover:bg-ink-900"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 origin-left bg-gold transition-transform duration-700"
                  style={{ transform: `scaleX(${(i + 1) / 3})` }}
                />
                <p className="font-display text-lg font-semibold leading-snug tracking-[-0.03em] text-ink-900 transition-colors duration-500 group-hover:text-white">
                  {title}
                </p>
                <p className="mt-3 text-[15px] leading-[1.7] text-ink-600 transition-colors duration-500 group-hover:text-white/85">
                  {body}
                </p>
              </li>
            ))}
          </ol>
          <Prose className="mt-16" lines={["Less than a week later, she sent our team this message."]} />
          <PhoneShot
            src="/writing/ayomide-replies.jpg"
            alt="Ayomide's WhatsApp message saying she got replies from 5 companies in less than a week, followed by an offer of employment"
            w={485}
            h={865}
            caption="Look at the bottom of the chat. A few days later she sent her offer letter."
          />
          <Prose lines={["**And Ayomide isn't the only one. Here's what other clients said after working with us.**"]} />
          <VideoGrid videos={VIDEOS_TOP} />
          <div className="mt-14 rounded-[2.5rem] bg-mist p-4 sm:p-8">
            <Quotes quotes={QUOTES_A} />
          </div>
        </Section>

        {/* 5 mistakes */}
        <Section tone="ink">
          <div aria-hidden className="w-grid-bg absolute inset-0 opacity-60" />
          <H2 dark>The 3 costly mistakes that keep good people stuck</H2>
          <Prose
            dark
            className="mt-10"
            lines={[
              "You see, if you want more interview invites and a move into a better-paying role, you have to avoid these 3 costly mistakes.",
            ]}
          />
          <ol className="mx-auto mt-14 max-w-3xl divide-y divide-white/10 border-y border-white/10">
            {MISTAKES.map(([title, body], i) => (
              <li
                key={title}
                data-reveal
                style={delay(i * 70)}
                className="group grid grid-cols-[3.25rem_1fr] gap-4 py-7 sm:grid-cols-[5rem_1fr]"
              >
                <span className="font-mono text-3xl font-medium text-white/70 transition-colors duration-300 group-hover:text-gold sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">
                    {title}
                  </span>
                  <span className="mt-2 block text-[16px] leading-[1.7] text-white/80">{body}</span>
                </span>
              </li>
            ))}
          </ol>
          <Prose
            dark
            className="mt-12"
            lines={[
              "We fix all three for every client. Your CV is written for the exact job you're going for, in a layout the software can read, with your results right at the top.",
            ]}
          />
        </Section>

        {/* Future pacing + remote proof */}
        <Section>
          <H2>Imagine how your life changes when you finally make that move</H2>
          <Prose
            className="mt-10"
            lines={[
              "We understand how it feels to do good work every day and still feel stuck, to apply for better roles and hear nothing back, and to watch others move ahead.",
              "Now imagine your phone buzzing with an email that starts, \"We'd like to invite you for an interview.\" A few days later, another one comes in.",
              "Then the offer comes. A bigger role, at a better company, for a lot more than you earn now.",
              "You hand in your resignation letter, and it feels good. You can do more for your family, put real money aside every month, and finally start saving for that dream car.",
              "And you can look in the mirror and know you did it.",
              "**You didn't get lucky. You stopped playing a broken game and started playing a smarter one.**",
              "And it isn't only jobs in Nigeria.",
              "Lucille saw a vacancy we shared and got hired for a remote customer service job. Here's what she told us about the pay.",
            ]}
          />
          <PhoneShot
            src="/writing/lucille-remote.jpg"
            alt="Lucille's WhatsApp message saying she got a remote customer service job that pays over $2,000"
            w={540}
            h={940}
          />
          <Prose
            lines={[
              "And Lucille isn't alone. Between January and December 2025, over 600 people landed jobs across our platforms.",
              "Some got there through our CV and LinkedIn services, others through our job tips, and some through their own improved approach.",
              "Now you might be wondering, \"How much does it cost if I don't want to do this myself?\"",
              "We'll get to that in a moment. But first, here's what you need to know.",
              "It doesn't matter your experience level, your industry, or how long you've been job hunting. We work from your old CV, or we collect your details with a short form, and turn them into a CV that stands out, with a cover letter if you want one.",
              "**And the best part? You can get started for a one-time payment of just ₦10,000.**",
              "The price depends on how many years you've worked, and we know it's still real money. So think about it this way. If your next job pays ₦150,000 a month, ₦10,000 is about 2 days of your new salary. And every month you keep sending a CV that undersells you, you're paying for data and transport that bring nothing back.",
            ]}
          />
        </Section>

        {/* Offer */}
        <Section tone="ink" id="packages">
          <div aria-hidden className="w-grid-bg absolute inset-0" />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[140px]"
          />
          <H2 dark>Pick your experience level</H2>
          <Prose
            dark
            className="mt-10"
            lines={[
              "Whether you want a role here in Nigeria or a remote job that pays in dollars, your problem is the same. You are good enough, but the people who decide can't see it fast enough.",
              "We fix that in 24 to 48 hours. Everyone gets the same care. The price only changes with how many years of work we have to go through.",
              "**Pick the one that matches your years of experience. You don't pay on this page. Choosing one just fills in your form at the bottom.**",
            ]}
          />
          <div className="mx-auto mt-16 grid max-w-6xl items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.key}
                data-reveal
                style={delay(i * 120)}
                className={`relative rounded-[2rem] p-px ${
                  pkg.popular
                    ? "bg-gradient-to-b from-gold via-gold/40 to-gold/10 shadow-[0_0_80px_-20px_rgba(244,203,25,0.45)]"
                    : "bg-white/10"
                }`}
              >
                <article className="flex h-full flex-col rounded-[calc(2rem-1px)] bg-[#0B1433] p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/75">{pkg.name}</p>
                    {pkg.popular && (
                      <span className="rounded-full bg-gold px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900">
                        Most popular
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                    {pkg.years} of experience
                  </h3>

                  <div className="mt-7 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.06]">
                    <p className="font-mono text-[12px] uppercase tracking-wider text-gold">Your CV</p>
                    <p className="mt-1.5 font-display text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-white">
                      {formatNaira(pkg.price)}
                    </p>
                    <p className="mt-4 border-t border-white/[0.06] pt-4 text-[14px] text-white/80">
                      Add a cover letter for <span className="font-semibold text-white">{formatNaira(pkg.coverLetter)}</span>
                    </p>
                  </div>
                  <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-white/70">
                    Ready in {pkg.delivery}
                  </p>

                  <ul className="mb-8 mt-8 space-y-3">
                    {PACKAGE_WORK.map((item) => (
                      <li key={item} className="flex gap-3 text-[14px] leading-snug text-white/85">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                          <Check className="h-3 w-3 text-gold" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <ChoosePackageButton pkg={pkg.key} label="Choose this" featured={pkg.popular} />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </Section>

        {/* Price reason + scarcity */}
        <Section tone="mist">
          <H2>Why the price depends on your experience</H2>
          <Prose
            className="mt-10"
            lines={[
              "A CV for someone with 2 years of work is shorter and quicker to get right.",
              "With 10 or 15 years, there's a lot more to go through. Picking what to keep and what to leave out is where most of the time goes.",
              "**So you only pay for the work your CV needs. Someone who just started working never pays what someone with 15 years pays.**",
              "We only take a limited number of clients each month. That's how every CV gets proper attention instead of being rushed.",
            ]}
          />
        </Section>

        {/* Guarantee */}
        <Section>
          <div
            data-reveal
            className="relative mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] bg-ink-900 px-6 py-14 text-center sm:px-14"
          >
            <div aria-hidden className="w-grid-bg absolute inset-0" />
            <div aria-hidden className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/25 blur-[90px]" />
            <div className="relative">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/40">
                <ShieldCheck className="h-10 w-10 text-gold" strokeWidth={1.5} />
              </span>
              <h2 className="mx-auto mt-6 max-w-xl text-balance font-helvetica text-3xl font-semibold leading-[1.1] tracking-[-0.045em] text-white sm:text-[2.6rem]">
                {titleCase('Our 90-day "Get Responses" guarantee')}
              </h2>
              <Prose
                dark
                className="mt-8 text-left"
                lines={[
                  "We can't promise you a job. Nobody honest can. What we can promise is this.",
                  "Use the CV we write for you for 90 days. Apply to at least 30 roles, in Nigeria or remote, and keep a simple list of where you applied and when.",
                  "If you haven't had a single response from a recruiter or employer by then, send us your list. We'll keep working on your CV for free until you do.",
                  "We can put this in writing because we've done this work more than 200 times. In our experience, the people who never get a response are the ones who don't use what we give them.",
                ]}
              />
            </div>
          </div>
        </Section>

        {/* More videos */}
        <Section tone="mist">
          <div>
            <H2 className="sm:text-4xl">More clients, in their own words</H2>
            <VideoGrid videos={VIDEOS_BOTTOM} />
            <div className="mx-auto mt-6 max-w-4xl">
              <Quotes quotes={QUOTES_B} />
            </div>
          </div>
        </Section>

        {/* How it works */}
        <Section>
          <H2>{"Here's how it works"}</H2>
          <ol className="relative mx-auto mt-16 grid max-w-6xl gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-line md:left-0 md:top-[19px] md:h-px md:w-full" />
            {STEPS.map(([title, body], i) => (
              <li key={title} data-reveal style={delay(i * 120)} className="relative grid grid-cols-[40px_1fr] gap-5 md:block">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 font-mono text-sm text-gold ring-8 ring-white">
                  {i + 1}
                </span>
                <span className="md:mt-6 md:block">
                  <span className="block font-display text-lg font-semibold leading-snug tracking-[-0.03em] text-ink-900">
                    {title}
                  </span>
                  <span className="mt-2 block text-[15px] leading-[1.7] text-ink-600">{body}</span>
                </span>
              </li>
            ))}
          </ol>
          <div data-reveal className="mt-16 text-center">
            <ApplyButton label="Yes, I want more interview invites" />
          </div>
        </Section>

        {/* FAQ */}
        <Section tone="mist">
          <H2>Questions people ask before they start</H2>
          <div className="mx-auto mt-14 max-w-3xl space-y-3">
            {FAQS.map(([q, a], i) => (
              <details
                key={q}
                data-reveal
                style={delay(i * 40)}
                className="w-faq group rounded-2xl bg-white ring-1 ring-ink-900/[0.06] transition-shadow open:shadow-[0_20px_40px_-28px_rgba(6,13,41,0.35)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-display text-[17px] font-semibold tracking-[-0.02em] text-ink-900">
                  {q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-lg text-ink-900 transition-all duration-300 group-open:rotate-45 group-open:bg-gold">
                    +
                  </span>
                </summary>
                <p className="w-faq-body px-6 pb-6 text-[16px] leading-[1.7] text-ink-600">{a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* Close */}
        <Section>
          <H2>Right now, the ball is in your court</H2>
          <Prose
            className="mt-10"
            lines={[
              "You can choose to do it yourself, and that's perfectly fine, as long as you land your dream job.",
              "Or you can skip the trial and error that hasn't been working, and let our experts handle it once and for all. The choice is yours.",
              "3 months from now, you'll either be in a new role, getting paid what you're worth and doing work that excites you, or you'll still be refreshing your inbox, waiting for replies that never come.",
              "**The only thing standing between those two outcomes is what you decide in the next few minutes.**",
              "If you're ready to stop being overlooked, fill in the short form below before this month's slots are gone. WhatsApp opens with your answers ready to send, and our team takes it from there.",
              "We can't wait to share your testimony.",
              "Thank you.",
            ]}
          />
          <div className="mx-auto max-w-[640px]">
            <p data-reveal className="mt-8 font-display text-lg font-semibold tracking-[-0.02em] text-ink-900">
              JobMingle Career Acceleration Team
            </p>
            <div className="mt-12 space-y-5 rounded-3xl bg-mist p-7 text-[16px] leading-[1.7] text-ink-600 sm:p-9">
              <p data-reveal>
                <span className="mr-1 font-mono text-[13px] font-semibold text-ink-900">P.S.</span> Remember what Victoria
                told us: &ldquo;I had been underselling myself.&rdquo; If your CV only lists your duties, it&apos;s
                probably doing the same thing to you. Fill in the form before this month&apos;s slots are gone.
              </p>
              <p data-reveal>
                <span className="mr-1 font-mono text-[13px] font-semibold text-ink-900">P.P.S.</span> When you get started
                this month, we&apos;ll add you to our private career group. That&apos;s where we sometimes share job
                openings from companies that ask us to recommend people.
              </p>
              <p data-reveal>
                <span className="mr-1 font-mono text-[13px] font-semibold text-ink-900">P.P.P.S.</span> Your CV and cover
                letter come with unlimited revisions, and the 90-day guarantee covers you after that. Your
                deposit comes off your total fee, so the only risk is staying where you are.
              </p>
            </div>
          </div>
        </Section>

        {/* Form */}
        <section id="apply" className="relative scroll-mt-16 overflow-hidden bg-ink-900 py-20 sm:py-28">
          <div aria-hidden className="w-grid-bg absolute inset-0" />
          <div aria-hidden className="absolute -bottom-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]" />
          <div className="relative mx-auto max-w-xl px-5">
            <H2 dark>Tell us about your job search</H2>
            <p data-reveal className="mx-auto mt-6 max-w-md text-center text-[17px] leading-[1.7] text-white/85">
              Answer four questions, pay a small deposit that comes off your total, and WhatsApp opens with your
              answers ready to send to our team.
            </p>
          </div>

          <div className="relative mx-auto max-w-xl px-5">
            <div data-reveal className="mt-14">
              <Suspense fallback={<FormFallback />}>
                <WritingForm />
              </Suspense>
            </div>
          </div>

          <div data-reveal className="relative mt-14">
            <p className="px-5 text-center font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">
              Real receipts from our clients
            </p>
            <p className="mx-auto mt-2 max-w-md px-5 text-center text-sm text-white/70">
              Every transfer went to JobMingle Limited. We hid their full names and numbers.
            </p>
            <ReceiptMarquee />
          </div>
        </section>

        <footer className="border-t border-white/5 bg-[#040920] pb-24 pt-10 text-center font-mono text-[11px] uppercase tracking-wider text-white/85 sm:pb-10">
          <p className="mx-auto mb-3 max-w-xl px-5 normal-case tracking-normal">
            The stories on this page are from real JobMingle clients. Results vary from person to person.
          </p>
          © {new Date().getFullYear()} JobMingle Limited. All rights reserved.
        </footer>

        <StickyCta />
      </main>
    </PackageProvider>
  );
}
