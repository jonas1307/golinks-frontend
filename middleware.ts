import { Auth0Client } from "@auth0/nextjs-auth0/server";
import type { NextRequest } from "next/server";

const auth0 = new Auth0Client();

export async function middleware(req: NextRequest) {
  return auth0.middleware(req);
}

export const config = {
  matcher: "/auth/:path*",
};
