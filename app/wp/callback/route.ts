import type { NextRequest } from "next/server";
import { receiveEvent, verifyHandshake } from "@/lib/whatsapp";

// WhatsApp Cloud API webhook: Callback URL = https://mallzo.shop/wp/callback/
export const GET = (req: NextRequest) => verifyHandshake(req);
export const POST = (req: NextRequest) => receiveEvent(req);
