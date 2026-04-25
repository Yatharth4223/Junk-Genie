import { Recycle, Github, Twitter, Instagram } from "lucide-react";

export const JunkFooter = () => (
  <footer className="ink-bg border-t-2 border-ink relative overflow-hidden">
    <div className="h-3 bg-caution relative overflow-hidden border-b-2 border-ink">
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, hsl(var(--ink)) 0 12px, transparent 12px 28px)'
      }} />
    </div>
    <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-3">
          <Recycle className="w-7 h-7 text-rust"/>
          <div className="font-block text-2xl text-paper">JUNK<span className="text-rust">GENIE</span></div>
        </div>
        <p className="font-mono text-sm text-paper/70 max-w-md leading-relaxed">
          Cobbled together in 36 chaotic hours for the <span className="font-hand text-caution text-lg">Break The Norm</span> hackathon.
          Powered by 🧃 juice boxes, 🧠 questionable AI, and 🦝 raccoon energy.
        </p>
      </div>
      <div>
        <div className="font-block uppercase text-paper text-sm mb-4">The Stuff</div>
        <ul className="space-y-2 font-mono text-sm text-paper/70">
          <li><a className="hover:text-caution" href="#process">How it works</a></li>
          <li><a className="hover:text-caution" href="#gallery">Glow-ups</a></li>
          <li><a className="hover:text-caution" href="#manifesto">House rules</a></li>
        </ul>
      </div>
      <div>
        <div className="font-block uppercase text-paper text-sm mb-4">Holler At Us</div>
        <div className="flex gap-3">
          {[Github, Twitter, Instagram].map((Icon, i) => (
            <a key={i} href="#" className="grid place-items-center w-10 h-10 border-2 border-paper text-paper hover:bg-rust hover:border-rust transition">
              <Icon className="w-4 h-4"/>
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-paper/20 py-4 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50">
      © {new Date().getFullYear()} JunkGenie · 100% recycled pixels · 0% serious
    </div>
  </footer>
);
