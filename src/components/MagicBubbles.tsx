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

const POSITIONS = [
  { top: "12%", left: "12%", size: 170, color: "bg-bubble-pink/40 border-grape" },
  { top: "18%", right: "10%", size: 150, color: "bg-sky/40 border-eco-forest" },
  { bottom: "12%", left: "18%", size: 155, color: "bg-eco-sage/40 border-eco-forest" },
  { bottom: "14%", right: "16%", size: 135, color: "bg-caution/30 border-ink" },
  { top: "42%", left: "40%", size: 190, color: "bg-grass/40 border-eco-forest" },
] as const;

function BubbleShell({
  title,
  titleSuffix,
  children,
  dark,
}: {
  title: string;
  titleSuffix?: ReactNode;
  children: ReactNode;
  dark?: boolean;
}) {
  const isThinking = title.toLowerCase().includes("thinking");
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={
          dark
            ? "absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/70 to-black/80"
            : "absolute inset-0 bg-gradient-to-br from-eco-sage/25 via-paper to-sky/20"
        }
      />
      {dark && <div className="absolute inset-0 bg-black/20" />}
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
      {children}
    </div>
  );
}

function renderBubbles(
  bubbles: BubbleBlueprint[],
  loading: boolean | undefined,
  large?: boolean,
  darkText?: boolean,
) {
  return (
    <>
      {bubbles.map((b, i) => {
        const p = POSITIONS[i % POSITIONS.length];
        const style: CSSProperties = {
          ...(p as any),
          width: (p as any).size + (large ? 140 : 0),
          height: (p as any).size + (large ? 140 : 0),
          animationDelay: `${i * 120}ms`,
        };
        return (
          <div key={i} className="absolute group" style={style}>
            {/* bubble */}
            <div
              className={`w-full h-full rounded-full border-2 ${p.color} shadow-brut-sm backdrop-blur-sm transition-all duration-200 will-change-transform group-hover:-translate-y-1 group-hover:shadow-brut group-hover:scale-[1.01]`}
            >
              <div className="w-full h-full rounded-full p-4 flex items-center justify-center text-center">
                {loading ? (
                  <div className="w-full space-y-2">
                    <div className="h-4 w-3/4 mx-auto bg-paper/25 rounded" />
                    <div className="h-3 w-5/6 mx-auto bg-paper/25 rounded" />
                    <div className="h-3 w-2/3 mx-auto bg-paper/25 rounded" />
                  </div>
                ) : (
                  <Link
                    to={b.to ?? "#"}
                    state={b.state}
                    className="max-w-[14rem] outline-none focus-visible:ring-2 focus-visible:ring-paper rounded-xl px-2 py-2"
                    onClick={(e) => {
                      if (!b.to) e.preventDefault();
                    }}
                    title="Open blueprint"
                  >
                    <div
                      className={`font-block text-xs uppercase leading-tight ${
                        darkText ? "text-paper" : "text-ink"
                      }`}
                    >
                      {b.title}
                    </div>
                    <div
                      className={`mt-2 font-mono text-[11px] leading-snug ${
                        darkText ? "text-paper/90" : "text-ink/85"
                      } line-clamp-4`}
                    >
                      {b.description}
                    </div>
                  </Link>
                )}
              </div>
            </div>
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
      <div className="relative mt-8 border-2 border-ink rounded-2xl bg-paper overflow-hidden shadow-brut-sm min-h-[320px]">
        <BubbleShell title={loading ? "Genie is thinking" : "Magic bubbles"} titleSuffix={thinkingDots}>
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
        className="absolute right-4 top-4 z-[71] inline-flex items-center gap-2 bg-paper/95 border-2 border-ink px-3 py-2 font-mono text-xs uppercase tracking-widest rounded-xl shadow-brut-sm hover:bg-paper transition-colors"
        aria-label="Close magic bubbles"
      >
        <X className="w-4 h-4" /> close
      </button>

      <div className="absolute inset-0 overflow-hidden">
        <BubbleShell title={loading ? "Genie is thinking" : "Magic bubbles"} titleSuffix={thinkingDots} dark>
          {renderBubbles(bubbles, loading, true, true)}
        </BubbleShell>
      </div>
    </div>
  );
}

