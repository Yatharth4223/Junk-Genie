import { Ghost, Sparkles, Hammer, PartyPopper } from "lucide-react";

const points = [
  { icon: Ghost, t: "Be a goblin", b: "Hoard junk. Cackle. Build dumb stuff. Repeat." },
  { icon: Sparkles, t: "Vibes > skills", b: "If it stands up for 4 seconds, it counts." },
  { icon: Hammer, t: "Lopsided rules", b: "Wonky is the new minimalist. Glue gun forever." },
  { icon: PartyPopper, t: "Show it off", b: "Post the Frankenstein result. We'll cheer loud." },
];

export const Manifesto = () => (
  <section id="manifesto" className="relative ink-bg py-24 overflow-hidden border-y-2 border-ink">
    {/* big rotating word */}
    <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-[0.06]">
      <div className="font-block uppercase text-[20vw] leading-none whitespace-nowrap text-paper">
        WEIRD · IS · GOOD
      </div>
    </div>

    <div className="relative mx-auto max-w-7xl px-6">
      <div className="max-w-3xl">
        <span className="stamp text-xs">house rules 🪩</span>
        <h2 className="mt-6 font-display text-5xl md:text-7xl text-paper leading-none">
          We don't make <span className="line-through text-paper/40">products</span>. <br/>
          We make <span className="font-marker text-caution">weird little guys.</span> 🤖
        </h2>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {points.map((p, i) => (
          <div key={i} className={`bg-paper border-2 border-paper p-6 brut-sm ${i % 2 ? 'r-r1' : 'r-l1'} hover:rotate-0 transition-transform`}>
            <p.icon className="w-8 h-8 text-rust mb-3" strokeWidth={2.2}/>
            <div className="font-block uppercase text-xl leading-tight">{p.t}</div>
            <div className="font-mono text-sm mt-2 text-ink-soft">{p.b}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
