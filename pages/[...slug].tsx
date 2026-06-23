import { GetServerSideProps } from "next";

const SlugPage = () => null;

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
