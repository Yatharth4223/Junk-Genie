const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We keep the existing Vite-style alias in TS (tsconfig paths).
  /**
   * Dev: afterFiles — Next.js `src/app/api/*` route handlers are preferred over this rewrite, so
   * `/api/generate`, `/api/vision`, etc. still hit the TS routes. Unmatched paths (e.g. the Python
   * FastAPI routes under `/api/analyze`, `/api/manual`) proxy to the local uvicorn instance.
   * Prod: the FastAPI `app` is served from the same deployment (root `api/index.py`); no proxy.
   */
  async rewrites() {
    if (!isDev) {
      // Same-origin: Vercel routes `/api/...` to the Python function and Next route handlers; no host rewrite.
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;

