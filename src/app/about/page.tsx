import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/marketing/Footer";
import ScrollReveal from "@/components/marketing/ScrollReveal";

export const metadata: Metadata = {
  title: "About Us — The Team Behind 3DMates",
  description:
    "Meet the AI integration and deployment specialists behind 3DMates. A team spanning Duke University, top UK engineering programs, Unreal Engine, computer vision, and 15 years of proven business operations — serving engineering firms in the Charlotte area.",
};

const CALENDLY = "https://calendly.com/moisesjdelcastillo/30min";

type Member = {
  name: string;
  role: string;
  initials: string;
  image?: string; // drop a file in /public/team and set the path here
  badge?: string;
  link?: { href: string; label: string };
  bio: string;
  highlights: string[];
  accent: "cyan" | "violet" | "amber" | "emerald";
};

const team: Member[] = [
  {
    name: "Moises del Castillo",
    role: "Founder & AI / 3D Lead",
    initials: "MdC",
    image: "/team/moises.png",
    badge: "Charlotte Network Lead",
    link: {
      href: "https://www.linkedin.com/in/moisesjdelcastillo/",
      label: "LinkedIn",
    },
    bio: "Moises drives the technical vision of 3DMates. He has worked hands-on with Unreal Engine, computer vision, and applied AI to build real-time 3D and spatial systems — and is now extending that work into NVIDIA Omniverse. He bridges the gap between cutting-edge AI tooling and the practical, day-to-day deployment that engineering teams actually need.",
    highlights: [
      "Unreal Engine & real-time 3D",
      "Computer vision & applied AI",
      "Learning NVIDIA Omniverse",
    ],
    accent: "cyan",
  },
  {
    name: "Kevin Wang",
    role: "Software Engineer",
    initials: "KW",
    image: "/team/kevin.png",
    badge: "Duke University · Computer Science",
    link: {
      href: "https://www.linkedin.com/in/kevin-w-62163689/",
      label: "LinkedIn",
    },
    bio: "Kevin studied Computer Science at Duke University — one of the most respected CS programs in the country. He brings rigorous engineering fundamentals and clean, production-grade software practices to every 3DMates integration, making sure what we ship is reliable, maintainable, and built to last.",
    highlights: [
      "Duke University, Computer Science",
      "Production-grade software engineering",
      "Systems & integration architecture",
    ],
    accent: "violet",
  },
  {
    name: "Waqar Saeed",
    role: "AR & Computer Vision Engineer",
    initials: "WS",
    image: "/team/waqar.png",
    badge: "Ulster University, UK",
    link: {
      href: "https://www.linkedin.com/in/waqarsaeed533/",
      label: "LinkedIn",
    },
    bio: "Waqar was educated at Ulster University in the UK and works as a Unity AR developer specializing in computer vision and AI. He builds the immersive, vision-driven interfaces that turn complex 3D and engineering data into something teams can actually see, understand, and use.",
    highlights: [
      "Ulster University, UK",
      "Unity AR development",
      "Computer vision & AI",
    ],
    accent: "amber",
  },
  {
    name: "Santiago Vega",
    role: "3D Printing & Operations Lead",
    initials: "SV",
    image: "/team/santiago.png",
    badge: "15 Years · Profitable Every Year",
    link: {
      href: "https://uniontreeexperts.biz/",
      label: "Union Tree Experts",
    },
    bio: "Santiago is a 3D printing and welding expert who spent 15 years building and running Union Tree Experts — the most successful tree-service business in Union County, profitable every single year. He pairs deep hands-on fabrication skill with the operational discipline of a proven business owner who knows how to deliver, on time and on budget.",
    highlights: [
      "3D printing & welding expert",
      "Ran a 15-year profitable business",
      "#1 in Union County in his field",
    ],
    accent: "emerald",
  },
];

const accentMap: Record<
  Member["accent"],
  { ring: string; bg: string; text: string; badge: string }
> = {
  cyan: {
    ring: "ring-cyan/30",
    bg: "bg-cyan/10",
    text: "text-cyan",
    badge: "border-cyan/30 bg-cyan/10 text-cyan",
  },
  violet: {
    ring: "ring-violet-700/30",
    bg: "bg-violet-900/20",
    text: "text-violet-300",
    badge: "border-violet-700/30 bg-violet-900/20 text-violet-300",
  },
  amber: {
    ring: "ring-amber-700/30",
    bg: "bg-amber-900/20",
    text: "text-amber-300",
    badge: "border-amber-700/30 bg-amber-900/20 text-amber-300",
  },
  emerald: {
    ring: "ring-emerald-700/30",
    bg: "bg-emerald-900/20",
    text: "text-emerald-300",
    badge: "border-emerald-700/30 bg-emerald-900/20 text-emerald-300",
  },
};

const trustPoints = [
  {
    title: "Credentials that hold up",
    desc: "Engineers trained at Duke University and a top-ranked UK university — the same standard your own technical leads are held to.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0FB6C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    title: "Proven operators",
    desc: "Not just researchers. Our team includes a business owner who ran a profitable operation for 15 years — we understand deadlines, budgets, and accountability.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-9M14 17H5" />
        <circle cx="17" cy="17" r="3" />
        <circle cx="7" cy="7" r="3" />
      </svg>
    ),
  },
  {
    title: "Deep AI & 3D expertise",
    desc: "Unreal Engine, computer vision, real-time 3D, AR, and NVIDIA Omniverse — the modern stack for AI integration, applied to real engineering problems.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9h6v6H9z" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </svg>
    ),
  },
  {
    title: "Local to Charlotte",
    desc: "We serve engineering firms across the Charlotte area in person — close enough to sit at the table, scope the work, and deploy alongside your team.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="noise-overlay relative overflow-hidden py-24 sm:py-36">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(15, 182, 200, 0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,182,200,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15,182,200,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <span className="mb-6 inline-block rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan">
              About 3DMates
            </span>
            <h1 className="text-glow-cyan text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              The team behind your{" "}
              <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
                AI integration
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
              3DMates is the AI integration and deployment partner for
              engineering firms in the Charlotte area. We combine top-tier
              engineering education, real-world operating experience, and deep
              expertise in AI, computer vision, and 3D to deploy systems your
              team can actually rely on.
            </p>
            <div className="mt-10">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-10 py-4 text-sm font-bold text-black sm:text-base"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Talk to the team
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ MEET THE TEAM ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #0FB6C8 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Meet the team
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-brand-muted sm:text-base">
                A rare mix of academic pedigree, frontier AI experience, and
                hard-won business operating chops.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {team.map((m, i) => {
              const cls = accentMap[m.accent];
              return (
                <ScrollReveal key={m.name} delay={i * 120}>
                  <div className="glass-card flex h-full flex-col gap-5 rounded-3xl p-7 sm:flex-row sm:p-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div
                        className={`flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl sm:h-40 sm:w-40 ${cls.bg} ring-1 ${cls.ring}`}
                      >
                        {m.image ? (
                          <Image
                            src={m.image}
                            alt={m.name}
                            width={256}
                            height={256}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className={`text-3xl font-black ${cls.text}`}>
                            {m.initials}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-brand-text">
                        {m.name}
                      </h3>
                      <p className={`text-sm font-semibold ${cls.text}`}>
                        {m.role}
                      </p>
                      {m.badge && (
                        <span
                          className={`mt-2 inline-block self-start rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${cls.badge}`}
                        >
                          {m.badge}
                        </span>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                        {m.bio}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {m.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-sm text-brand-muted"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#0FB6C8"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mt-0.5 flex-shrink-0"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {h}
                          </li>
                        ))}
                      </ul>

                      {m.link && (
                        <a
                          href={m.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-cyan transition hover:text-cyan-hover"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                          </svg>
                          {m.link.label}
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ WHY ENGINEERING FIRMS TRUST US ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Built for{" "}
                <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
                  engineering firms
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-brand-muted sm:text-base">
                Handing AI deployment to an outside team takes trust. Here is why
                firms across Charlotte are comfortable building with us.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 100}>
                <div className="glass-card flex h-full flex-col rounded-2xl p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bg ring-1 ring-brand-border">
                    {p.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-brand-text">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {p.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT WE BRING ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="glass-card relative overflow-hidden rounded-3xl">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-[0.07]"
                style={{
                  background:
                    "radial-gradient(circle, #0FB6C8 0%, transparent 70%)",
                }}
              />
              <div className="relative p-8 sm:p-12">
                <span className="inline-block rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1 text-xs font-medium tracking-wide text-cyan">
                  Our Mission
                </span>
                <h2 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
                  AI integration, deployed by people who ship.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                  Engineering firms know AI can transform how they design,
                  quote, and build — but plugging it into a real workflow is
                  hard, and most teams do not have the time to do it right. That
                  is where we come in. 3DMates acts as your dedicated AI
                  integration and deployment team: we scope the opportunity,
                  build the system, and stay accountable for getting it live and
                  working. From computer vision and real-time 3D to
                  AI-assisted automation, we bring frontier technology down to
                  earth — and into your shop.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="noise-overlay relative overflow-hidden py-24 sm:py-32">
        <div className="section-divider absolute inset-x-0 top-0" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(15, 182, 200, 0.1) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <h2 className="text-glow-cyan text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s build your{" "}
              <span className="bg-gradient-to-r from-cyan to-[#0DD9EF] bg-clip-text text-transparent">
                AI deployment
              </span>
            </h2>
            <p className="mt-5 text-sm text-brand-muted sm:text-base">
              Book a call with Moises del Castillo — our Charlotte Network Lead —
              and find out how 3DMates can become the AI integration team behind
              your engineering firm.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-10 py-4 text-sm font-bold text-black sm:text-base"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a Call
              </a>
              <Link
                href="/providers-growth"
                className="btn-secondary inline-flex items-center justify-center rounded-2xl px-9 py-3.5 text-sm font-bold text-cyan"
              >
                For Providers
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
