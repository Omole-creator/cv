/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Image from "next/image";
import { Check, Gift, Play, ShieldCheck } from "lucide-react";
import {
  ApplyButton,
  ChoosePackageButton,
  PackageProvider,
} from "@/components/writing/PackageContext";
import WritingForm from "@/components/writing/WritingForm";
import StickyCta from "@/components/writing/StickyCta";
import {
  formatNaira,
  PACKAGES,
  totalBonusValue,
  WRITING_NUMBER_DISPLAY,
} from "@/lib/writingPackages";

export const metadata: Metadata = {
  title: "CV Writing That Gets Replies | JobMingle",
  description:
    "Ayomide sent CVs for 5 months and heard nothing. Less than a week after we rewrote hers, 5 companies replied. Get your CV rewritten in 24 to 48 hours.",
};

// Paragraph helper. Lines wrapped in ** render bold, so copy can stay as
// plain strings without escaping quotes and apostrophes in JSX.
function Prose({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <div className={`space-y-4 text-[17px] leading-relaxed text-ink-600 ${className}`}>
      {lines.map((line) =>
        line.startsWith("**") ? (
          <p key={line} className="font-semibold text-ink-900">
            {line.slice(2).replace(/\*\*$/, "")}
          </p>
        ) : (
          <p key={line}>{line}</p>
        )
      )}
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
      {children}
    </h2>
  );
}

function Section({
  children,
  id,
  tint,
}: {
  children: React.ReactNode;
  id?: string;
  tint?: boolean;
}) {
  return (
    <section id={id} className={tint ? "bg-white py-16 sm:py-20" : "py-16 sm:py-20"}>
      <div className="mx-auto max-w-2xl px-4 sm:px-5">{children}</div>
    </section>
  );
}

function Photo({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      className="my-8 w-full rounded-2xl border border-ink-900/10 object-cover"
    />
  );
}

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
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {videos.map((v) => (
        <a
          key={v.id}
          href={`https://www.youtube.com/watch?v=${v.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-xl border border-ink-900/10 bg-white"
        >
          <div className="relative aspect-video bg-ink-900">
            <img
              src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
              alt={`${v.name} talks about working with JobMingle`}
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink-900">
                <Play className="h-5 w-5 fill-current" />
              </span>
            </span>
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold text-ink-900">{v.name}</p>
            <p className="text-xs text-ink-400">{v.role} · Watch their story</p>
          </div>
        </a>
      ))}
    </div>
  );
}

type Quote = { name: string; role: string; img: string; text: string };

function Quotes({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="mt-8 space-y-4">
      {quotes.map((q) => (
        <figure key={q.name} className="rounded-2xl border border-ink-900/10 bg-paper p-5">
          <blockquote className="text-[16px] leading-relaxed text-ink-600">&ldquo;{q.text}&rdquo;</blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <Image
              src={q.img}
              alt={q.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <span>
              <span className="block text-sm font-semibold text-ink-900">{q.name}</span>
              <span className="block text-xs text-ink-400">{q.role}</span>
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

export default function WritingPage() {
  return (
    <PackageProvider>
      <main>
        {/* Nav */}
        <header className="sticky top-0 z-40 border-b border-ink-900/5 bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-5">
            <a href="#top" className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="JobMingle"
                height={36}
                width={36}
                style={{ height: 36, width: 36 }}
                className="rounded-full"
                priority
              />
              <span className="font-display text-lg font-medium text-ink-900">JobMingle</span>
            </a>
            <a
              href="#apply"
              className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Get started
            </a>
          </div>
        </header>

        {/* Hero */}
        <section id="top" className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-5 sm:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,#F4CB19,transparent)] opacity-40 blur-3xl"
          />
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-gold-600/30 bg-gold/15 px-4 py-1.5 text-sm font-semibold text-ink-900">
              For anyone who has sent CV after CV and heard nothing back
            </span>
            <h1 className="font-display mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-ink-900 sm:text-5xl">
              Ayomide applied for 5 months and heard nothing. Then we changed how her CV
              sold her, and 5 companies replied in less than a week.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-400">
              A few days later, she had a job offer. Below, you&apos;ll see the most common mistake we
              fix in CVs like hers, why yours is probably making it too, and how we can fix yours
              in as little as 24 hours.
            </p>
            <div className="mt-8 flex flex-col items-center gap-2.5">
              <ApplyButton label="Yes, I want more interview invites" />
              <p className="text-sm text-ink-400">It&apos;s a 1-minute form, and you don&apos;t pay anything to fill it.</p>
            </div>
            <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3 text-center">
              {[
                ["203", "CVs rebuilt"],
                ["800+", "CVs reviewed"],
                ["600+", "people landed jobs through our platforms in 2025"],
              ].map(([n, label]) => (
                <div key={label} className="rounded-xl border border-ink-900/10 bg-white px-2 py-3">
                  <dt className="font-display text-2xl font-semibold text-ink-900">{n}</dt>
                  <dd className="mt-0.5 text-xs leading-snug text-ink-400">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Lead */}
        <Section tint>
          <Prose
            lines={[
              "**Dear Jobseeker,**",
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
            className="mt-6"
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
        <Section>
          <H2>But here is the truth you need to hear right now</H2>
          <Prose
            className="mt-6"
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
          <figure className="mx-auto my-8 max-w-sm">
            <Image
              src="/writing/client-underselling.jpg"
              alt="Victoria Harry's WhatsApp message saying the new CV showed she had been underselling herself, and that she is now getting callbacks and has an interview with a hospital in Lagos"
              width={700}
              height={1102}
              className="w-full rounded-2xl border border-ink-900/10"
            />
            <figcaption className="mt-3 text-center text-sm text-ink-400">
              Victoria Harry: &ldquo;I had been underselling myself.&rdquo; Now she&apos;s getting callbacks.
            </figcaption>
          </figure>
          <Prose
            lines={[
              "There's a second problem too. Many companies, in Nigeria and abroad, run every CV through software before a person reads it. If the software can't read your CV properly, nobody sees how good you are, however well it's written.",
              "**That's why we built the JobMingle 3-Step Interview Invitation System to fix both problems at once.**",
            ]}
          />
          <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="font-semibold text-ink-900">&ldquo;But don&apos;t you need connections to get a job in Nigeria?&rdquo;</p>
            <p className="mt-2 text-ink-600">
              Knowing somebody helps, and we won&apos;t pretend it doesn&apos;t. But companies still post
              jobs online every day, and somebody still gets them. Ayomide and Victoria got their
              replies by sending out CVs. A CV that sells you properly is how you compete when
              you don&apos;t have an uncle in the company.
            </p>
          </div>
        </Section>

        {/* Ayomide + solution mechanism */}
        <Section tint>
          <H2>One of the 203 people we&apos;ve helped was Ayomide</H2>
          <Prose
            className="mt-6"
            lines={[
              "We've used this system for 203 jobseekers so far. They were qualified, hardworking people doing almost everything right, but still hitting the same wall you're hitting now.",
              "Ayomide had been job hunting for 5 months. Even with her effort and her qualifications, nothing came back.",
              "We didn't just fix her grammar or give her CV a new design. We took it through our 3-Step Interview Invitation System.",
            ]}
          />
          <ol className="mt-8 space-y-4">
            {[
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
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-ink-900/10 bg-paper p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold font-display font-semibold text-ink-900">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold text-ink-900">{title}</span>
                  <span className="mt-1 block text-ink-600">{body}</span>
                </span>
              </li>
            ))}
          </ol>
          <Prose
            className="mt-8"
            lines={[
              "Less than a week later, she sent our team this message.",
            ]}
          />
          <figure className="mx-auto my-8 max-w-xs">
            <Image
              src="/writing/ayomide-replies.jpg"
              alt="Ayomide's WhatsApp message saying she got replies from 5 companies in less than a week, followed by an offer of employment"
              width={485}
              height={865}
              className="w-full rounded-2xl border border-ink-900/10"
            />
            <figcaption className="mt-3 text-center text-sm text-ink-400">
              Look at the bottom of the chat. A few days later she sent her offer letter.
            </figcaption>
          </figure>
          <Prose lines={["**And Ayomide isn't the only one. Here's what other clients said after working with us.**"]} />
          <VideoGrid videos={VIDEOS_TOP} />
          <Quotes quotes={QUOTES_A} />
        </Section>

        {/* 5 mistakes */}
        <Section>
          <H2>The 5 costly mistakes that keep good people stuck</H2>
          <Prose
            className="mt-6"
            lines={[
              "You see, if you want more interview invites and a move into a better-paying role, you have to avoid these 5 costly mistakes.",
            ]}
          />
          <ol className="mt-8 space-y-5">
            {MISTAKES.map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <span className="font-display text-2xl font-semibold text-gold-600">{i + 1}</span>
                <span>
                  <span className="block font-semibold text-ink-900">{title}</span>
                  <span className="mt-1 block text-ink-600">{body}</span>
                </span>
              </li>
            ))}
          </ol>
          <Prose
            className="mt-8"
            lines={[
              "We fix the first two for every client. Standard and Premium fix the last two as well, and you'll see how below.",
            ]}
          />
        </Section>

        {/* Future pacing + remote proof */}
        <Section tint>
          <H2>Imagine how your life changes when you finally land that job</H2>
          <Prose
            className="mt-6"
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
          <figure className="mx-auto my-8 max-w-xs">
            <Image
              src="/writing/lucille-remote.jpg"
              alt="Lucille's WhatsApp message saying she got a remote customer service job that pays over $2,000"
              width={540}
              height={940}
              className="w-full rounded-2xl border border-ink-900/10"
            />
          </figure>
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
        <Section id="packages">
          <H2>Here is everything you get</H2>
          <Prose
            className="mt-6"
            lines={[
              "Whether you want a role here in Nigeria or a remote job that pays in dollars, your problem is the same. You are good enough, but the people who decide can't see it fast enough.",
              "We fix that in days. And we don't hand you documents and wave goodbye. We hand you the whole system that turns those documents into interviews.",
              "**Choose a package, and here's what lands in your hands. You don't pay on this page. Choosing one just fills in your form at the bottom.**",
            ]}
          />
        </Section>
        <div className="mx-auto -mt-8 grid max-w-5xl gap-5 px-4 pb-16 sm:px-5 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.key}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 ${
                pkg.popular ? "border-gold-600 shadow-card ring-2 ring-gold" : "border-ink-900/10"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-0.5 text-xs font-semibold text-ink-900">
                  Most popular
                </span>
              )}
              <p className="text-sm font-semibold uppercase tracking-wide text-ink-400">{pkg.name}</p>
              <h3 className="font-display mt-1 text-xl font-semibold text-ink-900">{pkg.system}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-ink-900">{formatNaira(pkg.price)}</span>
                <span className="text-sm text-ink-400 line-through">{formatNaira(pkg.oldPrice)}</span>
              </p>
              <p className="mt-1 text-sm text-ink-400">Ready in {pkg.delivery}</p>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-900">What we do for you</p>
              <ul className="mt-2 space-y-2">
                {pkg.work.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-ink-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-900">Free bonuses</p>
              <ul className="mt-2 space-y-2">
                {pkg.bonuses.map((bonus) => (
                  <li key={bonus.name} className="flex gap-2 text-sm text-ink-600">
                    <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <span>
                      {bonus.name}{" "}
                      <span className="whitespace-nowrap font-semibold text-ink-900">
                        (worth {formatNaira(bonus.value)})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mb-6 mt-4 rounded-lg bg-gold-50 px-3 py-2 text-sm text-ink-900">
                {pkg.key === "basic"
                  ? "Total bonus value: "
                  : pkg.key === "standard"
                    ? "Total bonus value, including the Basic bonuses: "
                    : "Total bonus value, including the Basic and Standard bonuses: "}
                <span className="font-semibold">{formatNaira(totalBonusValue(pkg.key))}</span>. Yours free.
              </p>

              <div className="mt-auto">
                <ChoosePackageButton pkg={pkg.key} label={`I want ${pkg.name}`} featured={pkg.popular} />
              </div>
            </article>
          ))}
        </div>

        {/* Price reason + scarcity */}
        <Section tint>
          <H2>Why the prices are this low right now</H2>
          <Prose
            className="mt-6"
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
          <div className="rounded-2xl border-2 border-gold bg-gold-50 p-6 sm:p-8">
            <ShieldCheck className="h-10 w-10 text-gold-600" />
            <h2 className="font-display mt-3 text-2xl font-semibold text-ink-900 sm:text-3xl">
              Our 90-day &quot;Get Responses&quot; guarantee
            </h2>
            <Prose
              className="mt-5"
              lines={[
                "We can't promise you a job. Nobody honest can. What we can promise is this.",
                "Use exactly what we give you for 90 days. Apply to at least 30 roles, in Nigeria or remote, and send the follow-up messages we wrote for you. Keep the one-page log we include.",
                "If you haven't had a single response from a recruiter or employer by then, send us your log. We'll keep working with you for free until you do.",
                "We can put this in writing because we've done this work more than 200 times. In our experience, the people who never get a response are the ones who don't use what we give them.",
              ]}
            />
          </div>
        </Section>

        {/* LinkedIn before/after + more videos */}
        <Section tint>
          <H2>What a rebuilt LinkedIn profile looks like</H2>
          <Prose className="mt-6" lines={["These are real before and after shots from two Standard clients."]} />
          {[
            {
              name: "Victor Morolayo",
              place: "Oyo State",
              quote:
                "This optimization has given me more confidence in how I present myself professionally, and I'm grateful for the work you guys put into making it stand out.",
              before: ["/writing/victor-before.jpg", 1000, 435],
              after: ["/writing/victor-after.jpg", 1000, 515],
            },
            {
              name: "Temiloluwa Makinde",
              place: "Lagos State",
              quote: "Good job. What I was most inspired about was the post as well.",
              before: ["/writing/temi-before.jpg", 1000, 729],
              after: ["/writing/temi-after.jpg", 1000, 634],
            },
          ].map((c) => (
            <figure key={c.name} className="mt-8 rounded-2xl border border-ink-900/10 bg-paper p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["Before", c.before],
                    ["After", c.after],
                  ] as const
                ).map(([label, [src, w, h]]) => (
                  <div key={label}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
                    <Image
                      src={src as string}
                      alt={`${c.name}'s LinkedIn profile ${label.toLowerCase()} JobMingle rebuilt it`}
                      width={w as number}
                      height={h as number}
                      className="w-full rounded-lg border border-ink-900/10"
                    />
                  </div>
                ))}
              </div>
              <blockquote className="mt-4 text-ink-600">&ldquo;{c.quote}&rdquo;</blockquote>
              <figcaption className="mt-2 text-sm font-semibold text-ink-900">
                {c.name} <span className="font-normal text-ink-400">· {c.place}</span>
              </figcaption>
            </figure>
          ))}
          <div className="mt-12">
            <Prose lines={["**More clients, in their own words**"]} />
            <VideoGrid videos={VIDEOS_BOTTOM} />
            <Quotes quotes={QUOTES_B} />
          </div>
        </Section>

        {/* How it works */}
        <Section>
          <H2>Here&apos;s how it works</H2>
          <ol className="mt-8 space-y-5">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold text-ink-900">{title}</span>
                  <span className="mt-1 block text-ink-600">{body}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <ApplyButton label="Yes, I want more interview invites" />
          </div>
        </Section>

        {/* FAQ */}
        <Section tint>
          <H2>Questions people ask before they start</H2>
          <div className="mt-8 divide-y divide-ink-900/10 rounded-2xl border border-ink-900/10 bg-paper">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-900">
                  {q}
                  <span className="text-xl text-ink-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-ink-600">{a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* Close */}
        <Section>
          <H2>Right now, the ball is in your court</H2>
          <Prose
            className="mt-6"
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
          <p className="mt-6 font-semibold text-ink-900">JobMingle Career Acceleration Team</p>

          <div className="mt-10 space-y-4 border-t border-ink-900/10 pt-8 text-[16px] leading-relaxed text-ink-600">
            <p>
              <span className="font-semibold text-ink-900">P.S.</span> Remember what Victoria told us:
              &ldquo;I had been underselling myself.&rdquo; If your CV only lists your duties, it&apos;s
              probably doing the same thing to you. Fill in the form before this month&apos;s slots
              are gone.
            </p>
            <p>
              <span className="font-semibold text-ink-900">P.P.S.</span> When you get started this
              month, we&apos;ll add you to our private career group. That&apos;s where we sometimes share
              job openings from companies that ask us to recommend people.
            </p>
            <p>
              <span className="font-semibold text-ink-900">P.P.P.S.</span> Your CV, LinkedIn profile or
              portfolio comes with unlimited revisions, and the 90-day guarantee covers you after
              that. The form costs nothing, so the only risk is staying where you are.
            </p>
          </div>
        </Section>

        {/* Form */}
        <section id="apply" className="scroll-mt-16 bg-ink-900 py-16 sm:py-20">
          <div className="mx-auto max-w-xl px-4 sm:px-5">
            <div className="text-center">
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Tell us about your job search
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ink-100">
                Answer these five questions and WhatsApp opens with your answers ready to send to
                our team on {WRITING_NUMBER_DISPLAY}. You don&apos;t pay anything to start the chat.
              </p>
            </div>
            <div className="mt-8">
              <WritingForm />
            </div>
          </div>
        </section>

        <footer className="border-t border-ink-900/10 bg-white pb-24 pt-8 text-center sm:pb-8 text-xs text-ink-400">
          <p className="mx-auto mb-3 max-w-xl px-4">
            The stories on this page are from real JobMingle clients. Results vary from person to
            person, and nobody can promise you a job.
          </p>
          © {new Date().getFullYear()} JobMingle Limited. All rights reserved.
        </footer>

        <StickyCta />
      </main>
    </PackageProvider>
  );
}
