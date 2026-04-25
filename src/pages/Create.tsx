import { useRef, useState } from "react";
import { Camera, Upload, Image as ImageIcon, X, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { JunkNav } from "@/components/JunkNav";
import { JunkFooter } from "@/components/JunkFooter";

const Create = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"none" | "upload">("none");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen text-foreground flex flex-col">
      <JunkNav />

      <section className="flex-1 mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-grape transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> back home
        </Link>

        <div className="text-center mb-12">
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

        {/* Option cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
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
            <h2 className="font-block text-2xl uppercase mb-2">Upload a pic 🖼️</h2>
            <p className="font-mono text-sm text-ink-soft mb-5">
              Already snapped it? Drop in a photo from your phone or computer.
            </p>
            <span className="inline-flex items-center gap-2 bg-grape text-paper px-4 py-2 font-block text-xs uppercase rounded-xl">
              Choose image
            </span>
          </button>
        </div>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        {/* Result panels */}
        {mode === "upload" && preview && (
          <div className="mt-10 bg-paper border-2 border-ink rounded-2xl p-6 shadow-brut-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                <ImageIcon className="w-4 h-4 text-grape" />
                <span className="truncate max-w-[60vw] md:max-w-md">{fileName}</span>
              </div>
              <button
                onClick={clearPreview}
                className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-grape transition-colors"
              >
                <X className="w-4 h-4" /> remove
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border-2 border-ink bg-eco-sage/20 flex items-center justify-center max-h-[480px]">
              <img
                src={preview}
                alt="Your uploaded junk preview"
                className="max-h-[480px] w-auto object-contain"
              />
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={clearPreview}
                className="px-5 py-2.5 font-block text-sm uppercase rounded-xl border-2 border-ink bg-paper hover:bg-eco-sage/40 transition-colors"
              >
                Pick another
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-block text-sm uppercase rounded-xl bg-grape text-paper shadow-brut-sm hover:bg-eco-forest transition-colors">
                <Sparkles className="w-4 h-4" /> Make magic
              </button>
            </div>
          </div>
        )}
      </section>

      <JunkFooter />
    </main>
  );
};

export default Create;