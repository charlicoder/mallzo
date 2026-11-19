import type { NextRequest } from "next/server";
import { verifyHandshake } from "@/lib/whatsapp";

// https://mallzo.shop/wp/verify-token also answers Meta's verification handshake.
export const GET = (req: NextRequest) => verifyHandshake(req);
