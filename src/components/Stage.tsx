"use client";

import React, { useEffect, useRef, useState } from "react";
import Scene3D from "./Scene3D";
import { stage, SCENTS } from "@/lib/stage";

export default function Stage({ scent, setScent }: { scent: number; setScent: (i: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [prog, setProg] = useState(0);
  const [capOpen, setCapOpen] = useState(false);

  const lastRef = useRef({ act: 0, pct: -1 });
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / total));
        stage.progress = p;
        const a = p < 0.3 ? 0 : p < 0.66 ? 1 : 2;
        const pct = Math.round(p * 100);
        if (a !== lastRef.current.act) { lastRef.current.act = a; setAct(a); }
        if (pct !== lastRef.current.pct) { lastRef.current.pct = pct; setProg(p); }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const open = act === 1;
    setCapOpen(open);
    stage.capTarget = open ? 1 : 0;
  }, [act]);

  const toggleCap = () => {
    const next = !capOpen;
    setCapOpen(next);
    stage.capTarget = next ? 1 : 0;
  };

  const panel = "transition-all duration-700 ease-out";
  const show = (a: number) => (act === a ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none");

  return (
    <div ref={wrapRef} id="stage3d" className="relative" style={{ height: "340vh", ["--glow" as string]: SCENTS[scent].glow }}>
      <div className="sticky top-0 h-screen overflow-hidden stage-bg grain">
        <Scene3D />

        {/* Act 0 — hero */}
        <div className={`absolute inset-0 pointer-events-none ${panel} ${show(0)}`}>
          <div className="absolute top-24 md:top-28 left-0 right-0 text-center px-5">
            <p className="font-mono text-[11px] md:text-xs tracking-[0.4em] text-gold">MAISON NOIRÉ · PARIS</p>
            <h1 className="font-display font-light leading-[0.98] mt-5 text-[13.5vw] md:text-[6.8rem] tracking-tight">
              Wear the<br /><em className="font-normal" style={{ color: SCENTS[scent].accent }}>invisible.</em>
            </h1>
          </div>
          <div className="absolute bottom-24 md:bottom-16 left-0 right-0 text-center px-5">
            <p className="text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">A real 3D bottle — cut glass, solid brass, live liquid. Drag it, turn it, lift its cap. This is not a photograph.</p>
            <p className="mt-4 font-display text-xl">{SCENTS[scent].name} <span className="text-muted text-sm font-body">· {SCENTS[scent].line} · ${SCENTS[scent].price}</span></p>
          </div>
        </div>

        {/* Act 1 — the bottle */}
        <div className={`absolute inset-0 pointer-events-none ${panel} ${show(1)}`}>
          <div className="absolute left-5 md:left-14 top-1/2 -translate-y-1/2 max-w-sm pointer-events-auto">
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold">01 · THE BOTTLE</p>
            <h2 className="font-display font-light text-4xl md:text-[3.4rem] leading-[1.04] mt-4">Cut glass.<br />Solid brass.<br /><em style={{ color: SCENTS[scent].accent }}>Nothing else.</em></h2>
            <p className="text-muted mt-5 text-sm md:text-base leading-relaxed">The flacon is cut, polished and filled by hand. Its brass cap weighs 61 grams — lift it and feel the atomiser beneath, machined to a watchmaker's tolerance.</p>
            <div className="flex flex-wrap gap-2 mt-7">
              <button onClick={toggleCap} className={`rounded-full px-6 py-3 font-display text-base transition ${capOpen ? "bg-cream text-ink" : "text-ink hover:brightness-110"}`} style={capOpen ? {} : { background: SCENTS[scent].accent }}>
                {capOpen ? "Replace the cap" : "Lift the cap"}
              </button>
              <span className="rounded-full px-5 py-3 border border-white/15 bg-white/5 backdrop-blur font-mono text-[11px] tracking-[0.2em] text-cream/70 flex items-center">DRAG TO TURN IT</span>
            </div>
          </div>
        </div>

        {/* Act 2 — scents */}
        <div className={`absolute inset-0 pointer-events-none ${panel} ${show(2)}`}>
          <div className="absolute right-5 md:right-14 top-1/2 -translate-y-1/2 max-w-sm pointer-events-auto w-[calc(100%-2.5rem)] sm:w-auto">
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold md:text-right">02 · THE SCENTS</p>
            <h2 className="font-display font-light text-4xl md:text-[3.4rem] leading-[1.04] mt-4 md:text-right">Three scents.<br />One bottle.</h2>
            <p className="text-muted mt-4 text-sm md:text-base leading-relaxed md:text-right">Choose, and watch the liquid change inside the glass — live, in your browser.</p>
            <div className="mt-7 space-y-2.5">
              {SCENTS.map((s, i) => (
                <button key={s.name} onClick={() => setScent(i)} className={`w-full flex items-center gap-4 rounded-2xl border px-5 py-4 text-left backdrop-blur transition ${scent === i ? "bg-white/10" : "border-white/12 bg-white/[0.03] hover:border-white/30"}`} style={scent === i ? { borderColor: s.accent } : {}}>
                  <span className="w-8 h-8 rounded-full shrink-0 border border-white/20" style={{ background: `linear-gradient(150deg, ${s.liquid}, ${s.accent})` }} />
                  <span className="flex-1">
                    <span className="block font-display text-lg leading-tight">{s.name}</span>
                    <span className="block text-muted text-xs mt-0.5">{s.line} · {s.notes.top.split("·")[0].trim()} top note</span>
                  </span>
                  <span className="font-display">${s.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* bottom chrome */}
        <div className="absolute bottom-5 left-0 right-0 flex items-end justify-between px-5 md:px-10 pointer-events-none">
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-cream/50">DRAG TO ROTATE · SCROLL TO EXPLORE</p>
          <div className="flex flex-col items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`w-1.5 rounded-full transition-all duration-500 ${act === i ? "h-6" : "h-1.5 bg-white/25"}`} style={act === i ? { background: SCENTS[scent].accent } : {}} />
            ))}
          </div>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-cream/50 hidden sm:block">{Math.round(prog * 100)}%</p>
        </div>
      </div>
    </div>
  );
}
