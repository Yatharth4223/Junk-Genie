import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import genieLogo from "@/assets/genie-logo.png";
import { staticImageUrl } from "@/lib/staticImageUrl";

export const JunkNav = ({ hideCta }: { hideCta?: boolean }) => (
  <>
    <header className="relative z-30 border-b-2 border-eco-forest bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 group-hover:rotate-6 group-hover:scale-110 transition-transform">
            <img
              src={staticImageUrl(genieLogo)}
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
        {/* Keeps nav + logo spacing the same as when the CTA lived in the header row */}
        <div className="hidden shrink-0 md:block md:h-10 md:w-[14rem]" aria-hidden />
      </div>
    </header>

    {/* Outside header: backdrop-filter on header creates a containing block and breaks fixed positioning */}
    {!hideCta && (
      <Link
        to="/create"
        className="fixed right-4 bottom-[max(2rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-2.5 bg-grape text-paper px-6 py-3.5 font-block text-base uppercase tracking-wide rounded-2xl border-2 border-paper/25 shadow-brut ring-2 ring-caution/60 ring-offset-2 ring-offset-black/0 hover:ring-caution/90 hover:shadow-brut transition-all duration-200 hover:scale-[1.03] hover:bg-eco-forest sm:right-6 md:bottom-8"
      >
        <Camera className="w-5 h-5 shrink-0" /> Upload & generate 🪄
      </Link>
    )}
  </>
);
