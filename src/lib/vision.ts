import { supabase } from "@/integrations/supabase/client";

export type Suggestion = { slug: string; title: string };

export type VisionResult = {
  top: string | null;
  labels: { description: string; score: number }[];
  objects: { name: string; score: number }[];
  suggestions: Suggestion[];
};

export async function detectFromBase64(imageBase64: string): Promise<VisionResult> {
  const { data, error } = await supabase.functions.invoke("vision-detect", {
    body: { imageBase64 },
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Empty response from vision service");
  if ((data as any).error) throw new Error((data as any).error);
  return data as VisionResult;
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