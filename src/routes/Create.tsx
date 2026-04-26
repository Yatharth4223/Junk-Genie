import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Upload, Image as ImageIcon, X, ArrowLeft, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { JunkNav } from "@/components/JunkNav";
import { JunkFooter } from "@/components/JunkFooter";
import { ProcessSteps } from "@/components/ProcessSteps";
import { detectFromBase64, topTwoByConfidence, type VisionResult } from "@/lib/vision";
import { toast } from "sonner";
import { MagicBubbles } from "@/components/MagicBubbles";

const MAX_IMAGES = 5;

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "analyzing" | "done" | "error";
  result?: VisionResult;
  error?: string;
};

type Blueprint = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: string[];
  stepsImageBase64?: string;
};

function safeName(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();
}

const Create = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [mode, setMode] = useState<"none" | "upload">("none");
  const [items, setItems] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      navigate("/create", { replace: true, state: {} });
    }
  }, [loc.state, navigate]);

  const inventory = useMemo(() => {
    const tags: string[] = [];
    for (const it of items) {
      if (it.status !== "done" || !it.result) continue;
      for (const o of it.result.objectNames ?? []) tags.push(o);
      for (const o of it.result.objects ?? []) tags.push(o.name);
      for (const l of it.result.labels ?? []) tags.push(l.description);
    }
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const t of tags) {
      const v = (t ?? "").trim();
      if (!v) continue;
      const k = v.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      unique.push(v);
    }
    return unique.slice(0, 12);
  }, [items]);

  const makeMagic = async () => {
    if (!inventory.length) return;
    setMagicOpen(true);
    setMakingMagic(true);
    setMagicError(null);
    setBlueprints(null);
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

  const saveJsonToResources = async (filename: string, payload: unknown) => {
    const res = await fetch("/api/save-json", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filename, payload }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to save JSON (${res.status})`);
    }
    return (await res.json()) as { ok: true; file: string };
  };

  const readAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const analyzeItem = async (item: ImageItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "analyzing" } : i)),
    );
    try {
      const base64 = item.preview.split(",")[1];
      const result = await detectFromBase64(base64);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "done", result } : i)),
      );
      setBlueprints(null);
      setMagicError(null);
      setMagicOpen(false);

      const payload = {
        image: {
          name: item.file.name,
          size: item.file.size,
          type: item.file.type,
          lastModified: item.file.lastModified,
          analyzedAt: new Date().toISOString(),
        },
        vision: result,
      };
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      await saveJsonToResources(`${safeName(item.file.name)}_${stamp}.json`, payload);
    } catch (err: any) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "error", error: err?.message ?? "Failed" } : i,
        ),
      );
      toast.error(`Couldn't analyze ${item.file.name}`, { description: err?.message });
    }
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const slotsLeft = MAX_IMAGES - items.length;
    if (slotsLeft <= 0) {
      toast.error(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }
    const accepted = files.slice(0, slotsLeft);
    if (files.length > accepted.length) {
      toast.warning(`Only added ${accepted.length} of ${files.length} (max ${MAX_IMAGES}).`);
    }

    const newItems: ImageItem[] = await Promise.all(
      accepted.map(async (file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: await readAsDataURL(file),
        status: "pending" as const,
      })),
    );

    setItems((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Kick off analysis for each new item in parallel
    newItems.forEach(analyzeItem);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen text-foreground flex flex-col">
      <JunkNav hideCta />

      <section className="flex-1 mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-grape transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> back home
        </Link>

        {/* Create page layout: steps on top, actions below */}
        <div className="flex flex-col gap-10">
          {/* Top: How the magic happens (already horizontal inside) */}
          <ProcessSteps />

          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-eco-sage/40 border-2 border-eco-forest rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-grape" /> step one of magic
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.95] mb-4">
              How do you want to <span className="text-grape">share your junk?</span>
            </h1>
            <p className="font-mono text-sm md:text-base text-ink-soft max-w-xl mx-auto">
              Pick a way to show the genie what you've got. We'll handle the rest. ✨
            </p>
          </div>

          {/* Bottom: Upload + Scan (horizontal line) */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* UPLOAD */}
            <button
              type="button"
              onClick={() => {
                setMode("upload");
                fileInputRef.current?.click();
              }}
              className={`group text-left bg-paper border-2 border-ink rounded-2xl p-8 shadow-brut-sm hover:-translate-y-1 hover:shadow-brut transition-all ${
                mode === "upload" ? "ring-4 ring-grape/40 -translate-y-1" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-bubble-pink/40 border-2 border-grape flex items-center justify-center mb-5 group-hover:-rotate-6 transition-transform">
                <Upload className="w-8 h-8 text-grape" strokeWidth={2.5} />
              </div>
              <h2 className="font-block text-2xl uppercase mb-2">Upload pics 🖼️</h2>
              <p className="font-mono text-sm text-ink-soft mb-5">
                Already snapped them? Drop up to {MAX_IMAGES} photos &mdash; we'll ID each one live.
              </p>
              <span className="inline-flex items-center gap-2 bg-grape text-paper px-4 py-2 font-block text-xs uppercase rounded-xl">
                Choose images
              </span>
            </button>

            {/* SCAN */}
            <button
              type="button"
              onClick={() => navigate("/create/scan")}
              className="group text-left bg-paper border-2 border-ink rounded-2xl p-8 shadow-brut-sm hover:-translate-y-1 hover:shadow-brut transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-eco-leaf/30 border-2 border-eco-forest flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform">
                <Camera className="w-8 h-8 text-eco-forest" strokeWidth={2.5} />
              </div>
              <h2 className="font-block text-2xl uppercase mb-2">Scan it live 📸</h2>
              <p className="font-mono text-sm text-ink-soft mb-5">
                Point your camera at the pile. The genie peeks through the lens in real time.
              </p>
              <span className="inline-flex items-center gap-2 bg-eco-forest text-paper px-4 py-2 font-block text-xs uppercase rounded-xl">
                Start scanning
              </span>
            </button>
          </div>
        </div>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />

        {/* Result panels */}
        {mode === "upload" && items.length > 0 && (
          <div className="mt-10 bg-paper border-2 border-ink rounded-2xl p-6 shadow-brut-sm">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                <ImageIcon className="w-4 h-4 text-grape" />
                <span>{items.length} / {MAX_IMAGES} images</span>
              </div>
              <div className="flex gap-2">
                {items.length < MAX_IMAGES && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 font-mono text-xs uppercase tracking-widest border-2 border-ink rounded-lg bg-paper hover:bg-eco-sage/40 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> add more
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-grape transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> clear all
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const top2 = item.result ? topTwoByConfidence(item.result) : [];
                return (
                <div
                  key={item.id}
                  className="border-2 border-ink rounded-xl overflow-hidden bg-eco-sage/10 flex flex-col"
                >
                  <div className="relative aspect-square bg-eco-sage/20 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-paper border-2 border-ink flex items-center justify-center hover:bg-grape hover:text-paper transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {item.status === "analyzing" && (
                      <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
                        <div className="bg-paper border-2 border-ink rounded-lg px-3 py-1.5 flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-grape" />
                          <span className="font-mono text-[11px] uppercase tracking-widest">Analyzing</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col gap-2">
                    <div className="font-mono text-[11px] text-ink-soft truncate" title={item.file.name}>
                      {item.file.name}
                    </div>

                    {item.status === "done" && item.result && top2.length > 0 && (
                      <div className="font-block text-xs uppercase tracking-wide text-ink">
                        {top2[0].label}
                      </div>
                    )}

                    {item.status === "error" && (
                      <div className="flex items-start gap-1.5 text-[11px] font-mono text-grape">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{item.error}</span>
                      </div>
                    )}

                    {item.status === "done" && item.result && (
                      <div className="flex flex-wrap gap-1.5">
                        {top2.map((t, idx) => (
                          <span
                            key={`${t.label}-${idx}`}
                            className="inline-flex items-center gap-1 bg-eco-sage/40 border border-eco-forest rounded-full px-2 py-0.5 font-mono text-[10px]"
                            title={`${Math.round(t.score * 100)}% confidence`}
                          >
                            {t.label}
                            <span className="text-ink-soft">{Math.round(t.score * 100)}%</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                disabled={!items.some((i) => i.status === "done")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-block text-sm uppercase rounded-xl bg-grape text-paper shadow-brut-sm hover:bg-eco-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={makeMagic}
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

            {magicError && (
              <div className="mt-4 font-mono text-sm text-red-stamp">
                {magicError}
              </div>
            )}
          </div>
        )}

        {magicOpen && (
          <MagicBubbles
            fullscreen
            onClose={() => setMagicOpen(false)}
            loading={makingMagic}
            items={(blueprints ?? []).map((b, idx) => ({
              title: b.title,
              description: b.description,
              to: `/magic/${idx}`,
              state: {
                blueprint: b,
                allBlueprints: blueprints ?? [],
                bubblesPath: "/create",
              },
            }))}
          />
        )}
      </section>

      <JunkFooter />
    </main>
  );
};

export default Create;