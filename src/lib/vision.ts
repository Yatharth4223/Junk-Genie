export type Suggestion = { slug: string; title: string };

export type VisionResult = {
  top: string | null;
  labels: { description: string; score: number }[];
  objects: { name: string; score: number }[];
  objectNames?: string[];
  web?: any;
  imageProperties?: any;
  suggestions: Suggestion[];
};

export type DetectionTag = { label: string; score: number };

/**
 * Merges object + label detections, dedupes by label (keeps highest score),
 * returns the two names with the highest confidence.
 */
export function topTwoByConfidence(
  result: Pick<VisionResult, "objects" | "labels">
): DetectionTag[] {
  const tags: DetectionTag[] = [
    ...(result.objects ?? []).map((o) => ({ label: o.name, score: o.score ?? 0 })),
    ...(result.labels ?? []).map((l) => ({ label: l.description, score: l.score ?? 0 })),
  ];
  tags.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const unique: DetectionTag[] = [];
  for (const t of tags) {
    const k = t.label.toLowerCase();
    if (seen.has(k)) continue;
    if (!t.label.trim()) continue;
    seen.add(k);
    unique.push(t);
  }
  return unique.slice(0, 2);
}

export async function detectFromBase64(imageBase64: string): Promise<VisionResult> {
  const res = await fetch(`/api/vision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageBase64 }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Vision edge function failed | status=${res.status} | body=${text.slice(0, 1200)}`);
  }

  const data = text ? JSON.parse(text) : null;
  if (!data) throw new Error("Empty response from vision service");
  if ((data as any).error) throw new Error((data as any).error);
  return {
    top: data.top ?? null,
    labels: data.labels ?? [],
    objects: data.objects ?? [],
    objectNames: data.objectNames ?? [],
    web: data.web,
    imageProperties: data.imageProperties,
    suggestions: data.suggestions ?? [],
  } satisfies VisionResult;
}

/**
 * Captures a still frame from a <video> element and returns a base64 JPEG (no data: prefix).
 */
export function captureFrame(video: HTMLVideoElement, maxWidth = 640): string | null {
  if (!video.videoWidth || !video.videoHeight) return null;
  const ratio = video.videoHeight / video.videoWidth;
  const w = Math.min(maxWidth, video.videoWidth);
  const h = Math.round(w * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, w, h);
  // strip prefix
  const dataUrl = canvas.toDataURL("image/jpeg", 0.78);
  return dataUrl.split(",")[1] ?? null;
}