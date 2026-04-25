import { useState } from "react";
import beforeCans from "@/assets/before-cans.png";
import afterPlanter from "@/assets/after-planter.png";
import beforePallet from "@/assets/before-pallet.png";
import afterShelf from "@/assets/after-shelf.png";
import lamp from "@/assets/upcycled-lamp.png";

const items = [
  { before: beforeCans, after: afterPlanter, title: "old soup cans", to: "happy plant pals 🪴", time: "1.5 hr", diff: "kid friendly" },
  { before: beforePallet, after: afterShelf, title: "wonky old pallet", to: "cool book shelf 📚", time: "3 hr", diff: "with a grown-up" },
];

export const Transformations = () => {
  const [showAfter, setShowAfter] = useState<boolean[]>(items.map(() => false));
  const toggle = (i: number) => setShowAfter(s => s.map((v, idx) => idx === i ? !v : v));

  return (
    <section id="gallery" className="relative py-24 bg-paper">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="font-mono uppercase text-xs tracking-[0.4em] text-rust">★ before & after ★</span>
            <h2 className="mt-2 font-display text-5xl md:text-7xl leading-none">
              Boring. <span className="italic">Brilliant!</span><br/>
              <span className="font-marker text-grape text-[0.7em]">tap a card 👇</span>
            </h2>
          </div>
          <p className="font-mono text-sm max-w-sm border-l-4 border-ink pl-4">
            Tap a card and watch ordinary stuff become something amazing. Real projects from real families ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {items.map((it, i) => (
            <div key={i} className={`relative ${i % 2 ? 'r-r1 md:translate-y-10' : 'r-l1'}`}>
              <span className="tape" style={{ top: -14, left: 24 }} />
              <span className="tape" style={{ top: -14, right: 24 }} />
              <button
                onClick={() => toggle(i)}
                className="block w-full bg-paper-dark border-2 border-ink brut-lg p-5 text-left"
              >
                <div className="relative aspect-[4/3] bg-paper border-2 border-ink overflow-hidden halftone">
                  <img
                    src={it.before} alt={it.title}
                    width={1024} height={768} loading="lazy"
                    className={`absolute inset-0 w-full h-full object-contain p-6 transition-opacity duration-500 ${showAfter[i] ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <img
                    src={it.after} alt={it.to}
                    width={1024} height={768} loading="lazy"
                    className={`absolute inset-0 w-full h-full object-contain p-6 transition-opacity duration-500 ${showAfter[i] ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <div className="absolute top-3 left-3 stamp text-[10px]" style={{transform: 'rotate(-8deg)'}}>
                    {showAfter[i] ? 'AFTER' : 'BEFORE'}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-ink text-paper font-mono text-[10px] uppercase px-2 py-1 tracking-widest">
                    tap me ↻
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">{it.title} →</div>
                    <div className="font-display text-3xl leading-tight">{it.to}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-caution border-2 border-ink px-2 py-1 font-mono text-[10px] uppercase brut-sm">⏱ {it.time}</span>
                    <span className="bg-teal text-paper border-2 border-ink px-2 py-1 font-mono text-[10px] uppercase brut-sm">{it.diff}</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* bonus floating polaroid */}
        <div className="relative mt-20 grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 r-l3">
            <div className="bg-paper border-2 border-ink p-3 pb-12 brut-lg relative">
              <span className="tape" style={{top: -12, left: 30}} />
              <img src={lamp} alt="Mason jar lamp" width={1024} height={1024} loading="lazy"
                   className="w-full aspect-square object-contain bg-paper-dark border border-ink" />
              <div className="absolute bottom-3 left-0 right-0 text-center font-hand text-2xl text-ink">
                jar → vibe lamp 💡
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="font-display text-4xl md:text-5xl leading-tight">
              <span className="font-marker text-rust"></span> happy little projects built by families who said <span className="font-hand text-grape">"hey, what if we made THIS?"</span> 🎨🛠️
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
