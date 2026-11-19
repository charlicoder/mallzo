import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Must equal the "Verify token" typed in Meta's webhook settings. Set WHATSAPP_VERIFY_TOKEN to a long random
// string and paste the same string into Meta. The default is the value currently entered there, so the
// handshake works until you change both.
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN?.trim() || "mallzo-whatsapp-verify-token";
// Meta app secret (App settings → Basic). When set, POST bodies must carry a valid X-Hub-Signature-256.
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

/** Meta's webhook handshake: GET ?hub.mode=subscribe&hub.verify_token=…&hub.challenge=… → echo the challenge. */
export function verifyHandshake(req: NextRequest): NextResponse {
  const q = req.nextUrl.searchParams;
  const token = q.get("hub.verify_token") ?? "";
  const a = Buffer.from(token);
  const b = Buffer.from(VERIFY_TOKEN);
  const ok = q.get("hub.mode") === "subscribe" && a.length === b.length && timingSafeEqual(a, b);
  if (!ok) return new NextResponse("Forbidden", { status: 403 });
  return new NextResponse(q.get("hub.challenge") ?? "", { status: 200, headers: { "Content-Type": "text/plain" } });
}

/** Incoming WhatsApp events (messages, delivery status). Always answers 200 quickly so Meta doesn't retry. */
export async function receiveEvent(req: NextRequest): Promise<NextResponse> {
  const raw = await req.text();
  if (APP_SECRET) {
    const sig = req.headers.get("x-hub-signature-256") ?? "";
    const expected = "sha256=" + createHmac("sha256", APP_SECRET).update(raw).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return new NextResponse("Invalid signature", { status: 401 });
  }
  try {
    const body = JSON.parse(raw);
    // Hook for handling messages/statuses; for now they are logged on the server.
    console.log("[whatsapp] event", JSON.stringify(body).slice(0, 2000));
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }
  return NextResponse.json({ status: "received" });
}
