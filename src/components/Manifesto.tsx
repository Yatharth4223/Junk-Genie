import { Smile, Sparkles, Hammer, PartyPopper } from "lucide-react";

const points = [
  { icon: Smile, t: "Everyone plays", b: "Kids, parents, grandparents — anyone can join the fun." },
  { icon: Sparkles, t: "Mess is OK", b: "Wobbly, glittery, glued sideways. We love it all." },
  { icon: Hammer, t: "Try & giggle", b: "It doesn't have to be perfect. It just has to be yours." },
  { icon: PartyPopper, t: "Show & cheer", b: "Share your creation and we'll throw confetti for you." },
];

export const Manifesto = () => (
  <section id="manifesto" className="relative ink-bg py-24 overflow-hidden border-y-2 border-ink">
    {/* big rotating word */}
    <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-[0.06]">
      <div className="font-block uppercase text-[20vw] leading-none whitespace-nowrap text-paper">
        FUN · FOR · ALL
      </div>
    </div>

    <div className="relative mx-auto max-w-7xl px-6">
      <div className="max-w-3xl">
        <span className="stamp text-xs">house rules 🎈</span>
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
