import type { NextApiRequest, NextApiResponse } from "next";
import { auth0 } from "../../../lib/auth0";

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token } = await auth0.getAccessToken(req, res);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/backfill-ua`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const text = await response.text();
  if (!text) return res.status(response.status).end();
  try {
    return res.status(response.status).json(JSON.parse(text));
  } catch {
    return res.status(response.status).send(text);
  }
});
