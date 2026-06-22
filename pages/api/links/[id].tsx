import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiResponse } from "next";

async function proxyJson(upstream: Response, res: NextApiResponse) {
  const text = await upstream.text();
  if (!text) return res.status(upstream.status).end();
  try {
    return res.status(upstream.status).json(JSON.parse(text));
  } catch {
    return res.status(upstream.status).send(text);
  }
}

export default withApiAuthRequired(async (req, res) => {
  let response;
  let url: URL;

  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["golinks:user"],
  });

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/links/${id}`);
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return proxyJson(response, res);

    case "PUT":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/links/${id}`);
      response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      return proxyJson(response, res);

    case "DELETE":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/links/${id}`);
      response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return proxyJson(response, res);

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return res;
  }
});
