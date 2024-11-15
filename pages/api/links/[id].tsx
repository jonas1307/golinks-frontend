import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async (req, res) => {
  let response;
  let url: any;

  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["golinks:user"],
  });

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Links/${id}`);
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.status(response.status).json(await response.json());

    case "PUT":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Links/${id}`);
      response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body, (k, v) => {
          return v === undefined ? null : v;
        }),
      });

      return res.status(response.status).json(await response.json());

    case "DELETE":
      url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Links/${id}`);
      response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.status(response.status).json(await response.json());

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return res;
  }
});
