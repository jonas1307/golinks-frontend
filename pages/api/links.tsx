import type { NextApiRequest, NextApiResponse } from "next";
import { auth0 } from "../../lib/auth0";

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
  let response;
  let url: URL;

  const { token } = await auth0.getAccessToken(req, res);

  const { query } = req;

  switch (req.method) {
    case "GET":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/links`);
      Object.keys(query).forEach((key) =>
        url.searchParams.append(key, query[key] as string)
      );

      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return proxyJson(response, res);

    case "POST":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/links`);

      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      return proxyJson(response, res);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return res;
  }
});
