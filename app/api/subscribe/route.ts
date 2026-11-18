import { NextResponse, type NextRequest } from "next/server";

const API_URL =
  process.env.API_URL ?? (process.env.NODE_ENV === "production" ? "https://api.mallzo.shop/api" : "http://localhost:8765/api");

// Same-origin proxy to the Django API: no CORS setup needed, and the API URL stays server-side.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  try {
    const r = await fetch(`${API_URL}/subscribe/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Lets the API rate-limit per visitor instead of per Next.js server.
        "X-Forwarded-For": req.headers.get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    return NextResponse.json(await r.json().catch(() => ({})), { status: r.status });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
