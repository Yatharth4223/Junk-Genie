import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

function safeFilename(input: string) {
  const base = path.basename(input || "result.json");
  const cleaned = base.replace(/[^a-z0-9._-]+/gi, "_");
  return cleaned.toLowerCase().endsWith(".json") ? cleaned : `${cleaned}.json`;
}

export async function POST(req: Request) {
  try {
    const { filename, payload } = (await req.json()) as {
      filename?: string;
      payload?: unknown;
    };

    const outDir = path.join(process.cwd(), "resources");
    await mkdir(outDir, { recursive: true });

    const outName = safeFilename(filename ?? "result.json");
    const outPath = path.join(outDir, outName);

    await writeFile(outPath, JSON.stringify(payload ?? null, null, 2), "utf8");

    return NextResponse.json({ ok: true, file: path.posix.join("resources", outName) });
  } catch (e: any) {
    return new NextResponse(e?.message ?? "Failed to save JSON", { status: 500 });
  }
}

