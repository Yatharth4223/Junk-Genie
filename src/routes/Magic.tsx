import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { JunkNav } from "@/components/JunkNav";
import { JunkFooter } from "@/components/JunkFooter";
import guideForAi from "@/assets/guideForAi.png";
import { staticImageUrl } from "@/lib/staticImageUrl";

type Blueprint = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: string[];
  stepsImageBase64?: string;
  stepsImageSrc?: string;
};

type MagicLocationState = {
  blueprint?: Blueprint;
  allBlueprints?: Blueprint[];
  bubblesPath?: string;
};

const Magic = () => {
  const location = useLocation() as { state?: MagicLocationState };
  const navigate = useNavigate();
  const blueprint = location.state?.blueprint;
  const allBlueprints = location.state?.allBlueprints;
  const bubblesPath = location.state?.bubblesPath ?? "/create";

  const [stepsImageBase64, setStepsImageBase64] = useState<string | null>(
    blueprint?.stepsImageBase64 ?? null,
  );
  const [imageLoading, setImageLoading] = useState(!blueprint?.stepsImageBase64);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!blueprint) return;
    if (blueprint.stepsImageBase64) {
      setStepsImageBase64(blueprint.stepsImageBase64);
      setImageLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setImageLoading(true);
      setImageError(null);
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ blueprint }),
        });
        const text = await res.text();
        if (!res.ok) throw new Error(text || `Image gen failed (${res.status})`);
        const data = text ? JSON.parse(text) : null;
        const b64 = data?.stepsImageBase64 as string | undefined;
        if (cancelled) return;
        if (b64) setStepsImageBase64(b64);
        else setImageError("No image returned");
      } catch (e: unknown) {
        if (!cancelled) setImageError(e instanceof Error ? e.message : "Could not generate steps image");
      } finally {
        if (!cancelled) setImageLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blueprint]);

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

  const imageSrc = stepsImageBase64
    ? `data:image/png;base64,${stepsImageBase64}`
    : staticImageUrl(blueprint.stepsImageSrc ?? guideForAi);

  return (
    <main className="min-h-screen text-foreground flex flex-col">
      <JunkNav />

      <section className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12 lg:py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (allBlueprints?.length) {
                navigate(bubblesPath, {
                  state: { restoreMagicOverlay: true, allBlueprints },
                });
              } else {
                navigate(-1);
              }
            }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-soft transition-colors hover:text-grape"
          >
            <ArrowLeft className="h-4 w-4" /> back
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-eco-forest bg-eco-sage/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-grape" /> magic blueprint
          </div>
        </div>

        <div className="mb-8 lg:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] text-balance">
            {blueprint.title}
          </h1>
          <p className="mt-3 font-mono text-sm text-ink-soft">
            <span className="text-ink">Difficulty:</span>{" "}
            <span className="text-grape font-medium uppercase">{blueprint.difficulty}</span>
          </p>
        </div>

        <div className="grid min-h-0 grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10 xl:gap-12">
          <div className="order-1 flex min-h-0 flex-col gap-2 lg:col-span-7 lg:h-full lg:min-h-0 xl:col-span-8">
            <div className="flex w-full min-h-[min(50vh,22rem)] flex-1 flex-col overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-brut sm:min-h-[min(55vh,26rem)] sm:rounded-3xl lg:min-h-0">
              {imageLoading ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-ink/15 px-6 py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-grape" />
                  <p className="text-center font-mono text-sm text-ink">Drawing your step guide…</p>
                </div>
              ) : (
                <div className="relative flex min-h-0 flex-1 items-center justify-center bg-gradient-to-b from-paper to-eco-sage/20 p-1 sm:p-2">
                  <img
                    src={imageSrc}
                    alt="Steps reference"
                    className="max-h-full min-h-0 max-w-full object-contain object-center"
                  />
                </div>
              )}
            </div>
            {imageError && !imageLoading && (
              <p className="shrink-0 font-mono text-xs text-ink-soft">{imageError}</p>
            )}
          </div>

          <div className="order-2 flex min-h-0 flex-col gap-6 lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl border-2 border-eco-forest bg-eco-sage/30 p-5 shadow-brut-sm sm:p-6">
              <h2 className="font-block text-lg uppercase tracking-wide text-ink sm:text-xl">Steps</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 font-mono text-sm leading-relaxed text-ink sm:text-[0.95rem]">
                {blueprint.steps.map((s, i) => (
                  <li key={i} className="pl-1">
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border-2 border-ink bg-paper p-5 shadow-brut-sm sm:p-6">
              <h2 className="font-block text-lg uppercase sm:text-xl">What you’ll make</h2>
              <p className="mt-2 font-mono text-sm leading-relaxed text-ink/95">{blueprint.description}</p>
            </div>
          </div>
        </div>
      </section>

      <JunkFooter />
    </main>
  );
};

export default Magic;
