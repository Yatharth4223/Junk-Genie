import junkPile from "@/assets/junk-pile.png";
import { ArrowRight, Sparkles, Wand2, Star, Heart } from "lucide-react";

export const HeroCollage = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-8 items-center">
        {/* floating doodles */}
        <Star className="absolute top-10 left-1/3 w-6 h-6 text-bubble fill-bubble animate-bounce-soft" />
        <Heart className="absolute bottom-20 left-12 w-5 h-5 text-rust fill-rust animate-bounce-soft" style={{animationDelay:'.6s'}} />
        <Sparkles className="absolute top-24 right-1/4 w-5 h-5 text-grape" />
        {/* LEFT — ransom note headline */}
        <div className="lg:col-span-7 relative z-10">
          {/* stamp */}
          <div className="mb-6 flex items-center gap-4">
            <div className="stamp text-xs">100% SILLY 🎉</div>
            <div className="font-hand text-2xl text-rust rotate-[-4deg]">← hi 👋</div>
          </div>

          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-tight">
            <span className="block bg-ink text-paper px-3 py-1 -ml-2 inline-block r-l1">that</span>{" "}
            <span className="font-block uppercase italic text-rust">STUFF</span>
            <br />
            <span className="font-marker text-teal text-[0.85em] r-r1 inline-block">in your garage?</span>
            <br />
            <span className="relative inline-block">
              it wants to be
              <svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 300 14" preserveAspectRatio="none">
                <path d="M2 8 Q 80 2 150 7 T 298 6" stroke="hsl(var(--rust))" strokeWidth="5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>{" "}
            <span className="font-block uppercase bg-bubble text-paper px-3 r-r2 inline-block border-2 border-ink">TOYS!</span>
          </h1>

          <p className="mt-8 max-w-xl font-mono text-base leading-relaxed text-ink-soft border-l-4 border-ink pl-4">
            Take a photo of the random stuff at home. Our friendly genie has a peek
            and gives you <em className="font-hand text-rust text-xl not-italic">awesome things you and your family can build today!</em> 🛠️✨
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="group relative bg-rust text-paper font-block uppercase text-base px-7 py-4 brut hover:bg-bubble transition-colors flex items-center gap-3">
              <Wand2 className="w-5 h-5" />
              Make something! 🪄
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button className="bg-paper border-2 border-ink font-block uppercase text-base px-6 py-4 brut-sm hover:bg-sky transition-colors">
              Peek the magic ↓
            </button>
            <div className="font-hand text-2xl text-grape rotate-[-3deg] hidden sm:block">free · no signup · all ages</div>
          </div>

          {/* tag pills */}
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
            {[
              { t: "📸 snap a pic", c: "bg-caution" },
              { t: "🧠 friendly AI", c: "bg-sky text-ink" },
              { t: "🎨 craft ideas", c: "bg-bubble text-ink" },
              { t: "👨‍👩‍👧 family fun", c: "bg-grass text-ink" },
            ].map((p,i) => (
              <span key={i} className={`${p.c} border-2 border-ink px-3 py-1.5 brut-sm`}>{p.t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — collaged junk pile */}
        <div className="lg:col-span-5 relative min-h-[520px] flex items-center justify-center">
          {/* big yellow burst behind */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-[420px] h-[420px] bg-bubble border-2 border-ink rounded-full r-l2 animate-spin-slow opacity-90"
                 style={{ clipPath: 'polygon(50% 0%, 60% 35%, 98% 35%, 68% 57%, 80% 91%, 50% 70%, 20% 91%, 32% 57%, 2% 35%, 40% 35%)' }} />
          </div>
          {/* teal panel */}
          <div className="absolute right-0 top-12 w-64 h-72 bg-sky border-2 border-ink r-r2 brut" />
          {/* the junk image */}
          <img
            src={junkPile}
            alt="A pile of household junk magically glowing"
            width={1024} height={1024}
            className="relative z-10 w-[110%] max-w-none drop-shadow-[8px_8px_0_hsl(var(--ink))] animate-float-up"
          />
          {/* sparkles */}
          <Sparkles className="absolute top-8 left-10 w-10 h-10 text-rust animate-flicker z-20" />
          <Sparkles className="absolute bottom-12 right-8 w-7 h-7 text-grape animate-flicker z-20" style={{animationDelay: '1s'}}/>
          <Star className="absolute top-1/3 right-2 w-8 h-8 text-caution fill-caution animate-wiggle z-20" />
          {/* sticky note */}
          <div className="absolute -bottom-4 -left-2 z-20 bg-grass border-2 border-ink p-3 r-l3 brut-sm w-44">
            <div className="font-hand text-lg leading-tight text-ink">
              "we made a robot out of a cereal box!" — the patel kids 🤖
            </div>
          </div>
          {/* arrow */}
          <div className="absolute top-1/2 -left-4 hidden lg:block z-20 font-hand text-xl text-rust rotate-[-12deg]">
            yep, that pile ↗
          </div>
        </div>
      </div>
    </section>
  );
};
