import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Camera, CircleDot, Square, Sparkles, AlertTriangle, Loader2, X } from "lucide-react";
import { JunkNav } from "@/components/JunkNav";
import { JunkFooter } from "@/components/JunkFooter";
import { captureFrame, detectFromBase64, type VisionResult } from "@/lib/vision";
import { MagicBubbles } from "@/components/MagicBubbles";

type Status = "idle" | "starting" | "live" | "error";

const SCAN_INTERVAL_MS = 2500;

type DetectedItem = {
  id: string;
  label: string;
  score: number;
  crossedOff: boolean;
  lastSeenAt: number;
};

type Blueprint = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: string[];
  stepsImageBase64?: string;
};

const Scan = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [detected, setDetected] = useState<DetectedItem[]>([]);
  const [magicOpen, setMagicOpen] = useState(false);
  const [makingMagic, setMakingMagic] = useState(false);
  const [blueprints, setBlueprints] = useState<Blueprint[] | null>(null);
  const [magicError, setMagicError] = useState<string | null>(null);

  useEffect(() => {
    const st = loc.state as { restoreMagicOverlay?: boolean; allBlueprints?: Blueprint[] } | null;
    if (st?.restoreMagicOverlay && st.allBlueprints && st.allBlueprints.length > 0) {
      setBlueprints(st.allBlueprints);
      setMagicOpen(true);
      setMakingMagic(false);
      setMagicError(null);
      navigate("/create/scan", { replace: true, state: {} });
    }
  }, [loc.state, navigate]);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setScanning(false);
    setStopped(true);
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMsg(null);
    setMagicError(null);
    setBlueprints(null);
    setMagicOpen(false);
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("live");
      setScanning(true);
      setStopped(false);
      setDetected([]);
    } catch (err: any) {
      console.error("getUserMedia failed:", err);
      const denied = err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError";
      setErrorMsg(
        denied
          ? "Camera permission was denied. Please re-enable camera access in your browser settings (look for the camera icon in the address bar)."
          : err?.message || "Unable to access the camera on this device.",
      );
      setStatus("error");
    }
  }, []);

  // Throttled scan loop tied to "scanning" flag
  useEffect(() => {
    if (!scanning) return;
    const tick = async () => {
      if (inFlightRef.current) return;
      const video = videoRef.current;
      if (!video) return;
      const frame = captureFrame(video);
      if (!frame) return;
      inFlightRef.current = true;
      try {
        const res = await detectFromBase64(frame);
        const now = Date.now();
        const tags: { label: string; score: number }[] = [
          ...(res.objects ?? []).map((o) => ({ label: o.name, score: o.score ?? 0 })),
          ...(res.labels ?? []).map((l) => ({ label: l.description, score: l.score ?? 0 })),
        ].filter((t) => !!t.label?.trim());

        if (tags.length) {
          setDetected((prev) => {
            const byKey = new Map<string, DetectedItem>();
            for (const p of prev) byKey.set(p.label.toLowerCase(), p);
            for (const t of tags) {
              const key = t.label.toLowerCase();
              const existing = byKey.get(key);
              if (!existing) {
                byKey.set(key, {
                  id: `${key}-${Math.random().toString(36).slice(2, 8)}`,
                  label: t.label,
                  score: t.score,
                  crossedOff: false,
                  lastSeenAt: now,
                });
              } else {
                byKey.set(key, {
                  ...existing,
                  score: Math.max(existing.score, t.score),
                  lastSeenAt: now,
                });
              }
            }
            // sort by score desc, then most-recent
            return Array.from(byKey.values()).sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score;
              return b.lastSeenAt - a.lastSeenAt;
            });
          });
        }
      } catch (err) {
        console.error("Vision call failed:", err);
      } finally {
        inFlightRef.current = false;
      }
    };
    // first tick after a short delay so camera can warm up
    const initial = window.setTimeout(tick, 800);
    intervalRef.current = window.setInterval(tick, SCAN_INTERVAL_MS);
    return () => {
      window.clearTimeout(initial);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [scanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inventory = useMemo(
    () => detected.filter((d) => !d.crossedOff).map((d) => d.label),
    [detected],
  );

  const toggleCrossOff = (id: string) => {
    setDetected((prev) => prev.map((d) => (d.id === id ? { ...d, crossedOff: !d.crossedOff } : d)));
  };

  const clearCrossedOff = () => {
    setDetected((prev) => prev.filter((d) => !d.crossedOff));
  };

  const makeMagic = async () => {
    if (!inventory.length) return;
    setMagicOpen(true);
    setMakingMagic(true);
    setMagicError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ inventory }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || `Generate failed (${res.status})`);
      const data = text ? JSON.parse(text) : null;
      const bps = (data?.blueprints ?? []) as Blueprint[];
      setBlueprints(bps);
    } catch (e: any) {
      setMagicError(e?.message ?? "Failed to make magic");
      setBlueprints(null);
    } finally {
      setMakingMagic(false);
    }
  };

  const statusPill = (() => {
    const base = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest border-2";
    switch (status) {
      case "live":
        return (
          <span className={`${base} bg-eco-leaf/30 border-eco-forest text-eco-forest`}>
            <CircleDot className="w-3.5 h-3.5 animate-pulse" /> Live
          </span>
        );
      case "starting":
        return (
          <span className={`${base} bg-bubble-pink/30 border-grape text-grape`}>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Camera starting
          </span>
        );
      case "error":
        return (
          <span className={`${base} bg-red-stamp/20 border-red-stamp text-red-stamp`}>
            <AlertTriangle className="w-3.5 h-3.5" /> Error
          </span>
        );
      default:
        return (
          <span className={`${base} bg-eco-sage/40 border-eco-forest text-ink-soft`}>
            <Camera className="w-3.5 h-3.5" /> Idle
          </span>
        );
    }
  })();

  return (
    <main className="min-h-screen text-foreground flex flex-col">
      <JunkNav hideCta />

      <section className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 md:py-12">
        <Link
          to="/create"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-grape transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> back to options
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-3xl md:text-5xl leading-[0.95]">
              Scan it <span className="text-grape">live</span> 📸
            </h1>
            <p className="font-mono text-sm text-ink-soft mt-1">
              Point at the junk. The genie peeks every couple seconds. ✨
            </p>
          </div>
          {statusPill}
        </div>

        {/* Camera preview */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-ink bg-ink shadow-brut-sm aspect-[3/4] sm:aspect-video">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* guide frame */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[70%] h-[60%] border-2 border-paper/70 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
          </div>
          <div className="pointer-events-none absolute top-3 left-3 right-3 flex justify-between text-paper font-mono text-[11px] uppercase tracking-widest">
            <span className="bg-ink/60 px-2 py-1 rounded">point at the junk</span>
            {scanning && (
              <span className="bg-grape/80 px-2 py-1 rounded inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> scanning
              </span>
            )}
          </div>

          {status === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/80">
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-2 bg-grape text-paper px-6 py-3 font-block text-sm uppercase rounded-xl shadow-brut-sm hover:bg-eco-forest transition-colors"
              >
                <Camera className="w-4 h-4" /> Start camera
              </button>
            </div>
          )}

          {status === "starting" && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
              <span className="inline-flex items-center gap-2 text-paper font-mono text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Warming up the lens…
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/85 px-6">
              <div className="text-center text-paper max-w-md">
                <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-caution" />
                <p className="font-mono text-sm">{errorMsg}</p>
                <button
                  onClick={startCamera}
                  className="mt-4 inline-flex items-center gap-2 bg-paper text-ink px-5 py-2.5 font-block text-xs uppercase rounded-xl shadow-brut-sm"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          {status !== "live" ? (
            <button
              onClick={startCamera}
              disabled={status === "starting"}
              className="inline-flex items-center gap-2 bg-eco-forest text-paper px-5 py-2.5 font-block text-sm uppercase rounded-xl shadow-brut-sm hover:bg-grape transition-colors disabled:opacity-60"
            >
              <CircleDot className="w-4 h-4" /> Start
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-2 bg-red-stamp text-paper px-5 py-2.5 font-block text-sm uppercase rounded-xl shadow-brut-sm hover:bg-ink transition-colors"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          )}
        </div>

        {/* Detected list */}
        {detected.length > 0 && (
          <div className="mt-10 bg-paper border-2 border-ink rounded-2xl p-6 shadow-brut-sm">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Detected items</div>
                <div className="font-mono text-xs text-ink-soft mt-1">
                  {stopped ? "Review and cross off anything you don’t want." : "Cross off items as you tidy the pile."}
                </div>
              </div>
              <button
                onClick={clearCrossedOff}
                className="inline-flex items-center gap-1 px-3 py-1.5 font-mono text-xs uppercase tracking-widest border-2 border-ink rounded-lg bg-paper hover:bg-eco-sage/40 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> remove crossed
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {detected.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleCrossOff(d.id)}
                  className={`inline-flex items-center gap-2 border-2 border-ink rounded-full px-3 py-1.5 font-mono text-[11px] ${
                    d.crossedOff ? "bg-paper text-ink-soft line-through opacity-60" : "bg-eco-sage/40 text-ink"
                  }`}
                  title="Click to cross off"
                >
                  <span className="uppercase tracking-widest">{d.label}</span>
                  <span className="text-ink-soft">{Math.round(d.score * 100)}%</span>
                </button>
              ))}
            </div>

            {stopped && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={makeMagic}
                  disabled={!inventory.length || makingMagic}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-block text-sm uppercase rounded-xl bg-grape text-paper shadow-brut-sm hover:bg-eco-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {makingMagic ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Making magic…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Make magic
                    </>
                  )}
                </button>
              </div>
            )}

            {magicError && (
              <div className="mt-4 font-mono text-sm text-red-stamp">
                {magicError}
              </div>
            )}
          </div>
        )}

        {/* Magic bubbles overlay */}
        <MagicBubbles
          fullscreen={magicOpen}
          onClose={() => setMagicOpen(false)}
          loading={makingMagic}
          items={(blueprints ?? []).map((b, idx) => ({
            title: b.title,
            description: b.description,
            to: `/magic/${idx}`,
            state: {
              blueprint: b,
              allBlueprints: blueprints ?? [],
              bubblesPath: "/create/scan",
            },
          }))}
        />
      </section>

      <JunkFooter />
    </main>
  );
};

export default Scan;