"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Stage from "@/components/Stage";
import Reveal from "@/components/Reveal";
import { stage, SCENTS } from "@/lib/stage";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - t0) / 1400, 1);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const CRAFT = [
  { v: 27, s: "%", label: "Parfum concentration", sub: "Extrait strength — two sprays last the day" },
  { v: 214, s: "", label: "Hand-finishing steps", sub: "Cut, polished, filled and checked by hand" },
  { v: 61, s: " g", label: "Solid brass cap", sub: "Weighted like a watch crown" },
  { v: 75, s: " ml", label: "In every flacon", sub: "Roughly 900 sprays" },
];

export default function Page() {
  const [scent, setScent] = useState(0);
  const [reserved, setReserved] = useState(false);

  useEffect(() => { stage.scent = scent; }, [scent]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.0 });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  const jumpToScents = (i: number) => {
    setScent(i);
    const el = document.getElementById("stage3d");
    if (el) window.scrollTo({ top: el.offsetTop + window.innerHeight * 2.35, behavior: "smooth" });
  };

  const s = SCENTS[scent];

  return (
    <main>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <a href="#" className="font-display font-medium text-[1.35rem] tracking-wide">NOIRÉ</a>
          <nav className="hidden md:flex gap-8 font-mono text-[11px] tracking-[0.25em] text-cream/60">
            <a href="#notes" className="hover:text-gold transition">NOTES</a>
            <a href="#craft" className="hover:text-gold transition">CRAFT</a>
            <a href="#collection" className="hover:text-gold transition">COLLECTION</a>
          </nav>
          <a href="#reserve" className="rounded-full bg-cream text-ink font-display font-medium text-[0.95rem] px-5 py-2 hover:bg-gold transition">Reserve — ${s.price}</a>
        </div>
      </header>

      <Stage scent={scent} setScent={setScent} />

      {/* Marquee */}
      <div className="border-y border-white/10 py-4 overflow-hidden bg-panel/60">
        <div className="marquee-track flex whitespace-nowrap font-display text-lg md:text-xl text-cream/75 w-max">
          {[0, 1].map((k) => (
            <span key={k} className="flex">
              {["EXTRAIT DE PARFUM", "HAND-CUT GLASS", "SOLID BRASS", "SMALL BATCH — 500 FLACONS", "REAL 3D — NOT A PHOTOGRAPH", "MADE IN GRASSE"].map((t) => (
                <span key={t} className="mx-6 flex items-center gap-12">{t}<span className="text-gold">·</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <section id="notes" className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.4em] text-gold">03 · THE PYRAMID</p>
          <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.02] mt-4">A pyramid in three acts — <em style={{ color: s.accent }}>{s.name}</em></h2>
          <p className="text-muted mt-5 max-w-xl leading-relaxed">{s.desc}</p>
          <div className="flex gap-2 mt-7">
            {SCENTS.map((sc, i) => (
              <button key={sc.name} onClick={() => setScent(i)} className={`rounded-full px-5 py-2.5 font-display transition border ${scent === i ? "text-ink border-transparent" : "border-white/15 hover:border-white/40"}`} style={scent === i ? { background: sc.accent } : {}}>
                {sc.name}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {[
            { k: "TOP", t: "The first fifteen minutes", v: s.notes.top },
            { k: "HEART", t: "The character, for hours", v: s.notes.heart },
            { k: "BASE", t: "What lingers on skin at midnight", v: s.notes.base },
          ].map((n, i) => (
            <Reveal key={n.k} delay={i * 80}>
              <div className="rounded-2xl border border-white/10 bg-panel p-7 md:p-8 h-full hover:border-gold/40 transition">
                <p className="font-mono text-[11px] tracking-[0.35em]" style={{ color: s.accent }}>{n.k} NOTES</p>
                <p className="font-display text-2xl mt-4 leading-snug">{n.v}</p>
                <p className="text-muted text-sm mt-3">{n.t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Craft */}
      <section id="craft" className="border-y border-white/10 bg-panel/40">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-28">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold">04 · CRAFT</p>
            <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.02] mt-4">Obsessed over,<br />on purpose.</h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {CRAFT.map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <div className="rounded-2xl border border-white/10 bg-panel p-6 md:p-8 h-full hover:border-gold/40 transition">
                  <p className="font-display font-light text-5xl md:text-6xl"><CountUp to={c.v} suffix={c.s} /></p>
                  <p className="font-display text-lg mt-3">{c.label}</p>
                  <p className="text-muted text-sm mt-1">{c.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.4em] text-gold">05 · THE COLLECTION</p>
          <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.02] mt-4">Choose your signature.</h2>
          <p className="text-muted mt-4 max-w-lg leading-relaxed">Tap a scent and the bottle above fills with it — the liquid you see is the liquid that ships.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {SCENTS.map((sc, i) => (
            <Reveal key={sc.name} delay={i * 80}>
              <article className={`rounded-3xl border p-7 h-full flex flex-col transition ${scent === i ? "bg-panel" : "border-white/10 bg-panel/50 hover:border-white/30"}`} style={scent === i ? { borderColor: sc.accent } : {}}>
                <div className="h-36 rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${sc.liquid}33, ${sc.liquid}99 55%, ${sc.accent})` }}>
                  <span className="absolute bottom-3 left-4 font-display italic text-2xl text-cream/90">{sc.line}</span>
                  <span className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.25em] text-cream/70">75 ML</span>
                </div>
                <h3 className="font-display text-3xl mt-6">{sc.name}</h3>
                <p className="text-muted text-sm leading-relaxed mt-2 flex-1">{sc.desc}</p>
                <p className="font-mono text-[11px] tracking-[0.15em] text-cream/50 mt-4">{sc.notes.top.toUpperCase()} → {sc.notes.base.toUpperCase()}</p>
                <div className="flex items-center justify-between mt-6">
                  <span className="font-display text-2xl">${sc.price}</span>
                  <button onClick={() => jumpToScents(i)} className="rounded-full px-5 py-2.5 font-display transition text-ink hover:brightness-110" style={{ background: sc.accent }}>
                    {scent === i ? "In the bottle now" : "Fill the bottle"}
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" className="border-t border-white/10 bg-panel/40">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-28 grid lg:grid-cols-2 gap-12">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold">06 · RESERVE</p>
            <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.02] mt-4">Batch No. 9 is<br />almost gone.</h2>
            <p className="text-muted mt-5 leading-relaxed max-w-md">Reserve a flacon of {s.name}. No payment today — we write to you when your bottle is filled, sealed and numbered by hand.</p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Numbered flacon from a batch of 500", "Free worldwide shipping, insured", "Two 2 ml vials included — try before you open", "Lifetime refill service at the Paris atelier"].map((t) => (
                <li key={t} className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.accent }} />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            {reserved ? (
              <div className="rounded-3xl border bg-panel p-8 md:p-10 text-center" style={{ borderColor: s.accent }}>
                <p className="font-display font-light text-3xl md:text-4xl">Your flacon is held.</p>
                <p className="text-muted mt-3 leading-relaxed">One {s.name}, reserved in your name from Batch No. 9. Watch your inbox — and go lift the cap once more while you wait.</p>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-6 rounded-full text-ink font-display px-6 py-3 hover:brightness-110 transition" style={{ background: s.accent }}>Back to the bottle</button>
              </div>
            ) : (
              <form className="rounded-3xl border border-white/10 bg-panel p-8 md:p-10 space-y-4" onSubmit={(e) => { e.preventDefault(); setReserved(true); }}>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cream/50">YOUR NAME</span>
                  <input required placeholder="Camille Laurent" className="mt-2 w-full rounded-xl bg-ink border border-white/10 px-4 py-3 outline-none focus:border-gold transition placeholder:text-cream/25" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cream/50">EMAIL</span>
                  <input required type="email" placeholder="camille@email.com" className="mt-2 w-full rounded-xl bg-ink border border-white/10 px-4 py-3 outline-none focus:border-gold transition placeholder:text-cream/25" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cream/50">SCENT</span>
                  <select value={scent} onChange={(e) => setScent(Number(e.target.value))} className="mt-2 w-full rounded-xl bg-ink border border-white/10 px-4 py-3 outline-none focus:border-gold transition">
                    {SCENTS.map((sc, i) => <option key={sc.name} value={i}>{sc.name} — ${sc.price}</option>)}
                  </select>
                </label>
                <button className="w-full rounded-full text-ink font-display font-medium text-lg py-3.5 hover:brightness-110 transition" style={{ background: s.accent }}>Reserve my {s.name}</button>
                <p className="text-center text-muted text-xs">Demo storefront — no payment is taken.</p>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-14">
          <p className="font-display font-light text-[20vw] md:text-[10rem] leading-none text-white/5 select-none">NOIRÉ</p>
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 text-sm text-muted">
            <p>NOIRÉ — a concept fragrance site with a real-time 3D glass flacon (Three.js / WebGL) and buttery Lenis scrolling. Every angle rendered live; there are no product photographs.</p>
            <p className="shrink-0">Designed & built by Ali Rizwan</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
