import { Recycle, Camera } from "lucide-react";

export const JunkNav = () => (
  <header className="relative z-30 border-b-2 border-ink bg-paper">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <a href="#" className="flex items-center gap-3 group">
        <div className="grid place-items-center w-11 h-11 bg-rust text-paper border-2 border-ink brut-sm group-hover:rotate-12 transition-transform">
          <Recycle className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="leading-none">
          <div className="font-block text-2xl tracking-tight">JUNK<span className="text-rust">GENIE</span></div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">est. yesterday · vibes only</div>
        </div>
      </a>
      <nav className="hidden md:flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
        <a href="#process" className="px-3 py-2 hover:bg-caution border-2 border-transparent hover:border-ink">How it works</a>
        <a href="#gallery" className="px-3 py-2 hover:bg-caution border-2 border-transparent hover:border-ink">Glow-ups</a>
        <a href="#manifesto" className="px-3 py-2 hover:bg-caution border-2 border-transparent hover:border-ink">House rules</a>
      </nav>
      <button className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5 font-block text-sm uppercase brut-sm hover:bg-rust transition-colors">
        <Camera className="w-4 h-4" /> Try it 🪄
      </button>
    </div>
  </header>
);
