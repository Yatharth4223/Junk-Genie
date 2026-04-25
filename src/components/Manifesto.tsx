import { Recycle, Sparkles, Hammer, Leaf } from "lucide-react";

const points = [
  { icon: Recycle, t: "Stop buying", b: "You already own enough. Make from what's there." },
  { icon: Sparkles, t: "AI for good", b: "Not another chatbot. Something you can hold." },
  { icon: Hammer, t: "Build weird", b: "Ugly, lopsided, beautiful. Yours." },
  { icon: Leaf, t: "Earth thanks", b: "Every can saved is a can not made." },
];

export const Manifesto = () => (
  <section id="manifesto" className="relative ink-bg py-24 overflow-hidden border-y-2 border-ink">
    {/* big rotating word */}
    <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-[0.06]">
      <div className="font-block uppercase text-[20vw] leading-none whitespace-nowrap text-paper">
        BREAK · THE · NORM
      </div>
    </div>

    <div className="relative mx-auto max-w-7xl px-6">
      <div className="max-w-3xl">
        <span className="stamp text-xs">manifesto · v1</span>
        <h2 className="mt-6 font-display text-5xl md:text-7xl text-paper leading-none">
          We don't believe in <span className="line-through text-paper/40">trash</span>. <br/>
          Only <span className="font-marker text-caution">unfinished projects.</span>
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
