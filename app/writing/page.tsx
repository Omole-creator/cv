import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Check, Gift, Quote as QuoteIcon, ShieldCheck } from "lucide-react";
import {
  ApplyButton,
  ChoosePackageButton,
  PackageProvider,
} from "@/components/writing/PackageContext";
import WritingForm from "@/components/writing/WritingForm";
import StickyCta from "@/components/writing/StickyCta";
import ScrollFx from "@/components/writing/ScrollFx";
import SiteNav from "@/components/writing/SiteNav";
import YouTubeLite from "@/components/writing/YouTubeLite";
import BeforeAfter from "@/components/writing/BeforeAfter";
import {
  formatNaira,
  PACKAGES,
  totalBonusValue,
  totalValue,
  WRITING_NUMBER_DISPLAY,
} from "@/lib/writingPackages";

export const metadata: Metadata = {
  title: "CV Writing That Gets Replies | JobMingle",
  description:
    "Ayomide sent CVs for 5 months and heard nothing. Less than a week after we rewrote hers, 5 companies replied. Get your CV rewritten in 24 to 48 hours.",
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
        dark ? "text-white/70" : "text-ink-400"
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

function H2({ children, dark, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <h2
      data-reveal
      className={`mx-auto max-w-3xl text-balance text-center font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl ${
        dark ? "text-white" : "text-ink-900"
      } ${className}`}
    >
      {children}
    </h2>
  );
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
        <figcaption className="mt-5 text-center font-mono text-[12px] uppercase leading-relaxed tracking-wider text-ink-400">
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
          <p className="font-mono text-[12px] uppercase tracking-wider text-ink-400">{v.role}</p>
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
              <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-400">{q.role}</span>
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
  [
    "Having a LinkedIn profile recruiters can't find.",
    "Recruiters in Nigeria and abroad search LinkedIn for people like you every day. If your profile isn't set up right, you don't show up.",
  ],
  [
    "Having no proof of your work.",
    "Without something that shows what you do, how you do it, and who you've done it for, a recruiter has to take your word for it, and many won't.",
  ],
];

const STEPS = [
  [
    "Fill in the short form at the bottom of this page.",
    "It's five quick questions and takes about a minute.",
  ],
  [
    "Press the button and WhatsApp opens with your answers already typed.",
    `Just press send. It goes straight to our team on ${WRITING_NUMBER_DISPLAY}.`,
  ],
  [
    "Our team replies, answers your questions, and helps you pick the right package.",
    "You only pay once you've spoken to us and you're happy to go ahead.",
  ],
  [
    "We send for your details or work from your old CV, then we get to work.",
    "Basic is ready in 24 to 48 hours. Standard takes 4 to 6 days, and Premium takes 7 to 10 days.",
  ],
];

const FAQS = [
  [
    "Do I have to pay anything to fill the form?",
    "No. The form just sends your answers to our team on WhatsApp. You only pay after we've talked and you've decided to go ahead.",
  ],
  [
    "How do I know this isn't a scam?",
    "We will never ask you to pay for a job or a \"job slot\". We're not a recruiter. You pay for a CV, a LinkedIn profile or a portfolio, and you only pay after you've talked to our team. Our clients' stories, with their names and faces, are all over this page.",
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
    "A good CV won't help if I fail the interview, right?",
    "That's true. A CV gets you the interview, not the job. That's why Premium includes interview practice questions and salary negotiation scripts.",
  ],
  [
    "I'm a fresh graduate, or I don't have a CV yet. Can you still help?",
    "Yes. If you have an old CV, we work from that. If you don't, we send you a short form to collect your details. We write for every experience level.",
  ],
  [
    "Will this work for remote jobs abroad?",
    "Yes. Companies abroad use the same kind of screening software, and we write for that. Standard and Premium also include tools for reaching recruiters outside Nigeria.",
  ],
  [
    "What if I don't like what you write?",
    "Tell us what to change. Every CV, LinkedIn profile and portfolio comes with unlimited revisions until you're happy with it.",
  ],
  [
    "How do I pay when I'm ready?",
    "Our team sends you the payment link or our bank details on WhatsApp once you've chosen your package.",
  ],
];

const LINKEDIN = [
  {
    name: "Victor Morolayo",
    place: "Oyo State",
    quote:
      "This optimization has given me more confidence in how I present myself professionally, and I'm grateful for the work you guys put into making it stand out.",
    before: { src: "/writing/victor-before.jpg", w: 1000, h: 435 },
    after: { src: "/writing/victor-after.jpg", w: 1000, h: 515 },
  },
  {
    name: "Temiloluwa Makinde",
    place: "Lagos State",
    quote: "Good job. What I was most inspired about was the post as well.",
    before: { src: "/writing/temi-before.jpg", w: 1000, h: 729 },
    after: { src: "/writing/temi-after.jpg", w: 1000, h: 634 },
  },
];

/* ------------------------------------------------------------------ */
/* Hero chat: Ayomide's real messages, word for word from her chat     */
/* ------------------------------------------------------------------ */

function HeroChat() {
  return (
    <div className="w-float relative mx-auto w-full max-w-[380px]" aria-label="Ayomide's messages to the JobMingle team">
      <div aria-hidden className="absolute -inset-10 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] bg-[#ECE5DD] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-display text-sm font-semibold">
            A
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[-0.01em]">Ayomide</span>
        </div>
        <div className="space-y-2.5 px-3 py-4 text-[14px] leading-snug text-[#111b21]">
          <div className="w-typing inline-flex gap-1 rounded-xl rounded-tl-sm bg-white px-3 py-3" style={delay(600)}>
            <i />
            <i />
            <i />
          </div>
          <div className="w-msg max-w-[85%] rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-sm" style={delay(1700)}>
            Thank you very much for the CV, is not even up to 1week, I have gotten replies from 5 companies
            <span className="mt-1 block text-right text-[10px] text-black/45">11:23 am</span>
          </div>
          <div className="w-msg ml-auto max-w-[80%] rounded-xl rounded-tr-sm bg-[#D9FDD3] px-3 py-2 shadow-sm" style={delay(2500)}>
            That&apos;s quite a good number 👏👏👏 Congrats. Good news on its way
            <span className="mt-1 block text-right text-[10px] text-black/45">11:27 am</span>
          </div>
          <div className="w-msg max-w-[88%] overflow-hidden rounded-xl rounded-tl-sm bg-white shadow-sm" style={delay(3500)}>
            <div className="bg-[#1f1f1f] px-3 py-2.5 text-white">
              <p className="text-[13px] font-semibold">Offer of Employment</p>
              <p className="mt-1.5 text-[12px] leading-snug text-white/75">
                Dear Ayomide, We are pleased to offer you the position of Sales Representative at Chrisdron
                Solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function WritingPage() {
  return (
    <PackageProvider>
      {/* Turns motion on before first paint. Without JS, nothing is hidden. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('fx')" }} />
      <ScrollFx />
      <SiteNav />
      <main className="overflow-x-clip">
        {/* Hero */}
        <section id="top" className="relative overflow-hidden bg-ink-900 pb-20 pt-28 sm:pb-24 sm:pt-32">
          <div aria-hidden className="w-grid-bg absolute inset-0" />
          <div
            aria-hidden
            className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[120px]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(244,203,25,0.7)]" />
                For anyone who has sent CV after CV and heard nothing back
              </span>
              <h1 className="mt-7 font-display text-[2.35rem] leading-[1.1] tracking-[-0.05em] sm:text-[3.4rem] lg:text-[3.6rem]">
                <span className="animate-fade-in block font-normal text-white/45 [animation-delay:100ms] opacity-0">
                  Ayomide applied for 5 months and heard nothing.
                </span>{" "}
                <span className="animate-fade-in mt-2 block font-semibold text-white [animation-delay:350ms] opacity-0">
                  Then we changed how her CV sold her, and{" "}
                  <span className="w-hl-solid">5 companies replied in less than a week.</span>
                </span>
              </h1>
              <p className="animate-fade-in mt-7 max-w-xl text-[17px] leading-[1.7] text-white/65 [animation-delay:550ms] opacity-0 sm:text-lg">
                A few days later, she had a job offer. Below, you&apos;ll see the most common mistake we
                fix in CVs like hers, why yours is probably making it too, and how we can fix yours in as
                little as 24 hours.
              </p>
              <div className="animate-fade-in mt-9 flex flex-col items-start gap-3 [animation-delay:700ms] opacity-0">
                <ApplyButton label="Yes, I want more interview invites" />
                <p className="pl-1 text-sm text-white/45">
                  It&apos;s a 1-minute form, and you don&apos;t pay anything to fill it.
                </p>
              </div>
            </div>
            <HeroChat />
          </div>
        </section>

        {/* Lead */}
        <Section>
          <div className="mx-auto max-w-[640px]">
            <p data-reveal className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink-900">
              Dear Jobseeker,
            </p>
          </div>
          <Prose
            className="mt-6"
            lines={[
              "It's 11:30 PM. You're staring at your phone, checking your inbox for the twentieth time today, hoping this time will be different. But there's nothing there.",
              "You've done everything \"they\" told you to do. You got the qualification, and you sharpened your skills.",
              "You spent hours on your CV, making sure every line looked perfect, and you sent it out with a prayer.",
              "You've updated it 6 times this month and changed it for every single job. You hit \"Submit\", and then there's total silence.",
              "No email comes. No rejection letter comes either. It's like your CV fell into a black hole.",
              "The only messages you do get are from people who want you to pay for a \"job slot\", and you know those are scams.",
              "And the money you spend on data, transport and printing keeps adding up, with nothing coming back.",
            ]}
          />
          <Photo src="/writing/cv-girl1.jpeg" alt="A job seeker looking at her phone late at night" w={612} h={408} />
          <H2>How much longer can you keep playing this guessing game?</H2>
          <Prose
            className="mt-10"
            lines={[
              "You hit \"Apply\" on LinkedIn, Jobberman, Indeed, or by email. Then you wait in silence, wondering if anyone even opened it.",
              "And on the rare day you get a callback, it can hurt even more.",
              "You prepare for days and nail the interview. You walk out feeling like \"this is finally the one.\" Then you never hear from the HR manager again, not even a short email.",
              "Meanwhile, you see classmates and friends posting their new jobs on LinkedIn.",
              "You're truly happy for them. But a quiet voice inside you asks, \"What am I doing wrong? When is it my turn?\"",
              "And every time someone at home asks, \"Any news about the job?\", it gets harder to answer.",
              "It's not that you're lazy. You're giving this everything you've got. But being rejected again and again, or worse, being ignored, is tiring for your body and your mind.",
              "**It makes you feel small. It makes you question your worth, your talent, and your future.**",
            ]}
          />
          <Photo src="/writing/cv-girl2.jpg" alt="A tired job seeker at her desk" w={612} h={323} />
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
          <H2>One of the 203 people we&apos;ve helped was Ayomide</H2>
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
                <p className="mt-3 text-[15px] leading-[1.7] text-ink-400 transition-colors duration-500 group-hover:text-white/70">
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
          <H2 dark>The 5 costly mistakes that keep good people stuck</H2>
          <Prose
            dark
            className="mt-10"
            lines={[
              "You see, if you want more interview invites and a move into a better-paying role, you have to avoid these 5 costly mistakes.",
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
                <span className="font-mono text-3xl font-medium text-white/20 transition-colors duration-300 group-hover:text-gold sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">
                    {title}
                  </span>
                  <span className="mt-2 block text-[16px] leading-[1.7] text-white/60">{body}</span>
                </span>
              </li>
            ))}
          </ol>
          <Prose
            dark
            className="mt-12"
            lines={[
              "We fix the first two for every client. Standard and Premium fix the last two as well, and you'll see how below.",
            ]}
          />
        </Section>

        {/* Future pacing + remote proof */}
        <Section>
          <H2>Imagine how your life changes when you finally land that job</H2>
          <Prose
            className="mt-10"
            lines={[
              "We understand exactly how it feels to apply again and again with no response, to feel stuck while others move ahead, and to get ghosted after an interview.",
              "Now imagine your phone buzzing with an email that starts, \"We'd like to invite you for an interview.\" A few days later, another one comes in.",
              "Then you land the dream job you've been praying to God for.",
              "You call your mum and tell her the news, and this time you're the one helping at home. You can hang out with your friends again, and finally start saving for that dream car.",
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
              "It doesn't matter your experience level, your industry, or how long you've been job hunting. We work from your old CV, or we collect your details with a short form, and turn them into a CV and cover letter that stand out.",
              "**And the best part? You can get started for a one-time payment of just ₦20,000.**",
              "We know ₦20,000 is real money right now. So think about it this way. If your next job pays ₦150,000 a month, that's about 4 days of your new salary. And every month you keep sending a CV that undersells you, you're paying for data and transport that bring nothing back.",
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
          <H2 dark>Here is everything you get</H2>
          <Prose
            dark
            className="mt-10"
            lines={[
              "Whether you want a role here in Nigeria or a remote job that pays in dollars, your problem is the same. You are good enough, but the people who decide can't see it fast enough.",
              "We fix that in days. And we don't hand you documents and wave goodbye. We hand you the whole system that turns those documents into interviews.",
              "**Choose a package, and here's what lands in your hands. You don't pay on this page. Choosing one just fills in your form at the bottom.**",
            ]}
          />
          <div className="mx-auto mt-16 grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.key}
                data-reveal
                style={delay(i * 120)}
                className={`relative rounded-[2rem] p-px ${
                  pkg.popular
                    ? "bg-gradient-to-b from-gold via-gold/40 to-gold/10 shadow-[0_0_80px_-20px_rgba(244,203,25,0.45)] lg:-my-4"
                    : "bg-white/10"
                }`}
              >
                <article className="flex h-full flex-col rounded-[calc(2rem-1px)] bg-[#0B1433] p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/50">{pkg.name}</p>
                    {pkg.popular && (
                      <span className="rounded-full bg-gold px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-900">
                        Most popular
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-white">{pkg.system}</h3>

                  <div className="mt-7 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/[0.06]">
                    <p className="flex items-baseline justify-between font-mono text-[12px] uppercase tracking-wider text-white/45">
                      <span>Total value</span>
                      <span className="text-[15px] normal-case tracking-normal line-through decoration-gold/70 decoration-2">
                        {formatNaira(totalValue(pkg))}
                      </span>
                    </p>
                    <div className="mt-4 border-t border-white/[0.06] pt-4">
                      <p className="font-mono text-[12px] uppercase tracking-wider text-gold">Your price</p>
                      <p className="mt-1.5 font-display text-[2.75rem] font-semibold leading-none tracking-[-0.05em] text-white">
                        {formatNaira(pkg.price)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-white/40">
                    Ready in {pkg.delivery}
                  </p>

                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">What we do for you</p>
                  <ul className="mt-4 space-y-3">
                    {pkg.work.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-snug text-white/85">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                          <Check className="h-3 w-3 text-gold" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                    <span>Free bonuses</span>
                    <span className="text-gold/80">{formatNaira(totalBonusValue(pkg.key))}</span>
                  </p>
                  <ul className="mb-8 mt-4 space-y-3.5">
                    {pkg.bonuses.map((bonus) => (
                      <li key={bonus.name} className="flex gap-3 text-[14px] leading-snug text-white/65">
                        <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                        <span className="flex-1">{bonus.name}</span>
                        <span className="shrink-0 font-mono text-[12px] text-white/40">{formatNaira(bonus.value)}</span>
                      </li>
                    ))}
                    {pkg.key !== "basic" && (
                      <li className="pl-7 font-mono text-[11px] uppercase tracking-wider text-white/35">
                        + every bonus in {pkg.key === "standard" ? "Basic" : "Basic and Standard"}
                      </li>
                    )}
                  </ul>

                  <div className="mt-auto">
                    <ChoosePackageButton pkg={pkg.key} label={`I want ${pkg.name}`} featured={pkg.popular} />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </Section>

        {/* Price reason + scarcity */}
        <Section tone="mist">
          <H2>Why the prices are this low right now</H2>
          <Prose
            className="mt-10"
            lines={[
              "The work we do for you is worth what you pay on its own. The blueprints and tools come free on top of it.",
              "We keep prices low because we only take a limited number of clients each month. That's how every CV gets proper attention instead of being rushed.",
              "**Once this month's slots are full, prices go back to ₦35,000, ₦80,000 and ₦150,000.**",
              "Filling the form doesn't lock you into anything, but it does put you in the queue while there are still slots at these prices.",
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
              <h2 className="mx-auto mt-6 max-w-xl text-balance font-display text-3xl font-semibold leading-[1.1] tracking-[-0.045em] text-white sm:text-[2.6rem]">
                Our 90-day &quot;Get Responses&quot; guarantee
              </h2>
              <Prose
                dark
                className="mt-8 text-left"
                lines={[
                  "We can't promise you a job. Nobody honest can. What we can promise is this.",
                  "Use exactly what we give you for 90 days. Apply to at least 30 roles, in Nigeria or remote, and send the follow-up messages we wrote for you. Keep the one-page log we include.",
                  "If you haven't had a single response from a recruiter or employer by then, send us your log. We'll keep working with you for free until you do.",
                  "We can put this in writing because we've done this work more than 200 times. In our experience, the people who never get a response are the ones who don't use what we give them.",
                ]}
              />
            </div>
          </div>
        </Section>

        {/* LinkedIn before/after + more videos */}
        <Section tone="mist">
          <H2>What a rebuilt LinkedIn profile looks like</H2>
          <Prose className="mt-10 text-center" lines={["These are real before and after shots from two Standard clients."]} />
          <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2">
            {LINKEDIN.map((c, i) => (
              <figure
                key={c.name}
                data-reveal
                style={delay(i * 120)}
                className="flex flex-col rounded-[2rem] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(6,13,41,0.3)] ring-1 ring-ink-900/[0.06] sm:p-7"
              >
                <BeforeAfter name={c.name} before={c.before} after={c.after} />
                <blockquote className="mt-6 flex-1 text-[16px] leading-[1.7] text-ink-600">&ldquo;{c.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 font-display text-sm font-semibold text-ink-900">
                  {c.name} <span className="font-mono text-[11px] font-normal uppercase tracking-wider text-ink-400">· {c.place}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-24">
            <H2 className="sm:text-4xl">More clients, in their own words</H2>
            <VideoGrid videos={VIDEOS_BOTTOM} />
            <div className="mx-auto mt-6 max-w-4xl">
              <Quotes quotes={QUOTES_B} />
            </div>
          </div>
        </Section>

        {/* How it works */}
        <Section>
          <H2>Here&apos;s how it works</H2>
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
                  <span className="mt-2 block text-[15px] leading-[1.7] text-ink-400">{body}</span>
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
                <p className="w-faq-body px-6 pb-6 text-[16px] leading-[1.7] text-ink-400">{a}</p>
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
                <span className="mr-1 font-mono text-[13px] font-semibold text-ink-900">P.P.P.S.</span> Your CV, LinkedIn
                profile or portfolio comes with unlimited revisions, and the 90-day guarantee covers you after that. The
                form costs nothing, so the only risk is staying where you are.
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
            <p data-reveal className="mx-auto mt-6 max-w-md text-center text-[17px] leading-[1.7] text-white/65">
              Answer these five questions and WhatsApp opens with your answers ready to send to our team on{" "}
              <span className="font-semibold text-white">{WRITING_NUMBER_DISPLAY}</span>. You don&apos;t pay anything to
              start the chat.
            </p>
            <div data-reveal className="mt-10">
              <WritingForm />
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 bg-[#040920] pb-24 pt-10 text-center font-mono text-[11px] uppercase tracking-wider text-white/35 sm:pb-10">
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
