import junkPile from "@/assets/junk-pile.png";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

export const HeroCollage = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Top sticker bar */}
      <div className="bg-ink text-paper py-2 overflow-hidden border-b-2 border-ink">
        <div className="marquee">
          <div className="marquee-track font-block uppercase text-xs tracking-[0.3em] whitespace-nowrap">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-6">
                {["🧞 RUB THE LAMP", "🗑️ FEED IT GARBAGE", "✨ GET COOL STUFF", "🤡 NO SKILLS REQUIRED", "🪄 IT'S BASICALLY MAGIC", "🦝 RACCOON APPROVED", "📸 POINT · CLICK · BUILD"].map((t,j) => (
                  <span key={j} className="px-2">{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-8 items-center">
        {/* LEFT — ransom note headline */}
        <div className="lg:col-span-7 relative z-10">
          {/* stamp */}
          <div className="mb-6 flex items-center gap-4">
            <div className="stamp text-xs">100% NONSENSE</div>
            <div className="font-hand text-2xl text-rust rotate-[-4deg]">← hi 👋</div>
          </div>

          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-tight">
            <span className="block bg-ink text-paper px-3 py-1 -ml-2 inline-block r-l1">that</span>{" "}
            <span className="font-block uppercase italic text-rust">GUNK</span>
            <br />
            <span className="font-marker text-teal text-[0.85em] r-r1 inline-block">in your garage?</span>
            <br />
            <span className="relative inline-block">
              it's secretly
              <svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 300 14" preserveAspectRatio="none">
                <path d="M2 8 Q 80 2 150 7 T 298 6" stroke="hsl(var(--rust))" strokeWidth="5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>{" "}
            <span className="font-block uppercase bg-caution px-3 r-r2 inline-block border-2 border-ink">FUN.</span>
          </h1>

          <p className="mt-8 max-w-xl font-mono text-base leading-relaxed text-ink-soft border-l-4 border-ink pl-4">
            Snap a pic of your weird pile of stuff. Our little genie squints at it real hard
            and spits out <em className="font-hand text-rust text-xl not-italic">fun things you could build this afternoon</em> 🛠️✨
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="group relative bg-rust text-paper font-block uppercase text-base px-7 py-4 brut hover:bg-ink transition-colors flex items-center gap-3">
              <Wand2 className="w-5 h-5" />
              Rub the lamp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button className="bg-paper border-2 border-ink font-block uppercase text-base px-6 py-4 brut-sm hover:bg-caution transition-colors">
              See the chaos ↓
            </button>
            <div className="font-hand text-2xl text-teal rotate-[-3deg] hidden sm:block">no login · no shame</div>
          </div>

          {/* tag pills */}
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
            {[
              { t: "📸 point camera", c: "bg-caution" },
              { t: "🧠 wonky AI", c: "bg-paper" },
              { t: "🎨 silly ideas", c: "bg-paper" },
              { t: "🍕 weekend vibes", c: "bg-paper" },
            ].map((p,i) => (
              <span key={i} className={`${p.c} border-2 border-ink px-3 py-1.5 brut-sm`}>{p.t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — collaged junk pile */}
        <div className="lg:col-span-5 relative min-h-[520px] flex items-center justify-center">
          {/* big yellow burst behind */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-[420px] h-[420px] bg-caution border-2 border-ink rounded-full r-l2 animate-spin-slow opacity-90"
                 style={{ clipPath: 'polygon(50% 0%, 60% 35%, 98% 35%, 68% 57%, 80% 91%, 50% 70%, 20% 91%, 32% 57%, 2% 35%, 40% 35%)' }} />
          </div>
          {/* teal panel */}
          <div className="absolute right-0 top-12 w-64 h-72 bg-teal border-2 border-ink r-r2 brut" />
          {/* the junk image */}
          <img
            src={junkPile}
            alt="A pile of household junk magically glowing"
            width={1024} height={1024}
            className="relative z-10 w-[110%] max-w-none drop-shadow-[8px_8px_0_hsl(var(--ink))] animate-float-up"
          />
          {/* sparkles */}
          <Sparkles className="absolute top-8 left-10 w-10 h-10 text-rust animate-flicker z-20" />
          <Sparkles className="absolute bottom-12 right-8 w-7 h-7 text-teal animate-flicker z-20" style={{animationDelay: '1s'}}/>
          {/* sticky note */}
          <div className="absolute -bottom-4 -left-2 z-20 bg-caution border-2 border-ink p-3 r-l3 brut-sm w-44">
            <div className="font-hand text-lg leading-tight text-ink">
              "i made a robot out of a toaster lol" — kevin, probably
            </div>
          </div>
          {/* arrow */}
          <div className="absolute top-1/2 -left-4 hidden lg:block z-20 font-hand text-xl text-rust rotate-[-12deg]">
            certified gunk ↗
          </div>
        </div>
      </div>
    </section>
  );
};
