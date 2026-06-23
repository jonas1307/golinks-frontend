import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

interface SlugPageProps {
  expired: boolean;
  slug: string;
}

const SlugPage = ({ expired, slug }: SlugPageProps) => {
  if (!expired) return null;

  return (
    <>
      <Head>
        <title>Link Expired</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl font-bold text-gray-300">410</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">Link Expired</h2>
        <p className="mt-2 text-gray-500">
          The link <span className="font-medium text-gray-700">go/{slug}</span> has expired and is no longer available.
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
      return { props: { expired: true, slug: slug[0] } };
    }
  } catch {
    // network error — fall through to 404
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
