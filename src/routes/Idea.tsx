import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Hammer, Leaf, Lightbulb } from "lucide-react";
import { JunkNav } from "@/components/JunkNav";
import { JunkFooter } from "@/components/JunkFooter";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const Idea = () => {
  const { slug = "" } = useParams();
  const location = useLocation() as { state?: { title?: string; source?: string } };
  const title = location.state?.title ?? titleFromSlug(slug);
  const source = location.state?.source;

  return (
    <main className="min-h-screen text-foreground flex flex-col">
      <JunkNav />

      <section className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-10 md:py-16">
        <Link
          to={-1 as any}
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-grape transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> back
        </Link>

        <div className="inline-flex items-center gap-2 bg-eco-sage/40 border-2 border-eco-forest rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest mb-5">
          <Sparkles className="w-3.5 h-3.5 text-grape" /> idea unlocked
        </div>

        <h1 className="font-display text-4xl md:text-6xl leading-[0.95] mb-3">
          {title}
        </h1>
        {source && (
          <p className="font-mono text-sm text-ink-soft mb-8">
            From your scanned <span className="text-grape">{source}</span>.
          </p>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-paper border-2 border-ink rounded-2xl p-5 shadow-brut-sm">
            <Hammer className="w-6 h-6 text-grape mb-2" />
            <div className="font-block text-sm uppercase mb-1">Effort</div>
            <p className="font-mono text-xs text-ink-soft">~30 minutes, basic tools</p>
          </div>
          <div className="bg-paper border-2 border-ink rounded-2xl p-5 shadow-brut-sm">
            <Leaf className="w-6 h-6 text-eco-forest mb-2" />
            <div className="font-block text-sm uppercase mb-1">Impact</div>
            <p className="font-mono text-xs text-ink-soft">Diverts waste from landfill</p>
          </div>
          <div className="bg-paper border-2 border-ink rounded-2xl p-5 shadow-brut-sm">
            <Lightbulb className="w-6 h-6 text-caution mb-2" />
            <div className="font-block text-sm uppercase mb-1">Vibe</div>
            <p className="font-mono text-xs text-ink-soft">Family-friendly & fun</p>
          </div>
        </div>

        <div className="bg-eco-sage/30 border-2 border-eco-forest rounded-2xl p-6 shadow-brut-sm">
          <h2 className="font-block text-xl uppercase mb-3">How the genie does it</h2>
          <ol className="list-decimal pl-5 font-mono text-sm space-y-2 text-ink">
            <li>Give the item a quick clean and let it dry.</li>
            <li>Sketch the new shape — measure twice, snip once.</li>
            <li>Decorate with paint, twine, or whatever sparks joy.</li>
            <li>Show it off and tag #JunkGenie ✨</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/create/scan"
            className="inline-flex items-center gap-2 bg-grape text-paper px-5 py-2.5 font-block text-xs uppercase rounded-xl shadow-brut-sm hover:bg-eco-forest transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Scan something else
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-paper border-2 border-ink px-5 py-2.5 font-block text-xs uppercase rounded-xl hover:bg-eco-sage/40 transition-colors"
          >
            Home
          </Link>
        </div>
      </section>

      <JunkFooter />
    </main>
  );
};

export default Idea;