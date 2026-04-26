import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

type BubbleBlueprint = {
  title: string;
  description: string;
  to?: string;
  state?: any;
};

type MagicBubblesProps = {
  items: BubbleBlueprint[];
  loading?: boolean;
  fullscreen?: boolean;
  onClose?: () => void;
};

const BUBBLE_PALETTE = ["bubble-coral", "bubble-mint", "bubble-butter", "bubble-lilac"] as const;

/** Strips leading emoji (e.g. from LLM) so titles/descriptions start with real text. */
function displayBubbleText(s: string) {
  if (!s) return s;
  let t = s.trim();
  for (let k = 0; k < 8; k++) {
    const before = t;
    t = t
      .replace(/^\p{Extended_Pictographic}/u, "")
      .replace(/^\uFE0F+/, "")
      .replace(/^\u200D+/, "")
      .trimStart();
    if (t === before) break;
  }
  return t;
}

/* Scattered layout (non-fullscreen only) */
const SCATTERED_POSITIONS = [
  { top: "12%", left: "8%", size: 160 },
  { top: "10%", right: "8%", size: 150 },
  { bottom: "10%", left: "12%", size: 145 },
] as const;

function BubbleShell({
  title,
  titleSuffix,
  children,
  dark,
}: {
  title: string | null;
  titleSuffix?: ReactNode;
  children: ReactNode;
  dark?: boolean;
}) {
  const isThinking = (title ?? "").toLowerCase().includes("thinking");
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <div
        className={
          dark
            ? "absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/70 to-black/80"
            : "absolute inset-0 bg-gradient-to-br from-eco-sage/25 via-paper to-sky/20"
        }
      />
      {dark && (
        <>
          <div className="absolute inset-0 bg-black/20" />
          {/* Subtle color orbs so the overlay feels less empty */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full opacity-25 blur-3xl bubble-butter"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full opacity-20 blur-3xl bubble-lilac"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(50vh,24rem)] w-[min(90vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-2xl [background:radial-gradient(ellipse_at_center,hsl(0_0%_100%/_0.35),transparent_70%)]"
          />
        </>
      )}
      {title !== null && (
        <div className="relative p-5">
          <div
            className={`font-mono uppercase tracking-widest ${
              isThinking ? "text-2xl sm:text-3xl" : "text-[11px]"
            } ${dark ? "text-paper/80" : "text-ink-soft"}`}
          >
            {title}
            {titleSuffix}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

function renderBubbles(
  bubbles: BubbleBlueprint[],
  loading: boolean | undefined,
  large?: boolean,
  /** When fullscreen shows no title bar (results visible), use less top padding for the grid */
  noTitleBar?: boolean,
) {
  const titleClass = large
    ? "text-balance px-2 text-center font-block text-sm leading-tight tracking-tight text-[hsl(var(--craft-ink))] sm:text-base md:text-lg"
    : "px-3 font-block text-base leading-tight tracking-tight sm:text-lg";
  const descClass = large
    ? "mt-2 line-clamp-4 text-center font-mono text-xs leading-snug text-[hsl(var(--craft-ink))]/85 sm:line-clamp-5 sm:text-sm"
    : "mt-1 line-clamp-4 font-mono text-xs leading-snug sm:text-sm";
  const padClass = large ? "p-4 sm:p-5" : "p-4 sm:p-5";

  const topPad = noTitleBar
    ? "px-2 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pb-16"
    : "px-2 pb-3 pt-16 sm:px-4 sm:pb-4 sm:pt-20";

  // Fullscreen: structured row of 3, sized to the viewport so nothing clips
  if (large) {
    return (
      <div className="absolute inset-0 z-[5] flex min-h-0 min-w-0 flex-col">
        <div
          className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-y-auto overflow-x-hidden sm:gap-3 ${topPad}`}
        >
          {/* w-full + 3×1fr: equal horizontal columns; items-end: triangle sits on a shared baseline so sides aren’t pushed off-screen downward */}
          <div className="mx-auto grid w-full min-h-0 min-w-0 max-w-7xl flex-1 grid-cols-1 place-content-center place-items-center gap-8 self-stretch sm:min-h-[min(68dvh,38rem)] sm:grid-cols-3 sm:items-end sm:gap-x-4 sm:gap-y-0 md:gap-x-6 lg:gap-x-8">
            {bubbles.map((b, i) => {
              const titleShown = displayBubbleText(b.title);
              const descShown = displayBubbleText(b.description);
              const bubbleClass = BUBBLE_PALETTE[i % BUBBLE_PALETTE.length];
              const floatClass = i % 2 === 0 ? "animate-craft-float" : "animate-craft-float-delayed";
              // Triangle: middle higher, sides lower (baseline via items-end + side translate)
              const triangleOffset =
                i === 1
                  ? "sm:-translate-y-14 md:-translate-y-[4.5rem] lg:-translate-y-[5rem]"
                  : "sm:translate-y-12 md:translate-y-14 lg:translate-y-16";
              return (
                <div key={i} className="flex w-full min-w-0 justify-center sm:max-w-none">
                  <div
                    className={`w-full min-w-0 max-w-[min(20rem,88vw)] transition-transform sm:max-w-[min(100%,min(22rem,32vw))] ${triangleOffset}`}
                  >
                    <div className="aspect-square w-full">
                      {loading ? (
                        <div
                          className={`flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full p-4 shadow-bubble ${bubbleClass} ${floatClass} animate-pulse sm:p-5`}
                        >
                          <div className="w-3/4 space-y-2">
                            <div className="h-4 w-full rounded bg-[hsl(var(--craft-ink))]/15" />
                            <div className="mx-auto h-3 w-5/6 rounded bg-[hsl(var(--craft-ink))]/12" />
                            <div className="mx-auto h-3 w-2/3 rounded bg-[hsl(var(--craft-ink))]/12" />
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={b.to ?? "#"}
                          state={b.state}
                          onClick={(e) => {
                            if (!b.to) e.preventDefault();
                          }}
                          aria-label={titleShown ? `Open ${titleShown}` : "Open blueprint"}
                          className={`group bubble-interactive relative flex h-full w-full min-h-0 flex-col items-center justify-center overflow-hidden rounded-full text-center text-[hsl(var(--craft-ink))] shadow-bubble focus:outline-none focus-visible:ring-4 focus-visible:ring-caution/60 ${padClass} ${bubbleClass} ${floatClass}`}
                        >
                          <span className="bubble-shine" aria-hidden />
                          <span className="bubble-sparkle s1" aria-hidden style={{ top: "10%", right: "16%" }}>
                            ✦
                          </span>
                          <span className="bubble-sparkle s2" aria-hidden style={{ bottom: "18%", left: "12%" }}>
                            ✧
                          </span>
                          <span className="bubble-sparkle s3" aria-hidden style={{ top: "45%", right: "8%" }}>
                            ✦
                          </span>
                          <span
                            aria-hidden
                            className="pointer-events-none absolute left-[16%] top-[12%] h-10 w-20 rounded-full bg-white/50 blur-md sm:h-16 sm:w-24"
                          />
                          <div className="relative z-10 flex min-h-0 w-[92%] flex-col justify-center sm:w-[90%]">
                            <h2 className={titleClass}>{titleShown}</h2>
                            <p className={descClass}>{descShown}</p>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!loading && (
            <div className="flex w-full max-w-5xl shrink-0 flex-col items-center justify-center self-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-4 md:pt-5">
              <p
                className="text-balance bg-gradient-to-r from-paper/95 via-caution/90 to-sky/80 bg-clip-text text-center text-xl font-block uppercase leading-tight tracking-wide text-transparent drop-shadow-[0_2px_10px_hsl(0_0%_0%_/_0.45)] sm:text-2xl sm:leading-tight sm:tracking-wider md:text-3xl md:leading-tight lg:text-4xl"
              >
                Tap a bubble to open the full blueprint
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline card: loose scattered layout
  return (
    <>
      {bubbles.map((b, i) => {
        const p = SCATTERED_POSITIONS[i % SCATTERED_POSITIONS.length];
        const bubbleClass = BUBBLE_PALETTE[i % BUBBLE_PALETTE.length];
        const floatClass = i % 2 === 0 ? "animate-craft-float" : "animate-craft-float-delayed";
        const { size, ...pos } = p as unknown as { size: number } & CSSProperties;
        const style: CSSProperties = {
          ...pos,
          width: size,
          height: size,
        };

        const titleShown = displayBubbleText(b.title);
        const descShown = displayBubbleText(b.description);

        if (loading) {
          return (
            <div key={i} className="absolute" style={style}>
              <div
                className={`flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full p-4 shadow-bubble ${bubbleClass} ${floatClass} animate-pulse`}
              >
                <div className="w-3/4 space-y-2">
                  <div className="h-4 w-full rounded bg-[hsl(var(--craft-ink))]/10" />
                  <div className="mx-auto h-3 w-5/6 rounded bg-[hsl(var(--craft-ink))]/10" />
                  <div className="mx-auto h-3 w-2/3 rounded bg-[hsl(var(--craft-ink))]/10" />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={i} className="absolute" style={style}>
            <Link
              to={b.to ?? "#"}
              state={b.state}
              onClick={(e) => {
                if (!b.to) e.preventDefault();
              }}
              aria-label={titleShown ? `Open ${titleShown}` : "Open blueprint"}
              className={`group bubble-interactive relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full p-4 text-center text-[hsl(var(--craft-ink))] shadow-bubble focus:outline-none focus-visible:ring-4 focus-visible:ring-ink/25 sm:p-5 ${bubbleClass} ${floatClass}`}
            >
              <span className="bubble-shine" aria-hidden />
              <span className="bubble-sparkle s1" aria-hidden style={{ top: "12%", right: "18%" }}>
                ✦
              </span>
              <span className="bubble-sparkle s2" aria-hidden style={{ bottom: "20%", left: "14%" }}>
                ✧
              </span>
              <span className="bubble-sparkle s3" aria-hidden style={{ top: "48%", right: "8%" }}>
                ✦
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute left-[18%] top-[14%] h-16 w-24 rounded-full bg-white/50 blur-md"
              />
              <h2 className={`text-balance ${titleClass}`}>{titleShown}</h2>
              <p className={`${descClass} text-[hsl(var(--craft-ink))]/80`}>{descShown}</p>
            </Link>
          </div>
        );
      })}
    </>
  );
}

export function MagicBubbles({ items, loading, fullscreen, onClose }: MagicBubblesProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!loading) {
      setDots(0);
      return;
    }
    const id = window.setInterval(() => setDots((d) => (d + 1) % 4), 350);
    return () => window.clearInterval(id);
  }, [loading]);

  const thinkingDots = loading ? (
    <span className="inline-block w-[2.5ch] text-left align-baseline">
      {".".repeat(dots)}
    </span>
  ) : null;

  const bubbles = (loading
    ? [
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
      ]
    : items.slice(0, 3)) satisfies BubbleBlueprint[];

  if (!loading && bubbles.length === 0) return null;

  if (!fullscreen) {
    return (
      <div className="relative mt-8 min-h-[320px] overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-brut-sm">
        <BubbleShell
          title={loading ? "Genie is thinking" : "Magic bubbles"}
          titleSuffix={loading ? thinkingDots : undefined}
        >
          {renderBubbles(bubbles, loading)}
        </BubbleShell>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/85" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[71] inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper/95 px-3 py-2 font-mono text-xs uppercase tracking-widest shadow-brut-sm transition-colors hover:bg-paper"
        aria-label="Close magic bubbles"
      >
        <X className="h-4 w-4" /> close
      </button>

      <div className="absolute inset-0 min-h-0 overflow-hidden">
        <BubbleShell
          title={loading ? "Genie is thinking" : null}
          titleSuffix={loading ? thinkingDots : undefined}
          dark
        >
          {renderBubbles(bubbles, loading, true, !loading)}
        </BubbleShell>
      </div>
    </div>
  );
}
