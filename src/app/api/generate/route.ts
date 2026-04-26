import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type Blueprint = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: string[];
};

const MODEL = "gemma-4-26b-a4b-it";

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

    // Text-only: images are generated on demand when the user opens /magic (see /api/generate-image).
    return NextResponse.json({ blueprints }, { status: 200 });
  } catch (e: any) {
    console.error("[api/generate] error:", e);
    return NextResponse.json({ error: e?.message ?? "Generate route failed" }, { status: 500 });
  }
}

