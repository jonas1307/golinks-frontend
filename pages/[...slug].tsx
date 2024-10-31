import { GetServerSideProps } from "next";

interface SlugPageProps {
  slug: string;
}

const SlugPage = ({ slug }: SlugPageProps) => {
  return (
    <div>
      <h1>Slug not found: {slug}</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const contextAlias = context.query.alias as string[];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Actions/RegisterAccess/${slug}`
  );

  if (res.status === 200) {
    const response = context.res;
    const link = (await res.json()).data;

    response.writeHead(302, {
      Location: createRedirectUrl({
        linkUrl: link.url,
        linkAlias: link.slug,
        contextAlias,
      }),
    });

    response.end();
  }

  return {
    props: {
      slug,
    },
  };
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
