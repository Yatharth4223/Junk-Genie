import { corsHeaders } from "@supabase/supabase-js/cors";

// Maps a detected label to fun upcycling ideas (slug + title).
const ideaMap: Record<string, { slug: string; title: string }[]> = {
  bottle: [
    { slug: "bottle-planter", title: "Mini herb planter" },
    { slug: "bottle-bird-feeder", title: "Backyard bird feeder" },
    { slug: "bottle-lamp", title: "Fairy-light lamp" },
  ],
  jar: [
    { slug: "jar-terrarium", title: "Tiny terrarium" },
    { slug: "jar-candle", title: "Soy candle holder" },
    { slug: "jar-organizer", title: "Desk organizer" },
  ],
  can: [
    { slug: "can-pencil-holder", title: "Pencil holder" },
    { slug: "can-planter", title: "Succulent planter" },
    { slug: "can-lantern", title: "Punched lantern" },
  ],
  box: [
    { slug: "box-storage", title: "Decorative storage box" },
    { slug: "box-fort", title: "Cardboard kid fort" },
    { slug: "box-organizer", title: "Drawer organizer" },
  ],
  cardboard: [
    { slug: "cardboard-cat-house", title: "Cat house" },
    { slug: "cardboard-wall-art", title: "Geometric wall art" },
    { slug: "cardboard-fort", title: "Mini fort" },
  ],
  clothing: [
    { slug: "tshirt-tote", title: "No-sew tote bag" },
    { slug: "tshirt-rug", title: "Braided rag rug" },
    { slug: "tshirt-pillow", title: "Memory pillow" },
  ],
  shoe: [
    { slug: "shoe-planter", title: "Quirky shoe planter" },
    { slug: "shoe-organizer", title: "Wall organizer" },
  ],
  furniture: [
    { slug: "furniture-restore", title: "Sand & restain" },
    { slug: "furniture-paint", title: "Bold paint refresh" },
    { slug: "furniture-repurpose", title: "Repurpose into shelving" },
  ],
  electronics: [
    { slug: "electronics-recycle", title: "Drop at e-waste recycler" },
    { slug: "electronics-art", title: "Circuit board art" },
  ],
  paper: [
    { slug: "paper-mache", title: "Paper-mâché bowl" },
    { slug: "paper-beads", title: "Rolled paper beads" },
  ],
  plastic: [
    { slug: "plastic-planter", title: "Self-watering planter" },
    { slug: "plastic-recycle", title: "Sort & recycle" },
  ],
  wood: [
    { slug: "wood-shelf", title: "Floating shelf" },
    { slug: "wood-coaster", title: "Sliced wood coasters" },
  ],
  glass: [
    { slug: "glass-vase", title: "Frosted vase" },
    { slug: "glass-mosaic", title: "Mosaic tray" },
  ],
  fabric: [
    { slug: "fabric-quilt", title: "Patchwork quilt square" },
    { slug: "fabric-banner", title: "Party banner" },
  ],
};

const fallbackIdeas = [
  { slug: "general-upcycle", title: "Brainstorm a new use" },
  { slug: "general-donate", title: "Donate locally" },
  { slug: "general-recycle", title: "Find a recycler" },
];

function suggestionsFor(labels: string[]): { slug: string; title: string }[] {
  const seen = new Set<string>();
  const out: { slug: string; title: string }[] = [];
  for (const label of labels) {
    const lower = label.toLowerCase();
    for (const key of Object.keys(ideaMap)) {
      if (lower.includes(key)) {
        for (const idea of ideaMap[key]) {
          if (!seen.has(idea.slug)) {
            seen.add(idea.slug);
            out.push(idea);
          }
        }
      }
    }
    if (out.length >= 6) break;
  }
  if (out.length === 0) return fallbackIdeas;
  return out.slice(0, 6);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_VISION_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Vision API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "imageBase64 (string) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Strip data URL prefix if present
    const content = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content },
              features: [
                { type: "LABEL_DETECTION", maxResults: 8 },
                { type: "OBJECT_LOCALIZATION", maxResults: 5 },
              ],
            },
          ],
        }),
      },
    );

    if (!visionRes.ok) {
      const errText = await visionRes.text();
      console.error("Vision API error:", visionRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Vision API request failed", detail: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await visionRes.json();
    const annotations = data?.responses?.[0] ?? {};
    const labels: { description: string; score: number }[] = (annotations.labelAnnotations ?? [])
      .map((l: any) => ({ description: l.description, score: l.score }));
    const objects: { name: string; score: number }[] = (annotations.localizedObjectAnnotations ?? [])
      .map((o: any) => ({ name: o.name, score: o.score }));

    const merged = [
      ...objects.map((o) => o.name),
      ...labels.map((l) => l.description),
    ];
    const top = merged[0] ?? null;
    const suggestions = suggestionsFor(merged);

    return new Response(
      JSON.stringify({ top, labels, objects, suggestions }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("vision-detect crashed:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});