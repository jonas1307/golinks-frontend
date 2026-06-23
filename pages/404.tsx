import Head from "next/head";
import Link from "next/link";

const NotFound = () => (
  <>
    <Head>
      <title>Page Not Found</title>
    </Head>
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mt-2 text-gray-500">
        The link you followed doesn&apos;t exist or may have been removed.
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

export default NotFound;
