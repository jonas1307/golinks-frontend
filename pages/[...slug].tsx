import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

interface SlugPageProps {
  slug: string;
  reason: "expired" | "usage_limit";
}

const messages = {
  expired: {
    title: "Link Expired",
    body: "has expired and is no longer available.",
  },
  usage_limit: {
    title: "Link Unavailable",
    body: "has reached its maximum number of uses.",
  },
};

const SlugPage = ({ slug, reason }: SlugPageProps) => {
  const { title, body } = messages[reason];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl font-bold text-gray-300">410</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">{title}</h2>
        <p className="mt-2 text-gray-500">
          The link <span className="font-medium text-gray-700">go/{slug}</span> {body}
        </p>
        <Link
          href="/"
          className="mt-8 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          Back to go/links
        </Link>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string[] };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${slug[0]}`,
      { redirect: "manual" }
    );

    if (res.status === 302 || res.status === 301) {
      const location = res.headers.get("location");

      if (location) {
        return {
          redirect: {
            destination: createRedirectUrl({
              linkUrl: location,
              linkAlias: slug[0],
              contextAlias: slug,
            }),
            permanent: false,
          },
        };
      }
    }

    if (res.status === 410) {
      context.res.statusCode = 410;
      const json = await res.json().catch(() => ({}));
      const reason =
        (json.detail as string)?.includes("usage limit") ? "usage_limit" : "expired";
      return { props: { slug: slug[0], reason } };
    }

    if (res.status === 404) {
      return { notFound: true };
    }

    if (res.status >= 500) {
      throw new Error(`Backend error: ${res.status}`);
    }
  } catch (err) {
    if ((err as { digest?: string })?.digest !== undefined) throw err;
    throw new Error("Failed to reach the redirect service.");
  }

  return { notFound: true };
};

interface CreateRedirectUrlProps {
  linkUrl: string;
  linkAlias: string;
  contextAlias: string[];
}

const createRedirectUrl = ({
  linkUrl,
  linkAlias,
  contextAlias,
}: CreateRedirectUrlProps) => {
  const urlParameters = linkUrl.match(/\$(\d+)/g);

  if (urlParameters?.length) {
    const parameters = contextAlias.filter(
      (param) => param !== linkAlias && !linkAlias.includes(param)
    );

    const finalUrl = urlParameters.reduce((acc, urlParam, index) => {
      const parameter = parameters[index] ?? "";
      return acc.replace(urlParam, parameter);
    }, linkUrl);

    return finalUrl;
  }

  return linkUrl;
};

export default SlugPage;
