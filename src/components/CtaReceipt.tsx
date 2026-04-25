import { ArrowRight, Camera } from "lucide-react";

export const CtaReceipt = () => (
  <section className="relative py-24 bg-paper">
    <div className="mx-auto max-w-3xl px-6">
      <div className="relative bg-paper border-2 border-ink brut-lg p-10 r-l1"
           style={{
             clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 18px), 95% 100%, 90% calc(100% - 12px), 85% 100%, 80% calc(100% - 12px), 75% 100%, 70% calc(100% - 12px), 65% 100%, 60% calc(100% - 12px), 55% 100%, 50% calc(100% - 12px), 45% 100%, 40% calc(100% - 12px), 35% 100%, 30% calc(100% - 12px), 25% 100%, 20% calc(100% - 12px), 15% 100%, 10% calc(100% - 12px), 5% 100%, 0 calc(100% - 18px))'
           }}>
        <div className="text-center font-mono text-[11px] uppercase tracking-[0.3em] mb-4 text-ink-soft">
          ── JUNKGENIE · receipt #001 ──
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-center leading-none mb-6">
          Ready to <span className="font-marker text-rust">summon</span> the genie?
        </h2>
        <div className="font-mono text-sm border-y border-dashed border-ink py-4 my-6 space-y-2">
          <div className="flex justify-between"><span>1× live camera scan</span><span>FREE</span></div>
          <div className="flex justify-between"><span>1× AI project ideas</span><span>FREE</span></div>
          <div className="flex justify-between"><span>1× step-by-step plan</span><span>FREE</span></div>
          <div className="flex justify-between"><span>1× saved planet</span><span className="font-block">PRICELESS</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group bg-ink text-paper font-block uppercase text-base px-8 py-4 brut hover:bg-rust transition-colors flex items-center gap-3">
            <Camera className="w-5 h-5"/> Open scanner <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition"/>
          </button>
        </div>
        <div className="text-center font-hand text-2xl text-teal mt-6 rotate-[-2deg]">
          thank you for not throwing it out ♥
        </div>
      </div>
    </div>
  </section>
);
