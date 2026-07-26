import type { NextApiRequest, NextApiResponse } from "next";
import { auth0 } from "../../../lib/auth0";

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token } = await auth0.getAccessToken(req, res);

  const params = new URLSearchParams();
  if (req.query.days) params.set("days", req.query.days as string);
  if (req.query.linkId) params.set("linkId", req.query.linkId as string);
  if (req.query.excludeBots) params.set("excludeBots", req.query.excludeBots as string);

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard?${params}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await response.text();
  if (!text) return res.status(response.status).end();
  try {
    return res.status(response.status).json(JSON.parse(text));
  } catch {
    return res.status(response.status).send(text);
  }
});
