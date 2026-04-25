import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { ImageAnnotatorClient } from "@google-cloud/vision";

function resolveCredentialsPath() {
  const p = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "./google-credentials.json";
  return isAbsolute(p) ? p : resolve(process.cwd(), p);
}

let cachedClient: ImageAnnotatorClient | null = null;

function getClient() {
  if (cachedClient) return cachedClient;
  const keyFilename = resolveCredentialsPath();

  // Diagnostic: log which project + service account is being used
  const raw = readFileSync(keyFilename, "utf8");
  const json = JSON.parse(raw) as { project_id?: string; client_email?: string };
  console.log("[api/vision] Using service account:", {
    projectId: json.project_id,
    clientEmail: json.client_email,
  });

  cachedClient = new ImageAnnotatorClient({ keyFilename });
  return cachedClient;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageBase64 = body?.imageBase64 as string | undefined;
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 (string) is required" }, { status: 400 });
    }

    const b64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const content = Buffer.from(b64, "base64");

    const client = getClient();
    const [annotations] = await client.annotateImage({
      image: { content },
      features: [
        { type: "LABEL_DETECTION", maxResults: 8 },
        { type: "OBJECT_LOCALIZATION", maxResults: 5 },
        { type: "WEB_DETECTION", maxResults: 5 },
        { type: "IMAGE_PROPERTIES" },
      ],
    });

    const labels = (annotations.labelAnnotations ?? []).map((l) => ({
      description: l.description,
      score: l.score,
    }));
    const objects = (annotations.localizedObjectAnnotations ?? []).map((o) => ({
      name: o.name,
      score: o.score,
    }));

    const merged = [...objects.map((o) => o.name), ...labels.map((l) => l.description)].filter(
      Boolean,
    ) as string[];
    const top = merged[0] ?? null;

    // Return object names for downstream generation
    const objectNames = objects.map((o) => o.name).filter(Boolean) as string[];

    return NextResponse.json(
      {
        top,
        objectNames,
        labels,
        objects,
        web: annotations.webDetection ?? null,
        imageProperties: annotations.imagePropertiesAnnotation ?? null,
      },
      { status: 200 },
    );
  } catch (e: any) {
    console.error("[api/vision] error:", e);
    return NextResponse.json({ error: e?.message ?? "Vision route failed" }, { status: 500 });
  }
}

