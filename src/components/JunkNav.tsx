import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import genieLogo from "@/assets/genie-logo.png";

export const JunkNav = () => (
  <header className="relative z-30 border-b-2 border-eco-forest bg-paper/90 backdrop-blur-sm">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <a href="#" className="flex items-center gap-3 group">
        <div className="relative w-12 h-12 group-hover:rotate-6 group-hover:scale-110 transition-transform">
          <img
            src={genieLogo}
            alt="JunkGenie mascot — a friendly purple genie"
            width={48}
            height={48}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
        <div className="leading-none">
          <div className="font-block text-2xl tracking-tight">Junk<span className="text-grape">Genie</span><span className="text-eco-leaf">.</span></div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">your wish, our magic ✨</div>
        </div>
      </a>
      <nav className="hidden md:flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
        <a href="#process" className="px-3 py-2 rounded-full hover:bg-eco-sage/40 transition-colors">How it works</a>
        <a href="#gallery" className="px-3 py-2 rounded-full hover:bg-eco-sage/40 transition-colors">Glow-ups</a>
        <a href="#manifesto" className="px-3 py-2 rounded-full hover:bg-eco-sage/40 transition-colors">House rules</a>
      </nav>
      <Link
        to="/create"
        className="flex items-center gap-2 bg-grape text-paper px-5 py-2.5 font-block text-sm uppercase rounded-xl shadow-brut-sm hover:bg-eco-forest transition-colors"
      >
        <Camera className="w-4 h-4" /> Rub the lamp 🪄
      </Link>
    </div>
  </header>
);
