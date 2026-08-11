'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const ease = [0.76, 0, 0.24, 1] as const;

const RevealLine = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <span className="block overflow-hidden align-bottom pb-2 -mb-2">
    <motion.span
      className={`block ${className}`}
      initial={{ y: '140%' }}
      animate={{ y: '0%' }}
      transition={{ duration: 1.2, ease, delay }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-[110vh] overflow-hidden border-b border-border px-6 pt-28 pb-16 md:px-10 md:pt-36"
    >
      {/* Top metadata row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 gap-4 border-b border-border pb-8 font-mono text-[10px] uppercase tracking-widest md:grid-cols-4 md:pb-14"
      >
        <div>
          <span className="opacity-50">Est.</span> 2026
        </div>

        <div>
          <span className="opacity-50">Ch.</span> 01 — Prologue
        </div>

        <div>
          <span className="opacity-50">Loc.</span> Everywhere
        </div>

        <div className="text-right">
          <span className="opacity-50">Status</span> Waitlist open
        </div>
      </motion.div>

      {/* Grid layout with kinetic type + parallax image */}
      <div className="relative mt-10 grid grid-cols-12 gap-6 md:mt-16">
        {/* KINETIC HEADLINE */}
        <motion.h1
          style={{ y: titleY }}
          className="font-display col-span-12 flex flex-col uppercase text-[18vw] leading-[0.82] tracking-tight md:text-[15vw]"
        >
          <RevealLine delay={0.15}>The&nbsp;creative</RevealLine>

          <RevealLine delay={0.35} className="text-outline">
            Cult&nbsp;is
          </RevealLine>

          <RevealLine delay={0.55}>
            gathering
            <span className="text-primary">.</span>
          </RevealLine>
        </motion.h1>

        {/* Right-side supporting copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease }}
          className="font-editorial col-span-12 mt-8 text-lg leading-snug md:col-span-5 md:col-start-8 md:mt-16 md:text-xl"
        >
          Where solo talent meets collective power. A home for photographers,
          dancers, directors and every skill in between — hire one, or hire the
          whole cult.
        </motion.div>
      </div>

      {/* Parallax clipped hero image + caption */}
      <div className="relative mt-14 grid grid-cols-12 items-end gap-6 md:mt-24">
        <div className="relative col-span-12 md:col-span-6 md:col-start-1">
          <div className="relative overflow-hidden border border-border">
            <motion.img
              src="https://images.pexels.com/photos/29016243/pexels-photo-29016243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Choreographer in motion"
              style={{ y: imgY, scale: imgScale }}
              className="h-[46vh] w-full object-cover object-center will-change-transform md:h-[62vh]"
            />

            <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between border-t border-border bg-background px-4 py-3 font-mono text-[10px] uppercase">
              <span>Fig. 01 — Ritual in red</span>
              <span className="opacity-60">01 / 04</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-6 md:col-span-5 md:col-start-8">
          <div className="font-mono text-[11px] uppercase tracking-widest opacity-60">
            /01 — Prologue
          </div>

          <p className="font-editorial text-2xl leading-tight md:text-3xl">
            We built the marketplace we never had.
            <br />
            <span className="text-primary">No middlemen.</span> No noise. Just
            craft, currency and community.
          </p>

          <div className="mt-2 flex items-center gap-4">
            <button
              data-testid="hero-scroll-cta"
              onClick={() =>
                document.getElementById('manifesto')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
              className="group relative overflow-hidden border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
            >
              <span className="absolute inset-0 translate-y-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

              <span className="relative z-10 transition-colors duration-500 group-hover:text-primary-foreground">
                Read manifesto &nbsp;↓
              </span>
            </button>

            <span className="font-mono text-[10px] uppercase opacity-60">
              1,284 creatives already inside
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
