import { Github } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import hackathonLogo from "@/assets/hackathon.png";
import { staticImageUrl } from "@/lib/staticImageUrl";

export const JunkFooter = () => (
  <footer className="ink-bg border-t-2 border-ink relative overflow-hidden">
    <div className="h-3 bg-bubble relative overflow-hidden border-b-2 border-ink">
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--sky-blue)) 0 30px, hsl(var(--grass)) 30px 60px, hsl(var(--caution)) 60px 90px, hsl(var(--bubble-pink)) 90px 120px)'
      }} />
    </div>
    <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={staticImageUrl(genieLogo)}
            alt="JunkGenie mascot — a friendly purple genie"
            width={28}
            height={28}
            className="w-7 h-7 object-contain drop-shadow-md"
          />
          <div className="font-block text-2xl text-paper">JUNK<span className="text-rust">GENIE</span></div>
        </div>
        <p className="font-mono text-sm text-paper/70 max-w-md leading-relaxed">
          Made with love in 36 hours for the <span className="font-hand text-caution text-lg">Bearhacks</span> hackathon.
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
        <div className="font-block uppercase text-paper text-sm mb-4">
          Check Implementation!
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/Yatharth4223/Junk-Genie" className="grid place-items-center w-10 h-10 border-2 border-paper text-paper hover:bg-rust hover:border-rust transition">
            <Github className="w-4 h-4" />
          </a>

          <a
            href="https://devpost.com/software/junkgenie?ref_content=my-projects-tab&ref_feature=my_projects"
            target="_blank"
            rel="noreferrer"
            className="grid place-items-center w-10 h-10 border-2 border-paper text-paper hover:bg-rust hover:border-rust transition"
          >
            <img
              src={staticImageUrl(hackathonLogo)}
              alt="Hackathon logo"
              className="w-6 h-6 object-contain"
            />
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-paper/20 py-4 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50">
      © {new Date().getFullYear()} JunkGenie · 100% recycled pixels · 0% serious
    </div>
  </footer>
);
