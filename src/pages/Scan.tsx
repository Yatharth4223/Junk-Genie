import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, CircleDot, Square, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { JunkNav } from "@/components/JunkNav";
import { JunkFooter } from "@/components/JunkFooter";
import { captureFrame, detectFromBase64, type VisionResult } from "@/lib/vision";

type Status = "idle" | "starting" | "live" | "error";

const SCAN_INTERVAL_MS = 2500;

const Scan = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VisionResult | null>(null);
  const [scanning, setScanning] = useState(false);

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
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMsg(null);
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
        if (res?.top) setResult(res);
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
      <JunkNav />

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

        {/* Results */}
        {result && (
          <div className="mt-10 bg-paper border-2 border-ink rounded-2xl p-6 shadow-brut-sm">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-soft mb-2">Detected</div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-eco-leaf/30 border-2 border-eco-forest flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-eco-forest" />
              </div>
              <h2 className="font-block text-2xl md:text-3xl uppercase">
                {result.top ?? "Something interesting"}
              </h2>
            </div>

            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-soft mb-3">
              Turn it into…
            </div>
            <div className="flex flex-wrap gap-3">
              {result.suggestions.map((s) => (
                <Link
                  key={s.slug}
                  to={`/ideas/${s.slug}`}
                  state={{ title: s.title, source: result.top }}
                  className="inline-flex items-center gap-2 bg-eco-sage/40 border-2 border-eco-forest px-4 py-2 rounded-xl font-block text-xs uppercase hover:-translate-y-0.5 hover:bg-grape hover:text-paper transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {s.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <JunkFooter />
    </main>
  );
};

export default Scan;