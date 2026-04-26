import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type Blueprint = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: string[];
};

const IMAGE_MODEL = "gemini-2.5-flash-image";

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
    const blueprint = body?.blueprint as Blueprint | undefined;
    if (
      !blueprint ||
      typeof blueprint.title !== "string" ||
      typeof blueprint.description !== "string" ||
      !["easy", "medium", "hard"].includes(blueprint.difficulty) ||
      !Array.isArray(blueprint.steps) ||
      blueprint.steps.some((s) => typeof s !== "string")
    ) {
      return NextResponse.json(
        { error: "Request must include blueprint: { title, difficulty, description, steps }" },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });

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
        responseModalities: ["IMAGE"],
      } as any,
    });

    for (const candidate of result.candidates ?? []) {
      const parts = candidate?.content?.parts ?? [];
      for (const part of parts) {
        const data = (part as any)?.inlineData?.data;
        if (typeof data === "string" && data.length > 0) {
          return NextResponse.json({ stepsImageBase64: data }, { status: 200 });
        }
      }
    }

    return NextResponse.json(
      { error: "Image model did not return inline image data" },
      { status: 502 },
    );
  } catch (e: any) {
    console.error("[api/generate-image] error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Generate image failed" },
      { status: 500 },
    );
  }
}
