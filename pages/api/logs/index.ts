import type { NextApiRequest, NextApiResponse } from "next";
import { auth0 } from "../../../lib/auth0";

async function proxyJson(upstream: Response, res: NextApiResponse) {
  const text = await upstream.text();
  if (!text) return res.status(upstream.status).end();
  try {
    return res.status(upstream.status).json(JSON.parse(text));
  } catch {
    return res.status(upstream.status).send(text);
  }
}

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token } = await auth0.getAccessToken(req, res);
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logs`);

  Object.keys(req.query).forEach((key) => {
    const val = req.query[key];
    if (val !== undefined && val !== "") {
      url.searchParams.append(key, val as string);
    }
  });

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return proxyJson(response, res);
});
