import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type Blueprint = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: string[];
  stepsImageBase64?: string;
};

const MODEL = "gemma-4-26b-a4b-it";
const IMAGE_MODEL = "gemini-2.5-flash-image";

async function generateStepsImageBase64(ai: GoogleGenAI, blueprint: Blueprint) {
  const prompt = [
    "Generate a clean instruction image for this DIY craft.",
    "Style: simple, high-contrast, minimal background, looks like a step-by-step guide.",
    "Must match the craft title and the steps below.",
    "",
    `Craft title: ${blueprint.title}`,
    `Difficulty: ${blueprint.difficulty}`,
    "Steps:",
    ...blueprint.steps.map((s, i) => `${i + 1}. ${s}`),
  ].join("\n");

  const result = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      // @google/genai expects strings here.
      responseModalities: ["IMAGE"],
    } as any,
  });

  for (const candidate of result.candidates ?? []) {
    const parts = candidate?.content?.parts ?? [];
    for (const part of parts) {
      const data = (part as any)?.inlineData?.data;
      if (typeof data === "string" && data.length > 0) return data;
    }
  }

  throw new Error("Image model did not return inline image data");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY ?? process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_GENAI_API_KEY (or GOOGLE_API_KEY) in .env.local" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const inventory = body?.inventory as string[] | undefined;
    if (!Array.isArray(inventory) || inventory.some((x) => typeof x !== "string")) {
      return NextResponse.json(
        { error: "inventory must be an array of strings" },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = [
      "You are an expert DIY upcycling assistant.",
      "Given this inventory list of detected objects/materials, return EXACTLY 3 upcycling blueprints as JSON.",
      "Output must be strict JSON only (no markdown).",
      "",
      "Schema:",
      "{ \"blueprints\": [ { \"title\": string, \"difficulty\": \"easy\"|\"medium\"|\"hard\", \"description\": string, \"steps\": string[] } ] }",
      "",
      `Inventory: ${JSON.stringify(inventory)}`,
    ].join("\n");

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.text ?? "";
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      // If the model returns extra text, try to recover the first JSON object.
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start >= 0 && end > start) {
        json = JSON.parse(text.slice(start, end + 1));
      } else {
        throw new Error("Model did not return valid JSON");
      }
    }

    const blueprints = (json?.blueprints ?? []) as Blueprint[];
    if (!Array.isArray(blueprints) || blueprints.length !== 3) {
      return NextResponse.json(
        { error: "Model response invalid: expected exactly 3 blueprints", raw: json },
        { status: 502 },
      );
    }

    // Generate a craft-specific steps image for each blueprint (base64 PNG/JPEG returned by model).
    const withImages: Blueprint[] = [];
    for (const bp of blueprints) {
      try {
        const stepsImageBase64 = await generateStepsImageBase64(ai, bp);
        withImages.push({ ...bp, stepsImageBase64 });
      } catch (e: any) {
        // If image generation fails, still return the blueprint text.
        withImages.push({ ...bp, stepsImageBase64: undefined });
        console.error("[api/generate] steps image generation failed:", e?.message ?? e);
      }
    }

    return NextResponse.json({ blueprints: withImages }, { status: 200 });
  } catch (e: any) {
    console.error("[api/generate] error:", e);
    return NextResponse.json({ error: e?.message ?? "Generate route failed" }, { status: 500 });
  }
}

