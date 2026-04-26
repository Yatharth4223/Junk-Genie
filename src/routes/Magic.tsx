import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { JunkNav } from "@/components/JunkNav";
import { JunkFooter } from "@/components/JunkFooter";
import guideForAi from "@/assets/guideForAi.png";
import { staticImageUrl } from "@/lib/staticImageUrl";

type Blueprint = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: string[];
  stepsImageSrc?: string;
};

const Magic = () => {
  const location = useLocation() as { state?: { blueprint?: Blueprint } };
  const blueprint = location.state?.blueprint;

  if (!blueprint) {
    return (
      <main className="min-h-screen text-foreground flex flex-col">
        <JunkNav />
        <section className="flex-1 mx-auto w-full max-w-3xl px-6 py-12">
          <div className="bg-paper border-2 border-ink rounded-2xl p-6 shadow-brut-sm">
            <div className="font-mono text-xs text-ink-soft">
              No magic bubble selected. Go back and pick a bubble.
            </div>
            <div className="mt-4">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-grape text-paper px-5 py-2.5 font-block text-xs uppercase rounded-xl shadow-brut-sm hover:bg-eco-forest transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Back to create
              </Link>
            </div>
          </div>
        </section>
        <JunkFooter />
      </main>
    );
  }

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
          <Sparkles className="w-3.5 h-3.5 text-grape" /> magic blueprint
        </div>

        <h1 className="font-display text-4xl md:text-6xl leading-[0.95] mb-3">
          {blueprint.title}
        </h1>
        <p className="font-mono text-sm text-ink-soft mb-6">
          <span className="text-ink">Difficulty:</span>{" "}
          <span className="text-grape">{blueprint.difficulty}</span>
        </p>

        <div className="bg-eco-sage/30 border-2 border-eco-forest rounded-2xl p-6 shadow-brut-sm mb-6">
          <h2 className="font-block text-xl uppercase mb-4">Steps</h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-[42%]">
              <img
                src={staticImageUrl(blueprint.stepsImageSrc ?? guideForAi)}
                alt="Steps reference"
                className="w-full h-auto border-2 border-ink rounded-xl shadow-brut-sm bg-paper"
              />
            </div>

            <div className="md:flex-1">
              <ol className="list-decimal pl-5 font-mono text-sm space-y-2 text-ink">
                {blueprint.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-paper border-2 border-ink rounded-2xl p-6 shadow-brut-sm">
          <h2 className="font-block text-xl uppercase mb-2">What you’ll make</h2>
          <p className="font-mono text-sm text-ink">{blueprint.description}</p>
        </div>
      </section>

      <JunkFooter />
    </main>
  );
};

export default Magic;

