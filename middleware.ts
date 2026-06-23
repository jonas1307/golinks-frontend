import { auth0 } from "./lib/auth0";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  return auth0.middleware(req);
}

export const config = {
  runtime: "nodejs",
  matcher: "/auth/:path*",
};
